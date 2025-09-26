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
import { useBoardDnd } from '../../hooks/use-board-dnd';
import { cn } from '@/lib/utils/cn';
import { type IBoard } from '../../types/board';

interface BoardViewProps {
    initialBoard?: IBoard;
}

// Тестовые данные (позже заменим на реальные с API)
const mockBoard: IBoard = {
    id: '1',
    title: 'Мой проект',
    description: 'Тестовая доска',
    userId: 'user-1',
    columns: [
        {
            id: 'col-1',
            title: 'To Do',
            order: 0,
            boardId: '1',
            cards: [
                {
                    id: 'card-1',
                    title: 'Создать компонент доски',
                    content: 'Реализовать базовый интерфейс',
                    order: 0,
                    columnId: 'col-1',
                },
                {
                    id: 'card-2',
                    title: 'Настроить DnD логику',
                    content: 'Добавить перетаскивание карточек',
                    order: 1,
                    columnId: 'col-1',
                },
            ],
        },
        {
            id: 'col-2',
            title: 'In Progress',
            order: 1,
            boardId: '1',
            cards: [
                {
                    id: 'card-3',
                    title: 'Стилизовать компоненты',
                    content: 'Добавить Tailwind CSS',
                    order: 0,
                    columnId: 'col-2',
                },
            ],
        },
        {
            id: 'col-3',
            title: 'Done',
            order: 2,
            boardId: '1',
            cards: [
                {
                    id: 'card-4',
                    title: 'Инициализировать проект',
                    content: 'Настроить Next.js и зависимости',
                    order: 0,
                    columnId: 'col-3',
                },
            ],
        },
    ],
};

export function BoardView({ initialBoard = mockBoard }: BoardViewProps) {
    const { board, activeCard, addCard, handleDragEnd, handleDragStart } =
        useBoardDnd(initialBoard);

    // настройка сенсоров для разных устройств
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // минимальное расстояние ля начала перетаскивания
            },
        })
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {board.title}
                </h1>
                {board.description && (
                    <p className="text-gray-600 mt-2">{board.description}</p>
                )}
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Список колонок */}
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {board.columns.map((column) => {
                        return (
                            <BoardColumn
                                key={column.id}
                                column={column}
                                onAddCard={addCard}
                            />
                        );
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
