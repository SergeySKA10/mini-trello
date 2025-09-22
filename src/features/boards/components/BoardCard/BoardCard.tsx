import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type ICard } from '../../types/board';
import { cn } from '@/lib/utils/cn';

interface BoardCardProps {
    card: ICard;
}

export function BoardCard({ card }: BoardCardProps) {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing',
                'hover:shadow-md transition-shadow',
                {
                    'opacity-50 rotate-5': isDragging,
                }
            )}
        >
            <h3 className="font-medium text-gray-900">{card.title}</h3>
            {card.content && (
                <p className="mt-1 text-sm text-gray-600">{card.content}</p>
            )}
        </div>
    );
}
