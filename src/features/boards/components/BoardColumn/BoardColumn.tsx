import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BoardCard } from '../BoardCard/BoardCard';
import { Button } from '@/components/ui/Button/Button';
import { cn } from '@/lib/utils/cn';
import { Plus } from 'lucide-react';
import { type IColumn } from '../../types/board';

interface BoardColumnProps {
    column: IColumn;
}

export function BoardColumn({ column }: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'column',
            column,
        },
    });

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

            <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-500 hover:text-gray-700"
            >
                <Plus className="w-4 h-4 mr-2" />
                Добавить карточку
            </Button>
        </div>
    );
}
