'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { BoardCard } from '../BoardCard/BoardCard';
import { AddCardForm } from '../AddCardForm/addCardForm';
import { cn } from '@/lib/utils/cn';
import { Plus } from 'lucide-react';
import { type IColumn } from '../../types/board';

interface BoardColumnProps {
    column: IColumn;
    onAddCard: (columnId: string, title: string, content?: string) => void;
}

export function BoardColumn({ column, onAddCard }: BoardColumnProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);

    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'column',
            column,
        },
    });

    const handleAddCard = (
        columnId: string,
        title: string,
        content?: string
    ) => {
        onAddCard(columnId, title, content);
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
            {/*Заголовок колонки*/}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">
                    {column.cards.length}
                </span>
            </div>

            {/*Список карточек*/}

            <div className="flex-1 flex-col gap-3">
                <SortableContext
                    items={column.cards.map((card) => card.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {column.cards.map((card) => (
                        <BoardCard key={card.id} card={card} />
                    ))}
                </SortableContext>
            </div>

            {/* Форма добавления карточки */}
            {isAddingCard ? (
                <AddCardForm
                    columnId={column.id}
                    onAddCard={handleAddCard}
                    onCancel={() => setIsAddingCard(false)}
                    isOpen={isAddingCard}
                />
            ) : (
                <button
                    onClick={() => setIsAddingCard(true)}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm p-2 rounded hover:bg-gray-200 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить карточку
                </button>
            )}
        </div>
    );
}
