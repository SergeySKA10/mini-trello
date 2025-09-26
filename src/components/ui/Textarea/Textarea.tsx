import { cn } from '@/lib/utils/cn';
import { type TextareaHTMLAttributes, forwardRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

// eslint-disable-next-line react/display-name
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'resize-none',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
export { Textarea };
