import { Student } from '../types';
import { PointsProgressBar } from '../components/PointsProgressBar';
import { Rewards } from '../components/Rewards';

interface RewardsPageProps {
  user: Student;
}

export const RewardsPage = ({ user }: RewardsPageProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Rewards</h1>
      <PointsProgressBar userPoints={user.points} />
      <Rewards userPoints={user.points} />
    </div>
  );
};