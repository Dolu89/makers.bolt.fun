const { ApolloServer } = require("apollo-server-lambda");
const schema = require('./schema')
const extractKeyFromCookie = require("../../utils/extractKeyFromCookie");



const server = new ApolloServer({
  schema,
  context: async ({ event }) => {
    const userPubKey = await extractKeyFromCookie(event.headers.cookie ?? event.headers.Cookie)
    return { userPubKey }
  },
});



const apolloHandler = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    }
  }
});


// https://github.com/vendia/serverless-express/issues/427#issuecomment-924580007
const handler = (event, context, ...args) => {

  return apolloHandler(
    {
      ...event,
      requestContext: context,
    },
    context,
    ...args
  );
};

exports.handler = handler;
