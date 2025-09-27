import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IBoard, ICard, IColumn } from '@/features/boards/types/board';

interface BoardState {
    currentBoard: IBoard | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BoardState = {
    currentBoard: null,
    isLoading: false,
    error: null,
};

// Тестовые данные
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
            ],
        },
        {
            id: 'col-2',
            title: 'In Progress',
            order: 1,
            boardId: '1',
            cards: [
                {
                    id: 'card-2',
                    title: 'Настроить Redux store',
                    content: 'Перенести состояние в Redux Toolkit',
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
                    id: 'card-3',
                    title: 'Инициализировать проект',
                    content: 'Настроить Next.js и зависимости',
                    order: 0,
                    columnId: 'col-3',
                },
            ],
        },
    ],
};

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        ...initialState,
        currentBoard: mockBoard,
    },
    reducers: {
        // добавление карточки
        addCard: (
            state,
            action: PayloadAction<{
                columnId: string;
                title: string;
                content?: string;
            }>
        ) => {
            if (!state.currentBoard) return;

            const { columnId, title, content } = action.payload;
            if (!title.trim()) return;

            const newCard: ICard = {
                id: `card-${Date.now()}`,
                title: title.trim(),
                content: content?.trim(),
                order: 0,
                columnId,
            };

            const columnIndex = state.currentBoard.columns.findIndex(
                (col) => col.id === columnId
            );

            if (columnIndex !== -1) {
                // добавляем в начало
                state.currentBoard.columns[columnIndex].cards.unshift(newCard);

                // Обновляем порядок
                state.currentBoard.columns[columnIndex].cards =
                    state.currentBoard.columns[columnIndex].cards.map(
                        (card, index) => ({
                            ...card,
                            order: index,
                        })
                    );
            }
        },

        // Удаление карточки
        deleteCard: (state, action: PayloadAction<{ cardId: string }>) => {
            if (!state.currentBoard) return;

            const { cardId } = action.payload;

            state.currentBoard.columns = state.currentBoard.columns.map(
                (column) => ({
                    ...column,
                    cards: column.cards
                        .filter((card) => card.id !== cardId)
                        .map((card, index) => ({ ...card, order: index })),
                })
            );
        },

        // Обновление карточки
        updateCard: (
            state,
            action: PayloadAction<{
                cardId: string;
                updates: Partial<ICard>;
            }>
        ) => {
            if (!state.currentBoard) return;

            const { cardId, updates } = action.payload;

            state.currentBoard.columns = state.currentBoard.columns.map(
                (column) => ({
                    ...column,
                    cards: column.cards.map((card) =>
                        card.id === cardId ? { ...card, ...updates } : card
                    ),
                })
            );
        },

        // Перемещение карточки (DnD)
        moveCard: (
            state,
            action: PayloadAction<{
                activeId: string;
                overId: string;
            }>
        ) => {
            if (!state.currentBoard) return;

            const { activeId, overId } = action.payload;

            // Находим исходную колонку и карточку
            let sourceColumnIndex = -1;
            let sourceCardIndex = -1;
            let sourceCard: ICard | null = null;

            for (let i = 0; i < state.currentBoard.columns.length; i++) {
                const cardIndex = state.currentBoard.columns[i].cards.findIndex(
                    (card) => card.id === activeId
                );
                if (cardIndex !== -1) {
                    sourceColumnIndex = i;
                    sourceCardIndex = cardIndex;
                    sourceCard = state.currentBoard.columns[i].cards[cardIndex];
                    break;
                }
            }

            if (!sourceCard) return;

            // Создаем копию колонок для иммутабельного обновления
            const newColumns = [...state.currentBoard.columns];

            // Удаляем карточку из исходной колонки
            newColumns[sourceColumnIndex].cards.splice(sourceCardIndex, 1);

            // Находим целевую колонку
            const overColumnIndex = newColumns.findIndex(
                (col) =>
                    col.cards.some((card) => card.id === overId) ||
                    col.id === overId
            );

            if (overColumnIndex === -1) return;

            const targetColumn = newColumns[overColumnIndex];

            // Находим позицию для вставки
            const overCardIndex = targetColumn.cards.findIndex(
                (card) => card.id === overId
            );

            if (overCardIndex === -1) {
                // Бросаем в колонку
                targetColumn.cards.unshift({
                    ...sourceCard,
                    columnId: targetColumn.id,
                });
            } else {
                // Бросаем между карточками
                targetColumn.cards.splice(overCardIndex, 0, {
                    ...sourceCard,
                    columnId: targetColumn.id,
                });
            }

            // Обновляем порядок в целевой колонке
            newColumns[overColumnIndex].cards = targetColumn.cards.map(
                (card, index) => ({
                    ...card,
                    order: index,
                })
            );

            // Обновляем порядок в исходной колонке
            newColumns[sourceColumnIndex].cards = newColumns[
                sourceColumnIndex
            ].cards.map((card, index) => ({ ...card, order: index }));

            state.currentBoard.columns = newColumns;
        },

        // Установка ошибки
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Установка загрузки
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    addCard,
    deleteCard,
    updateCard,
    moveCard,
    setError,
    setLoading,
} = boardSlice.actions;

export default boardSlice.reducer;
