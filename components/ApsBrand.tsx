import { ApsLogo } from './icons/ApsLogo';

interface ApsBrandProps {
    layout?: 'vertical' | 'horizontal';
}

export const ApsBrand = ({ layout = 'vertical' }: ApsBrandProps) => {
    const containerClasses = layout === 'horizontal' ? 'flex items-center gap-3' : 'flex flex-col items-center';

    return (
        <div className={containerClasses}>
            <ApsLogo className="w-auto h-12" />
        </div>
    );
};