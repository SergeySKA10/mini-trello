'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { X } from 'lucide-react';
// import { cn } from '@/lib/utils/cn';

interface AddCardFormProps {
    columnId: string;
    onAddCard: (columnId: string, title: string, content?: string) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export function AddCardForm({
    columnId,
    onAddCard,
    onCancel,
    isOpen,
}: AddCardFormProps) {
    const [title, setTitle] = useState<string>('');
    const [content, setContnent] = useState<string>('');

    const handleCancel = () => {
        setTitle('');
        setContnent('');
        onCancel();
    };

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddCard(columnId, title, content);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Введите заголовок карточки..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="resize-none"
                rows={2}
            />
            <div className="flex gap-2">
                <Button type="submit" size="sm">
                    Добавить карточку
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </form>
    );
}
