import { Badge } from '../types';
import { NoviceBadgeIcon } from '../components/icons/NoviceBadgeIcon';
import { GoalGetterBadgeIcon } from '../components/icons/GoalGetterBadgeIcon';
import { CompetitorBadgeIcon } from '../components/icons/CompetitorBadgeIcon';
import { ConsistentLearnerBadgeIcon } from '../components/icons/ConsistentLearnerBadgeIcon';
import { MasterBadgeIcon } from '../components/icons/MasterBadgeIcon';
import { VirtuosoBadgeIcon } from '../components/icons/VirtuosoBadgeIcon';
import { ChampionBadgeIcon } from '../components/icons/ChampionBadgeIcon';

export const allBadges: Badge[] = [
    {
        id: 'novice',
        name: 'Novice Achiever',
        description: 'Complete your first goal.',
        icon: NoviceBadgeIcon,
        pointsRequired: 10,
    },
    {
        id: 'getter',
        name: 'Goal Getter',
        description: 'Earn 50 points.',
        icon: GoalGetterBadgeIcon,
        pointsRequired: 50,
    },
    {
        id: 'competitor',
        name: 'Competitor',
        description: 'Earn 75 points.',
        icon: CompetitorBadgeIcon,
        pointsRequired: 75,
    },
    {
        id: 'consistent',
        name: 'Consistent Learner',
        description: 'Earn 100 points.',
        icon: ConsistentLearnerBadgeIcon,
        pointsRequired: 100,
    },
    {
        id: 'master',
        name: 'Skill Master',
        description: 'Earn 250 points.',
        icon: MasterBadgeIcon,
        pointsRequired: 250,
    },
    {
        id: 'virtuoso',
        name: 'Virtuoso',
        description: 'Earn 500 points.',
        icon: VirtuosoBadgeIcon,
        pointsRequired: 500,
    },
    {
        id: 'champion',
        name: 'Champion',
        description: 'Earn 1000 points.',
        icon: ChampionBadgeIcon,
        pointsRequired: 1000,
    },
];
