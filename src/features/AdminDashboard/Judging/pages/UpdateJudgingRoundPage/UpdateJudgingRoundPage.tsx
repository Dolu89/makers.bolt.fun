import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  CreateOrUpdateJudgingRoundInput,
  useGetProjectsInTournamentQuery,
} from "src/graphql";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderData } from "./updateJudgingPageData.loader";
import CreateJudgingRoundForm from "./CreateJudgingRoundForm";
import { useTournament } from "src/features/AdminDashboard/Tournaments/pages/ManageTournamentPage/TournamentDetailsContext";

const schema: yup.SchemaOf<CreateOrUpdateJudgingRoundInput> = yup
  .object({
    id: yup.string().required(),
    title: yup.string().required().min(3),
    description: yup.string().required().min(10),
    end_date: yup.date().required(),
    tournament_id: yup.number().required(),
    judges_ids: yup.array(yup.number().required()).required(),
    projects_ids: yup.array(yup.number().required()).required(),
  })
  .required();

export type UpdateJudgingRoundFormType = yup.InferType<typeof schema>;

export default function UpdateJudgingRoundPage() {
  const loaderData = useLoaderData() as LoaderData;

  const { tournamentDetails } = useTournament();

  const projectsInTournamentQuery = useGetProjectsInTournamentQuery({
    variables: {
      tournamentId: tournamentDetails.id,
      skip: 0,
      take: 999,
      trackId: null,
      roleId: null,
      search: null,
    },
  });

  const roundData = loaderData.getJudgingRoundById;
  const { roundId: id } = useParams<{ roundId: string }>();

  if (!id) throw new Error("No judging round id provided");

  const formMethods = useForm<UpdateJudgingRoundFormType>({
    resolver: yupResolver(schema) as Resolver<UpdateJudgingRoundFormType>,
    defaultValues: {
      id: roundData.id,
      title: roundData.title,
      description: roundData.description,
      end_date: new Date(roundData.end_date),
      tournament_id: roundData.tournament.id,
      judges_ids: roundData.judges.map((judge) => judge.id),
      projects_ids: roundData.projects.map((project) => project.id),
    },
  });

  const projectsInTournament =
    projectsInTournamentQuery.data?.getProjectsInTournament.projects;

  return (
    <FormProvider {...formMethods}>
      <h2 className="text-h2 font-bolder mb-24">Update Judging Round</h2>
      <CreateJudgingRoundForm
        roundId={roundData.id}
        projectsInTournament={projectsInTournament ?? []}
        initialJudges={roundData.judges}
      />
    </FormProvider>
    // Check the badges form
  );
}
