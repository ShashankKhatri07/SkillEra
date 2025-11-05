import { ApsBrand } from './ApsBrand';
import { MenuIcon } from './icons/MenuIcon';

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
    return (
        <header 
            className="md:hidden flex items-center justify-between p-4 sticky top-0 z-30 shadow-sm"
            style={{ backgroundColor: 'var(--color-bg-main)', borderBottom: `1px solid var(--color-border)` }}
        >
            <ApsBrand layout="horizontal" />
            <button onClick={onMenuClick} className="p-2" style={{ color: 'var(--color-text-main)' }}>
                <MenuIcon className="w-6 h-6" />
            </button>
        </header>
    );
};