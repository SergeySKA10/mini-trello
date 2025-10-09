'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { CardItem } from '@/components/card/CardItem';
import { CardForm } from '@/components/card/CardForm';
import { useCards } from '@/hooks/useCards';
import { useCreateCardWithOptimistic } from '@/hooks/useCardWithOptimistic';
import type { IColumn } from '@/types/board';
import { cn } from '@/lib/utils/cn';
import { Plus } from 'lucide-react';

interface ColumnProps {
    column: IColumn;
}

export function Column({ column }: ColumnProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);

    const { data: cards = [], isLoading } = useCards(column.id);
    const createCardMutation = useCreateCardWithOptimistic();

    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'column',
            column,
        },
    });

    const handleAddCard = async (data: { title: string; content?: string }) => {
        try {
            await createCardMutation.mutateAsync({
                columnId: column.id,
                order: 0,
                ...data,
            });
            setIsAddingCard(false);
        } catch (error) {
            console.error('Failed to create card:', error);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingCard(false);
    };

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'w-80 bg-gray-50 rounded-lg p-4 flex flex-col gap-4 min-h-[600px]',
                {
                    'bg-blue-50 border-2 border-blue-200 border-dashed': isOver,
                }
            )}
        >
            {/* Заголовок колонки */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">
                    {isLoading ? '...' : cards.length}
                </span>
            </div>

            {/* Список карточек */}
            <div className="flex-1 flex flex-col gap-3">
                <SortableContext
                    items={cards.map((card) => card.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {cards.map((card) => (
                        <CardItem
                            key={card.id}
                            card={card}
                            columnId={column.id}
                        />
                    ))}
                </SortableContext>

                {/* Форма добавления карточки */}
                {isAddingCard && (
                    <CardForm
                        columnId={column.id}
                        onSubmit={handleAddCard}
                        onCancel={handleCancelAdd}
                        isSubmitting={createCardMutation.isPending}
                    />
                )}
            </div>

            {/* Кнопка добавления карточки */}
            {!isAddingCard && (
                <button
                    onClick={() => setIsAddingCard(true)}
                    disabled={createCardMutation.isPending}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить карточку
                </button>
            )}
        </div>
    );
}
