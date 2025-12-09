import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [isDark, setIsDark] = useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">紫微斗数 AI解读版</div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        setIsDark(!isDark);
                        if (isDark) {
                            document.documentElement.classList.remove('dark');
                        } else {
                            document.documentElement.classList.add('dark');
                        }
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
}
