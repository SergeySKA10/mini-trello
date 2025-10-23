'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { CardForm } from './CardForm';
// import { useUpdateCard } from '@/hooks/useCards';
// import { useDeleteCardWithOptimistic } from '@/hooks/useCardWithOptimistic';
import {
    useSmartUpdateCard,
    useSmartDeleteCard,
} from '@/hooks/useSmartCardMutations';
import type { ICard } from '@/types/board';
import { cn } from '@/lib/utils/cn';

interface CardItemProps {
    card: ICard;
    columnId: string;
}

export function CardItem({ card, columnId }: CardItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const updateCardMutation = useSmartUpdateCard(columnId);
    const deleteCardMutation = useSmartDeleteCard(columnId);

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
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    const handleDelete = async () => {
        if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
            try {
                await deleteCardMutation.mutateAsync(card.id);
            } catch (error) {
                console.error('Failed to delete card:', error);
            }
        }
        setIsMenuOpen(false);
    };

    const handleSave = async (updates: { title: string; content?: string }) => {
        try {
            await updateCardMutation.mutateAsync({
                id: card.id,
                ...updates,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update card:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <CardForm
                card={card}
                onSubmit={handleSave}
                onCancel={handleCancel}
                isSubmitting={updateCardMutation.isPending}
            />
        );
    }

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

                {/* Menu Actions */}
                <div className="relative flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreVertical className="w-4 h-4" />
                    </Button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                            <button
                                onClick={handleEdit}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Редактировать
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
