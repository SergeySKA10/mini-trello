export interface ICard {
    id: string;
    title: string;
    content?: string;
    order: number;
    columnId: string;
}

export interface IColumn {
    id: string;
    title: string;
    order: number;
    cards: ICard[];
    boardId: string;
}

export interface IBoard {
    id: string;
    title: string;
    description?: string;
    columns: IColumn[];
    userId: string;
}

// типы для Drag and Drop
export interface DragData {
    type: 'card' | 'column';
    id: string;
    columnId?: string;
}

export interface Drop {
    id: string;
    type: 'column' | 'card';
}
