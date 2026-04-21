import { Moon, Sun, Globe, Download, Github } from 'lucide-react';
import { useState } from 'react';
import { openUrl } from '../lib/openUrl';
import { isWindows } from '../lib/platformUtils';
import { getGhproxyApkDownloadUrl, getApkDownloadUrl, getGhproxyExeDownloadUrl, getExeDownloadUrl } from '../lib/downloadUtils';

export default function Header() {
    const [isDark, setIsDark] = useState(false);

    const handleOpenUrl = (url: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        openUrl(url);
    };

    const apkUrl = isWindows() ? getGhproxyExeDownloadUrl() : getGhproxyApkDownloadUrl();
    const apkLabel = isWindows() ? '国内下载 EXE' : '国内下载 APK';
    const githubUrl = isWindows() ? getExeDownloadUrl() : getApkDownloadUrl();
    const githubLabel = isWindows() ? 'GitHub下载 EXE' : 'GitHub下载';

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
                    onClick={handleOpenUrl('https://react-iztro-nine.vercel.app/')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Globe size={16} />
                    官网
                </a>
                <a
                    href={apkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenUrl(apkUrl)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Download size={16} />
                    {apkLabel}
                </a>
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenUrl(githubUrl)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <Github size={16} />
                    {githubLabel}
                </a>
            </div>
        </header>
    );
}
