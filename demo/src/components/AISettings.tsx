import { X, Key, TestTube, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAIConfig, saveAIConfig, validateApiKey, clearAIConfig, type AIConfig } from '../services/aiConfig';
import { testConnection } from '../services/deepseekService';

interface AISettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AISettings({ isOpen, onClose }: AISettingsProps) {
    const [config, setConfig] = useState<AIConfig>({
        apiKey: '',
        model: 'deepseek-reasoner',
        baseUrl: 'https://api.deepseek.com',
    });

    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);

    // 加载已保存的配置
    useEffect(() => {
        if (isOpen) {
            const savedConfig = getAIConfig();
            if (savedConfig) {
                setConfig(savedConfig);
            }
            setTestResult(null);
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!validateApiKey(config.apiKey)) {
            setErrorMessage('API密钥格式不正确,应以sk-开头');
            return;
        }

        if (saveAIConfig(config)) {
            setTestResult('success');
            setErrorMessage('');
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setErrorMessage('保存配置失败');
        }
    };

    const handleTest = async () => {
        if (!validateApiKey(config.apiKey)) {
            setErrorMessage('请先输入有效的API密钥');
            return;
        }

        setIsTesting(true);
        setTestResult(null);
        setErrorMessage('');

        // 临时保存配置以便测试
        saveAIConfig(config);

        try {
            const result = await testConnection();
            if (result) {
                setTestResult('success');
                setErrorMessage('');
            } else {
                setTestResult('error');
                setErrorMessage('连接失败,请检查API密钥和网络');
            }
        } catch (error) {
            setTestResult('error');
            setErrorMessage(error instanceof Error ? error.message : '测试失败');
        } finally {
            setIsTesting(false);
        }
    };

    const handleClear = () => {
        if (confirm('确定要清除所有配置吗?')) {
            clearAIConfig();
            setConfig({
                apiKey: '',
                model: 'deepseek-reasoner',
                baseUrl: 'https://api.deepseek.com',
            });
            setTestResult(null);
            setErrorMessage('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI解读设置</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 内容 */}
                <div className="p-6 space-y-4">
                    {/* API密钥 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            DeepSeek API密钥
                        </label>
                        <div className="relative">
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={config.apiKey}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                placeholder="sk-xxxxxxxxxxxxxxxx"
                                className="w-full pl-10 pr-20 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Key className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <button
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-2 top-2 text-xs text-purple-600 hover:text-purple-700 px-2 py-1"
                            >
                                {showApiKey ? '隐藏' : '显示'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            在{' '}
                            <a
                                href="https://platform.deepseek.com/api_keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline"
                            >
                                DeepSeek平台
                            </a>
                            {' '}获取API密钥
                        </p>
                    </div>

                    {/* 模型选择 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            模型
                        </label>
                        <div className="relative">
                            <input
                                list="model-options"
                                type="text"
                                value={config.model}
                                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                                placeholder="输入或选择模型名称"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <datalist id="model-options">
                                <option value="deepseek-reasoner">DeepSeek V3.2 思考模式 (推荐)</option>
                                <option value="deepseek-chat">DeepSeek V3.2 非思考模式</option>
                            </datalist>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            支持自定义模型名称。如使用其他服务商，请修改API地址。
                        </p>
                    </div>

                    {/* Base URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            API地址
                        </label>
                        <input
                            type="text"
                            value={config.baseUrl}
                            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                            placeholder="https://api.deepseek.com"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* 错误提示 */}
                    {errorMessage && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                        </div>
                    )}

                    {/* 成功提示 */}
                    {testResult === 'success' && !errorMessage && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <Check className="text-green-600 dark:text-green-400" size={16} />
                            <p className="text-sm text-green-600 dark:text-green-400">配置验证成功!</p>
                        </div>
                    )}

                    {/* 安全提示 */}
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            ⚠️ API密钥将存储在浏览器本地,请注意安全。调用API可能产生费用。
                        </p>
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleTest}
                        disabled={isTesting || !config.apiKey}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TestTube size={16} />
                        {isTesting ? '测试中...' : '测试连接'}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        清除
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!config.apiKey}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
}
