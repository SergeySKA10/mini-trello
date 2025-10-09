'use client';
import { BoardView } from '@/features/boards/components/BoardView/BoardView';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="p-6">
            {/* Навигация для тестирования */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">
                    Тестовые страницы:
                </h2>
                <div className="flex gap-4">
                    <Link
                        href="/test-board"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Тест новых компонентов
                    </Link>
                    <Link
                        href="/boards/1"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Реальная доска (ID: 1)
                    </Link>
                </div>
            </div>

            {/* Старые Redux компоненты */}
            <BoardView />
        </main>
    );
}
