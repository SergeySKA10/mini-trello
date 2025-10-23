'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { cn } from '@/lib/utils/cn';

interface CardActionProps {
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
}

export function CardActions({ onEdit, onDelete, className }: CardActionProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Закрытие меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = () => {
        onEdit();
        setIsOpen(false);
    };

    const handleDelete = () => {
        onDelete();
        setIsOpen(false);
    };

    return (
        <div className={cn('relative', className)} ref={menuRef}>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => setIsOpen(!isOpen)}
            >
                <MoreVertical className="w-4 h-4" />
            </Button>

            {isOpen && (
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
    );
}
