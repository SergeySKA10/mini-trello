'use client';

import type { ICard } from '@/types/board';

interface CardContentProps {
    card: ICard;
}

export function CardContent({ card }: CardContentProps) {
    return (
        <div className="min-w-0">
            <h3 className="font-medium text-gray-900 break-words">
                {card.title}
            </h3>
            {card.content && (
                <p className="mt-2 text-sm text-gray-600 break-words">
                    {card.content}
                </p>
            )}
        </div>
    );
}
