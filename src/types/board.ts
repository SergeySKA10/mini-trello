export interface IBoard {
    id: string;
    title: string;
    description: string;
    userId: string;
    columns: IColumn[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IColumn {
    id: string;
    title: string;
    order: number;
    boardId: string;
    cards: ICard[];
    createdAt?: string;
}

export interface ICard {
    id: string;
    title: string;
    content?: string;
    order: number;
    columnId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DragData {
    type: 'card' | 'column';
    card?: ICard;
    column?: IColumn;
}

export interface DropResult {
    destination?: {
        droppableId: string;
        index: number;
    };
    source: {
        droppableId: string;
        index: number;
    };
    draggableId: string;
}
