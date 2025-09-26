'use client';

import { useState } from 'react';
import type { ICard, IColumn } from '../types/board';

export function useBoardCards(initialColumns: IColumn[]) {
    const [columns, setColumns] = useState<IColumn[]>(initialColumns);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);

    // Добавление новой карточки
    const addCard = (columnId: string, title: string, content?: string) => {
        if (!title.trim()) return;

        const newCard: ICard = {
            id: `card-${Date.now()}`,
            title: title.trim(),
            content: content?.trim(),
            order: 0,
            columnId,
        };

        setColumns((prevColumns) =>
            prevColumns.map((column) =>
                column.id === columnId
                    ? {
                          ...column,
                          cards: [newCard, ...column.cards].map(
                              (card, ind) => ({
                                  ...card,
                                  order: ind,
                              })
                          ),
                      }
                    : column
            )
        );
    };

    // Удаление карточки
    const deleteCard = (cardId: string) => {
        setColumns((prevColumns) =>
            prevColumns.map((column) => ({
                ...column,
                cards: column.cards
                    .filter((card) => card.id !== cardId)
                    .map((card, ind) => ({ ...card, order: ind })),
            }))
        );
    };

    // Обновление карточки
    const updateCard = (cardId: string, updates: Partial<ICard>) => {
        setColumns((prevColumns) =>
            prevColumns.map((column) => ({
                ...column,
                cards: column.cards.map((card) =>
                    card.id === cardId ? { ...card, ...updates } : card
                ),
            }))
        );
    };

    // Начало редактирования
    const startEditing = (cardId: string) => {
        setEditingCardId(cardId);
    };

    // Конец редактирования
    const stopEditing = () => {
        setEditingCardId(null);
    };

    return {
        columns,
        editingCardId,
        addCard,
        deleteCard,
        updateCard,
        startEditing,
        stopEditing,
    };
}
