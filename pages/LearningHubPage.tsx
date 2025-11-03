import React, { useState, useMemo } from 'react';
import { mockLearningResources } from '../data/mockData';
import { ResourceCard } from '../components/ResourceCard';
import { Student } from '../types';
import { InterestSetupPrompt } from '../components/InterestSetupPrompt';
// FIX: Corrected import path for Page type.
import { Page } from '../layouts/MainLayout';

interface LearningHubPageProps {
    user: Student;
    onNavigate: (page: Page) => void;
}

export const LearningHubPage = ({ user, onNavigate }: LearningHubPageProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    
    const allTypes = useMemo(() => {
        const types = new Set<string>();
        mockLearningResources.forEach(res => types.add(res.type));
        return ['all', ...Array.from(types).sort()];
    }, []);

    const recommendedResources = useMemo(() => {
        if (!user.interests || user.interests.length === 0) {
            return [];
        }
        const interestSet = new Set(user.interests.map(i => i.toLowerCase()));
        return mockLearningResources.filter(resource => 
            resource.tags.some(tag => interestSet.has(tag.toLowerCase()))
        );
    }, [user.interests]);

    const filteredResources = useMemo(() => {
        return mockLearningResources.filter(resource => {
            const matchesType = typeFilter === 'all' || resource.type === typeFilter;
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  resource.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [searchTerm, typeFilter]);

    const hasNoInterests = !user.interests || user.interests.length === 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Learning Hub</h1>
                <p className="text-lg mt-1" style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>Explore resources to enhance your skills.</p>
            </div>

            {hasNoInterests ? (
                <InterestSetupPrompt onGoToProfile={() => onNavigate('profile')} />
            ) : (
                <>
                    {recommendedResources.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendedResources.map(resource => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
            
            <div>
                <h2 className="text-2xl font-bold mb-4">{hasNoInterests ? 'All Resources' : 'Explore All Resources'}</h2>
                 <div className="flex flex-col sm:flex-row gap-4 sticky top-0 py-2 backdrop-blur-sm z-10">
                    <input 
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/2 lg:w-1/3 rounded-lg p-3 bg-white border border-slate-300 focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': 'var(--color-primary)'} as React.CSSProperties}
                    />
                    <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full sm:w-auto rounded-lg p-3 bg-white border border-slate-300 focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': 'var(--color-primary)'} as React.CSSProperties}
                    >
                        {allTypes.map(type => (
                            <option key={type} value={type} className="capitalize">{type === 'all' ? 'All Types' : type}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
                {filteredResources.length === 0 && (
                    <div className="text-center py-12 col-span-full">
                        <p className="font-semibold text-lg">No resources found</p>
                        <p style={{color: 'rgba(var(--color-text-main-rgb), 0.7)'}}>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};