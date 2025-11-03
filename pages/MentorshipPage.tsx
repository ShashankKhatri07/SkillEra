import { Student } from '../types';
import { Card } from '../components/Card';
import { MentorCard } from '../components/MentorCard';

interface MentorshipPageProps {
    mentors: Student[];
    peers: Student[];
    onSendMessage: (receiverId: string, text: string) => void;
}

export const MentorshipPage = ({ mentors, peers, onSendMessage }: MentorshipPageProps) => {
    const handleConnect = (userId: string) => {
        // This is a simplified connect action. In a real app, this might navigate to the messages page
        // with this user pre-selected. For now, we'll send a pre-canned message.
        onSendMessage(userId, `Hi! I'd like to connect regarding mentorship.`);
        alert(`A connection request has been sent! You can find the conversation in your Messages.`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Mentorship Hub</h1>
                <p className="text-lg mt-1" style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>Connect with mentors and peers for guidance and support.</p>
            </div>

            <Card title="Available Mentors">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.map(mentor => (
                        <MentorCard key={mentor.id} user={mentor} onConnect={handleConnect} />
                    ))}
                </div>
                {mentors.length === 0 && <p className="text-center py-8 opacity-70">No mentors are available at this time.</p>}
            </Card>

             <Card title="Peer Connect">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {peers.map(peer => (
                        <MentorCard key={peer.id} user={peer} isPeer={true} onConnect={handleConnect} />
                    ))}
                </div>
                {peers.length === 0 && <p className="text-center py-8 opacity-70">No other students available to connect.</p>}
            </Card>
        </div>
    );
};