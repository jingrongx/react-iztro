import { Moon, Sun, Globe, Download, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { openUrl } from '../lib/openUrl';
import { getLatestApkDownloadUrl, getLatestExeDownloadUrl, getGhproxyApkDownloadUrl, getGhproxyExeDownloadUrl, fetchLatestVersion } from '../lib/downloadUtils';

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const [latestVersion, setLatestVersion] = useState<string | null>(null);

    useEffect(() => {
        const cached = localStorage.getItem('iztro_latest_version');
        if (cached) setLatestVersion(cached);
        fetchLatestVersion().then(v => {
            if (v) {
                setLatestVersion(v);
                localStorage.setItem('iztro_latest_version', v);
            }
        });
    }, []);

    const handleOpenUrl = (url: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        openUrl(url);
    };

    const apkGhproxyUrl = latestVersion ? getGhproxyApkDownloadUrl(latestVersion) : getLatestApkDownloadUrl();
    const exeGhproxyUrl = latestVersion ? getGhproxyExeDownloadUrl(latestVersion) : getLatestExeDownloadUrl();

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

            <div className="px-6 pb-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <a
                        href={apkGhproxyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenUrl(apkGhproxyUrl)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                    >
                        <Download size={18} />
                        Android下载
                    </a>
                    <a
                        href={exeGhproxyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenUrl(exeGhproxyUrl)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                    >
                        <Monitor size={18} />
                        Windows下载
                    </a>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-gray-500 dark:text-gray-400">
                    <a
                        href={getLatestApkDownloadUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenUrl(getLatestApkDownloadUrl())}
                        className="hover:text-gray-700 dark:hover:text-gray-300 underline decoration-dotted"
                    >
                        GitHub APK
                    </a>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <a
                        href={getLatestExeDownloadUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenUrl(getLatestExeDownloadUrl())}
                        className="hover:text-gray-700 dark:hover:text-gray-300 underline decoration-dotted"
                    >
                        GitHub EXE
                    </a>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <a
                        href="https://react-iztro-nine.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenUrl('https://react-iztro-nine.vercel.app/')}
                        className="hover:text-gray-700 dark:hover:text-gray-300 underline decoration-dotted"
                    >
                        <Globe size={12} className="inline -mt-0.5" />
                        网页版
                    </a>
                </div>
            </div>
        </header>
    );
}
