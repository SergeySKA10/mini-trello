'use client';

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { BoardColumn } from '../BoardColumn/BoardColumn';
import { BoardCard } from '../BoardCard/BoardCard';
import { useAppSelector, useAppDispatch } from '@/stores/hooks/hooks';
import { useState } from 'react';
import { moveCard } from '@/stores/slices/board-slice';
import { cn } from '@/lib/utils/cn';
import type { ICard } from '../../types/board';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

export function BoardView() {
    const dispatch = useAppDispatch();
    const { currentBoard } = useAppSelector((state) => state.board);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);

    //Dnd логика
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const cardId = active.id as string;

        if (!currentBoard) return;

        for (const column of currentBoard.columns) {
            const card = column.cards.find((c) => c.id === cardId);
            if (card) {
                setActiveCard(card);
                break;
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active) {
            setActiveCard(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId !== overId) {
            dispatch(moveCard({ activeId, overId }));
        }

        setActiveCard(null);
    };

    // настройка сенсоров для разных устройств
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // минимальное расстояние ля начала перетаскивания
            },
        })
    );

    if (!currentBoard) {
        return <div>Доска не найдена</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {currentBoard.title}
                </h1>
                {currentBoard.description && (
                    <p className="text-gray-600 mt-2">
                        {currentBoard.description}
                    </p>
                )}
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Список колонок */}
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {currentBoard.columns.map((column) => {
                        return <BoardColumn key={column.id} column={column} />;
                    })}
                </div>

                {/* Overlay при перетаскивании */}
                <DragOverlay>
                    {activeCard ? (
                        <div
                            className={cn(
                                'opacity-80 rotate-3 transform scale-105'
                            )}
                        >
                            <BoardCard card={activeCard} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
