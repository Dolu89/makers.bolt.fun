import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import OgTags from "src/Components/OgTags/OgTags";
import DefaultBadgeImage from "./default-badge-image.svg";

import { CreateOrUpdateBadgeInput } from "src/graphql";
import * as yup from "yup";
import CreateBadgeForm from "./CreateBadgeForm";
import PreviewBadgeCard from "./PreviewBadgeCard";
import { useNavigate } from "react-router-dom";
import { createRoute } from "src/utils/routing";
import { useNavigateBack } from "src/utils/hooks";
import { FiArrowLeft } from "react-icons/fi";
import { withProviders } from "src/utils/hoc";
import { RelayPoolProvider } from "src/lib/nostr";

const schema: yup.SchemaOf<Omit<CreateOrUpdateBadgeInput, "id">> = yup
  .object({
    title: yup.string().required().min(3),
    slug: yup.string().required().min(3),
    description: yup.string().required().min(10),
    image: yup.string().required(),
    color: yup.string(),
    isAdminIssuedOnly: yup.boolean().required(),
    winningDescriptionTemplate: yup.string().required(),
    badgeDefinitionNostrEventId: yup.string().nullable(),
    incrementsNeeded: yup.number().nullable(),
    incrementOnActionId: yup.number().nullable(),
  })
  .required();

export type CreateBadgeFormType = yup.InferType<typeof schema>;

function CreateBadgePage() {
  const navigateBack = useNavigateBack(
    createRoute({ type: "admin-badges", page: "list" })
  );
  const navigate = useNavigate();
  const formMethods = useForm<CreateBadgeFormType>({
    resolver: yupResolver(schema) as Resolver<CreateBadgeFormType>,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      image: DefaultBadgeImage,
      color: "#8B5CF6",
      winningDescriptionTemplate: "",
      badgeDefinitionNostrEventId: null,
      isAdminIssuedOnly: true,
      incrementsNeeded: null,
      incrementOnActionId: null,
    },
  });

  return (
    <>
      <OgTags title={"Create New Badge"} description={""} />
      <div className={`page-container`}>
        <button
          className={`
       w-max p-8 rounded flex justify-center items-center gap-8 text-gray-500 hover:bg-gray-50 active:bg-gray-100
        `}
          onClick={navigateBack}
        >
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-h1 font-bolder mb-24">Create New Badge</h1>
        <FormProvider {...formMethods}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,520px)_minmax(420px,1fr)] gap-24 items-center">
            <div className="">
              <CreateBadgeForm
                onCreated={(createdBadge) =>
                  navigate(
                    createRoute({
                      type: "admin-badges",
                      page: "details",
                      idOrSlug: createdBadge.slug,
                    })
                  )
                }
              />
            </div>
            <div>
              <PreviewBadgeCard />
            </div>
          </div>
        </FormProvider>
      </div>
    </>
  );
}

export default withProviders(RelayPoolProvider)(CreateBadgePage);
