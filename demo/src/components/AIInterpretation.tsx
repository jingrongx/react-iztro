import { Sparkles, X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIInterpretationProps {
    content: string;
    reasoning?: string;
    isLoading?: boolean;
    error?: string;
    promptData?: string;
    onClose: () => void;
}

export default function AIInterpretation({
    content,
    reasoning,
    isLoading,
    error,
    promptData,
    onClose,
}: AIInterpretationProps) {
    const [copied, setCopied] = useState(false);
    const [promptCopied, setPromptCopied] = useState(false);
    const [showReasoning, setShowReasoning] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const handleCopyPrompt = async () => {
        if (!promptData) return;
        try {
            await navigator.clipboard.writeText(promptData);
            setPromptCopied(true);
            setTimeout(() => setPromptCopied(false), 2000);
        } catch (err) {
            console.error('复制Prompt失败:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI 命盘解读</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isLoading && !error && content && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        <span>已复制</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        <span>复制</span>
                                    </>
                                )}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Prompt Data Section - Always show if available */}
                    {promptData && (
                        <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50">
                                <button
                                    onClick={() => setShowPrompt(!showPrompt)}
                                    className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                                >
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        📝 发送给AI的数据
                                    </span>
                                    {showPrompt ? (
                                        <ChevronUp size={16} className="text-gray-500" />
                                    ) : (
                                        <ChevronDown size={16} className="text-gray-500" />
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyPrompt();
                                    }}
                                    className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                    {promptCopied ? (
                                        <>
                                            <Check size={14} />
                                            <span>已复制</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>复制内容</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            {showPrompt && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                                        {promptData}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 dark:border-purple-400 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">AI正在分析命盘...</p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">这可能需要几秒钟时间</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && content && (
                        <div className="space-y-4">
                            {/* 思考过程(如果有) */}
                            {reasoning && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setShowReasoning(!showReasoning)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            💭 AI思考过程
                                        </span>
                                        {showReasoning ? (
                                            <ChevronUp size={16} className="text-gray-500" />
                                        ) : (
                                            <ChevronDown size={16} className="text-gray-500" />
                                        )}
                                    </button>
                                    {showReasoning && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                                                {reasoning}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            {/* 解读内容 */}
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // 自定义链接样式
                                        a: ({ node, ...props }: any) => <a {...props} className="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                                        // 自定义表格样式
                                        table: ({ node, ...props }: any) => <div className="overflow-x-auto my-4"><table {...props} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" /></div>,
                                        thead: ({ node, ...props }: any) => <thead {...props} className="bg-gray-50 dark:bg-gray-800" />,
                                        th: ({ node, ...props }: any) => <th {...props} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" />,
                                        td: ({ node, ...props }: any) => <td {...props} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800" />,
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>

                            {/* 免责声明 */}
                            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                    ⚠️ 此解读由AI生成,仅供参考娱乐,不构成任何专业建议。命理学说存在争议,请理性看待。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
