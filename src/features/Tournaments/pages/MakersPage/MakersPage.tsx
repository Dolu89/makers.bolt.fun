import { useMeTournamentQuery, User, } from 'src/graphql'
import { useTournament } from '../TournamentDetailsPage/TournamentDetailsContext';
import MakerCard from './MakerCard/MakerCard';
import MakerCardSkeleton from './MakerCard/MakerCard.Skeleton';
import ParticipantsSection from './ParticipantsSection/ParticipantsSection';



export default function MakersPage() {

    const { tournamentDetails: { id } } = useTournament()

    const query = useMeTournamentQuery({
        variables: { id }
    });

    return (
        <div className='pb-42'>
            <div className="flex flex-col gap-16 lg:gap-24">
                {query.loading ?
                    <MakerCardSkeleton />
                    :
                    (query.data?.me && !!query.data.tournamentParticipationInfo) ?
                        <MakerCard isMe maker={{ user: query.data.me as User, hacking_status: query.data.tournamentParticipationInfo?.hacking_status! }} />
                        : null
                }
                <ParticipantsSection tournamentId={id} />
            </div>

        </div>
    )
}
