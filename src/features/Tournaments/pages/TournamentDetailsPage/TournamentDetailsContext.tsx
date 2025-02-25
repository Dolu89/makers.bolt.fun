import React, { createContext, PropsWithChildren, useContext } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "src/Components/LoadingPage/LoadingPage";
import NotFoundPage from "src/features/Shared/pages/NotFoundPage/NotFoundPage";
import {
  GetTournamentByIdQuery,
  MeTournamentQuery,
  useGetTournamentByIdQuery,
  useMeTournamentQuery,
} from "src/graphql";
import { TournamentStaticData } from "../types";

interface ITournamentDetails {
  makers: GetTournamentByIdQuery["getMakersInTournament"]["makers"];
  me: MeTournamentQuery["me"];
  tournamentDetails: GetTournamentByIdQuery["getTournamentById"];
  myParticipationInfo: MeTournamentQuery["tournamentParticipationInfo"];
  pubkeysOfMakersInTournament: string[];
  pubkeysOfProjectsInTournament: string[];
}

const Ctx = createContext<ITournamentDetails>(null!);

let currentTournamentStaticData: TournamentStaticData | null = null;

export default function TournamentDetailsContext({
  children,
}: PropsWithChildren<{}>) {
  const { id: idOrSlug } = useParams();

  const tournaemntQuery = useGetTournamentByIdQuery({
    variables: {
      idOrSlug: idOrSlug!,
    },
    skip: !idOrSlug,
  });

  const tournamentId = tournaemntQuery.data?.getTournamentById?.id;

  const myParticipationInfoQuery = useMeTournamentQuery({
    variables: {
      id: Number(tournamentId)!,
    },
    skip: !tournamentId,
  });

  if (tournaemntQuery.loading || myParticipationInfoQuery.loading)
    return <LoadingPage />;

  if (!tournaemntQuery.data?.getTournamentById) return <NotFoundPage />;

  const {
    getMakersInTournament: makers,
    getTournamentById: tournamentDetails,
    pubkeysOfMakersInTournament,
    pubkeysOfProjectsInTournament,
  } = tournaemntQuery.data;
  const { me = null, tournamentParticipationInfo: myParticipationInfo = null } =
    myParticipationInfoQuery.data ?? {};

  return (
    <Ctx.Provider
      value={{
        makers: makers.makers,
        me,
        tournamentDetails,
        myParticipationInfo,
        pubkeysOfMakersInTournament,
        pubkeysOfProjectsInTournament,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useTournament = () => {
  return useContext(Ctx);
};

// TODO: Remove if not used later
export const getCurrentTournamentStaticData = () => {
  return currentTournamentStaticData;
};
