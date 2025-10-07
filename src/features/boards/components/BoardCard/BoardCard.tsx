'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardActions } from '../CardActions/CardActions';
import { useAppDispatch } from '@/stores/hooks/hooks';
import { deleteCard } from '@/stores/slices/board-slice';
import { type ICard } from '../../../../types/board';
import { cn } from '@/lib/utils/cn';

interface BoardCardProps {
    card: ICard;
    onEdit?: (card: ICard) => void;
}

export function BoardCard({ card, onEdit }: BoardCardProps) {
    const dispatch = useAppDispatch();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'card',
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEdit = () => {
        onEdit?.(card);
    };

    const handleDelete = () => {
        if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
            dispatch(deleteCard({ cardId: card.id }));
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing',
                'hover:shadow-md transition-shadow duration-200',
                {
                    'opacity-50 rotate-5 scale-105 z-50': isDragging,
                    'hover:border-gray-300': !isDragging,
                }
            )}
        >
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 break-words">
                        {card.title}
                    </h3>
                    {card.content && (
                        <p className="mt-2 text-sm text-gray-600 break-words">
                            {card.content}
                        </p>
                    )}
                </div>

                <CardActions
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    className="flex-shrink-0"
                />
            </div>
        </div>
    );
}
