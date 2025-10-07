'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { X } from 'lucide-react';
import type { ICard } from '@/types/board';

interface CardFormProps {
    card?: ICard; // Если есть - режим редактирования, если нет - создание
    columnId?: string; // Только для создания
    onSubmit: (data: { title: string; content?: string }) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function CardForm({
    card,
    columnId,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: CardFormProps) {
    const [title, setTitle] = useState<string>(card?.title || '');
    const [content, setContent] = useState<string>(card?.content || '');

    useEffect(() => {
        if (card) {
            setTitle(card.title);
            setContent(card.content || '');
        }
    }, [card]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim()) {
            await onSubmit({
                title: title.trim(),
                content: content.trim() || undefined,
            });

            if (!card) {
                // В режиме создания очищаем форму
                setTitle('');
                setContent('');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
        }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Введите заголовок карточки..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none"
                rows={2}
                autoFocus
            />

            <Textarea
                placeholder="Описание (необязательно)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none"
                rows={2}
            />

            <div className="flex gap-2">
                <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !title.trim()}
                >
                    {isSubmitting
                        ? 'Сохранение...'
                        : card
                        ? 'Сохранить'
                        : 'Добавить карточку'}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    disabled={isSubmitting}
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
