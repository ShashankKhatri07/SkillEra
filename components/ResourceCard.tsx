import React from 'react';
import { LearningResource } from '../types';
import { Card } from './Card';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { VideoIcon } from './icons/VideoIcon';
import { FileTextIcon } from './icons/FileTextIcon';

interface ResourceCardProps {
    resource: LearningResource;
}

const ResourceIcon = ({ type }: { type: LearningResource['type'] }) => {
    const props = { className: "w-5 h-5" };
    switch (type) {
        case 'video': return <VideoIcon {...props} />;
        case 'article': return <BookOpenIcon {...props} />;
        case 'pdf': return <FileTextIcon {...props} />;
        default: return <BookOpenIcon {...props} />;
    }
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full">
            <Card className="flex flex-col h-full hover:border-[var(--color-primary)] transition-colors">
                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{resource.title}</h3>
                        <div className="p-2 rounded-full" style={{ backgroundColor: 'rgba(var(--color-primary-rgb),0.1)', color: 'var(--color-primary)'}}>
                             <ResourceIcon type={resource.type} />
                        </div>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{resource.description}</p>
                </div>
                 <div className="flex flex-wrap gap-2 mt-4">
                    {resource.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full capitalize" style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>
        </a>
    );
};
