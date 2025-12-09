/**
 * AI配置管理服务
 * 负责存储和读取DeepSeek API配置
 */

const STORAGE_KEYS = {
    API_KEY: 'deepseek_api_key',
    MODEL: 'deepseek_model',
    BASE_URL: 'deepseek_base_url',
};

export interface AIConfig {
    apiKey: string;
    model: string;
    baseUrl: string;
}

/**
 * 获取AI配置
 */
export function getAIConfig(): AIConfig | null {
    try {
        const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
        const model = localStorage.getItem(STORAGE_KEYS.MODEL) || 'deepseek-reasoner';
        const baseUrl = localStorage.getItem(STORAGE_KEYS.BASE_URL) || 'https://api.deepseek.com';

        if (!apiKey) {
            return null;
        }

        return {
            apiKey,
            model,
            baseUrl,
        };
    } catch (error) {
        console.error('读取AI配置失败:', error);
        return null;
    }
}

/**
 * 保存AI配置
 */
export function saveAIConfig(config: AIConfig): boolean {
    try {
        localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey);
        localStorage.setItem(STORAGE_KEYS.MODEL, config.model);
        localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
        return true;
    } catch (error) {
        console.error('保存AI配置失败:', error);
        return false;
    }
}

/**
 * 清除AI配置
 */
export function clearAIConfig(): void {
    try {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.MODEL);
        localStorage.removeItem(STORAGE_KEYS.BASE_URL);
    } catch (error) {
        console.error('清除AI配置失败:', error);
    }
}

/**
 * 验证API密钥格式
 */
export function validateApiKey(apiKey: string): boolean {
    // DeepSeek API密钥通常以'sk-'开头
    return apiKey.trim().length > 0 && apiKey.startsWith('sk-');
}

/**
 * 检查是否已配置
 */
export function isConfigured(): boolean {
    return getAIConfig() !== null;
}
