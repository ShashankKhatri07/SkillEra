import { Student } from '../types';
import { Leaderboard } from '../components/Leaderboard';

interface LeaderboardPageProps {
  allStudents: Student[];
}

export const LeaderboardPage = ({ allStudents }: LeaderboardPageProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      {/* The max-width constraint has been removed from this container */}
      <div>
        <Leaderboard students={allStudents} />
      </div>
    </div>
  );
};