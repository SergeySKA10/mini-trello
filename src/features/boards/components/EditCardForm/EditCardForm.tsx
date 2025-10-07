'use client';

import { useState, useEffect } from 'react';
import type { ICard } from '../../../../types/board';
import { Button } from '@/components/ui/Button/Button';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { useAppDispatch } from '@/stores/hooks/hooks';
import { updateCard } from '@/stores/slices/board-slice';
import { X } from 'lucide-react';

interface EditCardFormProps {
    card: ICard;
    onClose: () => void;
}

export function EditCardForm({ card, onClose }: EditCardFormProps) {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<string>(card.title);
    const [content, setContent] = useState<string>(card.content || '');

    useEffect(() => {
        setTitle(card.title);
        setContent(card.content || '');
    }, [card]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim()) {
            dispatch(
                updateCard({
                    cardId: card.id,
                    updates: {
                        title: title.trim(),
                        content: content.trim() || undefined,
                    },
                })
            );
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Заголовок карточки..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="resize-none font-medium"
                rows={2}
            />

            <Textarea
                placeholder="Описание..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none text-sm"
                rows={3}
            />

            <div className="flex gap-2">
                <Button type="submit" size="sm">
                    Сохранить
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="text-xs text-gray-500">
                Ctrl+Enter для сохранения, Esc для отмены
            </div>
        </form>
    );
}
