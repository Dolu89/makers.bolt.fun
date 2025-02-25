const {
  intArg,
  objectType,
  extendType,
  nonNull,
  stringArg,
  arg,
  enumType,
} = require("nexus");
const { hexToUint8Array } = require("./helpers");
const { createHash } = require("crypto");
const { prisma } = require("../../../prisma");
const { CONSTS } = require("../../../utils");
const cacheService = require("../../../services/cache.service");
const { LightningAddress } = require("alby-tools");

// the types of items we can vote to
const VOTE_ITEM_TYPE = enumType({
  name: "VOTE_ITEM_TYPE",
  members: ["Story", "Bounty", "Question", "Project", "User", "PostComment"],
});

const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("amount_in_sat");
    t.nonNull.string("payment_request");
    t.nonNull.string("payment_hash");
    t.nonNull.boolean("paid");

    t.nonNull.field("item_type", {
      type: "VOTE_ITEM_TYPE",
    });
    t.nonNull.int("item_id");
  },
});

const LnurlDetails = objectType({
  name: "LnurlDetails",
  definition(t) {
    t.int("minSendable");
    t.int("maxSendable");
    t.string("metadata");
    t.int("commentAllowed");
  },
});

const getPrismaModelByType = (type) => {
  switch (type) {
    case "Story":
      return prisma.story;
    case "Question":
      return prisma.question;
    case "Project":
      return prisma.project;
    case "PostComment":
      return prisma.postComment;
    default:
      return null;
  }
};

const getLightningAddress = async (item_id, item_type) => {
  switch (item_type) {
    case "Story":
      return prisma.story
        .findUnique({
          where: { id: item_id },
          include: {
            user: {
              select: {
                lightning_address: true,
              },
            },
          },
        })
        .then((data) => data.user.lightning_address);
    case "Question":
      return prisma.question
        .findUnique({
          where: { id: item_id },
          include: {
            user: {
              select: {
                lightning_address: true,
              },
            },
          },
        })
        .then((data) => data.user.lightning_address);
    case "Project":
      return prisma.project
        .findUnique({
          where: { id: item_id },
          select: {
            lightning_address: true,
          },
        })
        .then((data) => data.lightning_address);
    case "PostComment":
      return prisma.postComment
        .findUnique({
          where: { id: item_id },
          include: {
            user: {
              select: {
                lightning_address: true,
              },
            },
          },
        })
        .then((data) => data.user.lightning_address);
    default:
      return null;
  }
};

// type => modal
// type => lightning address (pr)

// This is the new voting mutation, it can vote for any type of item that we define in the VOTE_ITEM_TYPE enum
const voteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("vote", {
      type: "Vote",
      args: {
        item_type: arg({
          type: nonNull("VOTE_ITEM_TYPE"),
        }),
        item_id: nonNull(intArg()),
        amount_in_sat: nonNull(intArg()),
      },
      resolve: async (_, args, ctx) => {
        const user = ctx.user;

        const { item_id, item_type, amount_in_sat } = args;
        const lightning_address =
          (await getLightningAddress(item_id, item_type)) ||
          CONSTS.BOLT_FUN_LIGHTNING_ADDRESS;

        const ln = new LightningAddress(lightning_address);
        await ln.fetch();

        const invoice = await ln.requestInvoice({
          satoshi: args.amount_in_sat,
          comment: "Tip from BOLT.FUN",
        });

        // #TODO remove votes rows that get added but not confirmed after some time
        // maybe using a scheduler, timeout, or whatever mean available

        return prisma.vote.create({
          data: {
            item_type: item_type,
            item_id: item_id,
            amount_in_sat: amount_in_sat,
            payment_request: invoice.paymentRequest,
            payment_hash: invoice.paymentHash,
            user_id: user?.id,
          },
        });
      },
    });
  },
});

const confirmVoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("confirmVote", {
      type: "Vote",
      args: {
        payment_request: nonNull(stringArg()),
        preimage: nonNull(stringArg()),
      },
      resolve: async (_, args) => {
        const paymentHash = createHash("sha256")
          .update(hexToUint8Array(args.preimage))
          .digest("hex");
        // look for a vote for the payment request and the calculated payment hash
        const vote = await prisma.vote.findFirst({
          where: {
            payment_request: args.payment_request,
            payment_hash: paymentHash,
          },
        });

        // if we find a vote it means the preimage is correct and we update the vote and mark it as paid
        // can we write this nicer?
        if (vote) {
          const model = getPrismaModelByType(vote.item_type);
          const item = await model.findUnique({
            where: { id: vote.item_id },
          });
          // count up votes cache
          const [voteObject] = await Promise.all([
            prisma.vote.update({
              where: { id: vote.id },
              data: {
                paid: true,
                preimage: args.preimage,
              },
            }),
            model.update({
              where: { id: item.id },
              data: {
                votes_count: item.votes_count + vote.amount_in_sat,
              },
            }),
            vote.item_type === "Story" &&
              cacheService.invalidateStoryById(item.id),
          ]);

          return voteObject;
        } else {
          throw new Error("Invalid preimage");
        }
      },
    });
  },
});

module.exports = {
  // Enums
  VOTE_ITEM_TYPE,

  // Types
  Vote,
  LnurlDetails,

  // Mutations
  voteMutation,
  confirmVoteMutation,
};
