'use client';

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { Column } from '@/components/column/Column';
import { CardItem } from '@/components/card/CardItem';
// import { useColumns } from '@/hooks/useColumns';
// import { useDnDActionsEnhanced } from '@/hooks/useDnDActionsEnhanced';
import { useSmartColumns } from '@/hooks/useSmartBoards';
import { useSmartDnDActions } from '@/hooks/useSmartDnDActions';
import { useState } from 'react';
import type { ICard } from '@/types/board';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { cn } from '@/lib/utils/cn';

interface DndBoardProps {
    boardId: string;
}

export function DndBoard({ boardId }: DndBoardProps) {
    const [activeCard, setActiveCard] = useState<ICard | null>(null);

    const { data: columns = [], isLoading, error } = useSmartColumns(boardId);
    const { handleCardMove } = useSmartDnDActions();

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        // Находим активную карточку по всем колонкам
        for (const column of columns) {
            const card = column.cards?.find((c) => c.id === active.id);
            if (card) {
                setActiveCard(card);
                break;
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        handleCardMove(event);
        setActiveCard(null);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    if (isLoading) {
        return <div className="p-6">Загрузка колонок...</div>;
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded">
                Ошибка загрузки колонок: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Список колонок */}
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {columns.map((column) => (
                        <Column key={column.id} column={column} />
                    ))}
                </div>

                {/* Overlay при перетаскивании */}
                <DragOverlay>
                    {activeCard ? (
                        <div
                            className={cn(
                                'opacity-80 rotate-3 transform scale-105'
                            )}
                        >
                            <CardItem
                                card={activeCard}
                                columnId={activeCard.columnId}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
