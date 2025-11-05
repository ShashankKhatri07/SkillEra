import { Card } from '../Card';

interface ChartData {
    label: string;
    value: number;
}

interface ClassPerformanceChartProps {
    title: string;
    data: ChartData[];
    color: string;
    unit?: string;
}

export const ClassPerformanceChart = ({ title, data, color, unit = '' }: ClassPerformanceChartProps) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);

    return (
        <Card style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4">{title}</h3>
            <div className="flex items-end h-48 gap-4 px-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                            className="relative w-full flex-grow flex items-end justify-center rounded-t-md"
                            style={{ backgroundColor: 'rgba(var(--color-text-main-rgb), 0.1)' }}
                        >
                            <div
                                className="w-full rounded-t-md transition-all duration-700 ease-out"
                                style={{
                                    height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                                    backgroundColor: color,
                                }}
                            >
                                <div className="text-xs font-bold text-center -mt-5" style={{ color: 'var(--color-text-main)' }}>
                                    {item.value.toFixed(0)}{unit}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-semibold opacity-80">{item.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};