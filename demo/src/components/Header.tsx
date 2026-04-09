import { Moon, Sun, Globe, Download, Github } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [isDark, setIsDark] = useState(false);

    return (
        <header className="flex flex-col border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-6 py-3 text-gray-700 dark:text-gray-200">
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
            </div>

            <div className="flex flex-wrap justify-center gap-3 px-6 pb-4">
                <a
                    href="https://react-iztro-nine.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Globe size={16} />
                    官网
                </a>
                <a
                    href="https://ghproxy.net/https://github.com/jingrongx/react-iztro/releases/download/v1.0.0/app-debug.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Download size={16} />
                    国内下载 APK
                </a>
                <a
                    href="https://github.com/jingrongx/react-iztro/releases/download/v1.0.0/app-debug.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Github size={16} />
                    GitHub下载
                </a>
            </div>
        </header>
    );
}
