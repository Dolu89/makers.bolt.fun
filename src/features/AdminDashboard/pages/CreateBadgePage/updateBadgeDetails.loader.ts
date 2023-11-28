import { createLoader } from "src/utils/routing/helpers";
import {
  GetBadgeDetailsDocument,
  GetBadgeDetailsQuery,
  GetBadgeDetailsQueryVariables,
} from "src/graphql";

export type LoaderData = GetBadgeDetailsQuery;

export const updateBadgeDetailsLoader =
  createLoader<GetBadgeDetailsQueryVariables>(({ params }) => ({
    query: GetBadgeDetailsDocument,
    variables: { idOrSlug: params.idOrSlug! },
  }));
