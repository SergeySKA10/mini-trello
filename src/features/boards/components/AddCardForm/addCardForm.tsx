'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
        return (
            <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-500 hover: text-gray-700 w-full"
                onClick={() => {}}
            >
                <Plus className="w-4 h-4 mr-2" />
                Добавить карточку
            </Button>
        );
    }

    const handleSubmit = () => {};

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
