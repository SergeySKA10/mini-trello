'use client';

import { useState } from 'react';
import type {
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
} from '@dnd-kit/core';
import type { IBoard, IColumn, ICard } from '../types/board';

export function useBoardDnd(initialBoard: IBoard) {
    const [board, setBoard] = useState<IBoard>(initialBoard);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);

    // обработчик начала перетаскивания
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const cardId = active.id as string;

        // назоим активную карточку во всех колонках
        for (const column of board.columns) {
            const card = column.cards.find((c) => c.id === cardId);

            if (card) {
                setActiveCard(card);
                break;
            }
        }
    };

    // обработчик завершения перетаскивания
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveCard(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // логика перемещения карточек между колонками
        if (activeId !== overId) {
            setBoard((prevBoard) => {
                const newColumns = [...prevBoard.columns];

                // назодим исходную колонку и карточку
                let sourceColumnIndex = -1;
                let sourceCardIndex = -1;
                let sourceCard: ICard | null = null;

                for (let i = 0; i < newColumns.length; i++) {
                    const cardIndex = newColumns[i].cards.findIndex(
                        (c) => c.id === activeId
                    );

                    if (cardIndex !== -1) {
                        sourceColumnIndex = i;
                        sourceCardIndex = cardIndex;
                        sourceCard = newColumns[i].cards[cardIndex];
                        break;
                    }
                }

                if (!sourceCard) return prevBoard;

                // удаляем карточку из исходной колонки
                newColumns[sourceColumnIndex].cards.splice(sourceCardIndex, 1);

                // находим целевую колонку
                const overColumnIndex = newColumns.findIndex(
                    (col) =>
                        col.cards.some((card) => card.id === overId) ||
                        col.id === overId
                );

                if (overColumnIndex === -1) return prevBoard;

                const targetColumn = newColumns[overColumnIndex];

                // Находим позицию для вставки
                const overCardIndex = targetColumn.cards.findIndex(
                    (card) => card.id === overId
                );

                if (overCardIndex === -1) {
                    // если сброс в колонку
                    targetColumn.cards.push({
                        ...sourceCard,
                        columnId: targetColumn.id,
                    });
                } else {
                    // если между карточками
                    targetColumn.cards.splice(overCardIndex, 0, {
                        ...sourceCard,
                        columnId: targetColumn.id,
                    });
                }

                // обновление порядка карточек
                targetColumn.cards = targetColumn.cards.map((card, ind) => ({
                    ...card,
                    order: ind,
                }));

                return {
                    ...prevBoard,
                    columns: newColumns,
                };
            });
        }

        setActiveCard(null);
    };

    return {
        board,
        activeCard,
        handleDragStart,
        handleDragEnd,
    };
}
