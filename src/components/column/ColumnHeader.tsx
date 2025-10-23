'use client';

interface ColumnHeaderProps {
    title: string;
    cardsCount: number;
    isLoading?: boolean;
}

export function ColumnHeader({
    title,
    cardsCount,
    isLoading = false,
}: ColumnHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">
                {isLoading ? '...' : cardsCount}
            </span>
        </div>
    );
}
