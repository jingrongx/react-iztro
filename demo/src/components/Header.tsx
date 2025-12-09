import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [isDark, setIsDark] = useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-8">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">紫微派</div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">主页</a>
                    <a href="#" className="text-purple-600 dark:text-purple-400">排盘</a>
                    <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">教程</a>
                    <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">查盘</a>
                    <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">统计</a>
                    <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">关于我</a>
                </nav>
            </div>

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
