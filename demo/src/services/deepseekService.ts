/**
 * DeepSeek API调用服务
 * 负责调用DeepSeek Chat Completion API进行排盘解读
 */

import { getAIConfig } from './aiConfig';

export interface InterpretationRequest {
    astrolabeData: any; // 排盘数据
    focusArea?: string; // 重点关注的领域(可选)
}

export interface InterpretationResponse {
    content: string; // AI解读内容
    reasoning?: string; // 思考过程(deepseek-reasoner模型返回)
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

/**
 * 构建AI提示词
 */
function buildPrompt(astrolabeData: any, focusArea?: string): string {
    const { astrolabe, horoscope } = astrolabeData;

    let prompt = `你是一位专业的紫微斗数命理师,请根据以下排盘信息进行详细解读:\n\n`;

    // 基本信息
    prompt += `## 基本信息\n`;
    prompt += `- 性别: ${astrolabe?.gender === 'male' ? '男' : '女'}\n`;
    prompt += `- 阳历生日: ${astrolabe?.solarDate}\n`;
    prompt += `- 农历生日: ${astrolabe?.lunarDate}\n`;
    prompt += `- 四柱: ${astrolabe?.chineseDate}\n`;
    prompt += `- 时辰: ${astrolabe?.time} (${astrolabe?.timeRange})\n`;
    prompt += `- 生肖: ${astrolabe?.zodiac}\n`;
    prompt += `- 星座: ${astrolabe?.sign}\n`;
    prompt += `- 五行局: ${astrolabe?.fiveElementsClass}\n`;
    prompt += `- 命主: ${astrolabe?.soul}\n`;
    prompt += `- 身主: ${astrolabe?.body}\n`;
    prompt += `- 命宫: ${astrolabe?.earthlyBranchOfSoulPalace}\n`;
    prompt += `- 身宫: ${astrolabe?.earthlyBranchOfBodyPalace}\n\n`;

    // 十二宫信息
    if (astrolabe?.palaces) {
        prompt += `## 十二宫信息\n`;
        astrolabe.palaces.forEach((palace: any) => {
            prompt += `\n### ${palace.name}宫 (${palace.earthlyBranch})\n`;
            prompt += `- 天干: ${palace.heavenlyStem}\n`;

            if (palace.majorStars?.length > 0) {
                prompt += `- 主星: ${palace.majorStars.map((s: any) =>
                    `${s.name}${s.mutagen ? `(${s.mutagen})` : ''}${s.brightness ? `[${s.brightness}]` : ''}`
                ).join(', ')}\n`;
            }

            if (palace.minorStars?.length > 0) {
                prompt += `- 辅星: ${palace.minorStars.map((s: any) => s.name).join(', ')}\n`;
            }

            if (palace.adjectiveStars?.length > 0) {
                prompt += `- 杂曜: ${palace.adjectiveStars.map((s: any) => s.name).join(', ')}\n`;
            }
        });
    }

    // 大限信息
    if (horoscope?.decadal) {
        prompt += `\n## 当前大限\n`;
        prompt += `- 大限宫位: ${horoscope.decadal.name}\n`;
        prompt += `- 大限年龄: ${horoscope.decadal.range?.join('-') || ''}岁\n`;
    }

    // 流年信息
    if (horoscope?.yearly) {
        prompt += `\n## 当前流年\n`;
        prompt += `- 流年: ${horoscope.yearly.name}\n`;
        prompt += `- 虚岁: ${horoscope.age?.nominalAge}岁\n`;
    }

    if (focusArea) {
        prompt += `\n## 解读重点\n请特别关注: ${focusArea}\n`;
    }

    prompt += `\n## 解读要求\n`;
    prompt += `请从以下几个方面进行详细解读:\n`;
    prompt += `1. 命盘整体特点和格局\n`;
    prompt += `2. 性格特质和天赋才能\n`;
    prompt += `3. 事业发展方向和建议\n`;
    prompt += `4. 财运状况分析\n`;
    prompt += `5. 感情婚姻运势\n`;
    prompt += `6. 健康注意事项\n`;
    prompt += `7. 当前大限和流年运势\n`;
    prompt += `8. 人生建议和趋吉避凶方法\n\n`;
    prompt += `请用通俗易懂的语言进行解读,既要专业准确,又要让普通人能够理解。`;

    return prompt;
}

/**
 * 调用DeepSeek API进行解读
 */
export async function interpretAstrolabe(
    request: InterpretationRequest,
    _onProgress?: (text: string) => void
): Promise<InterpretationResponse> {
    const config = getAIConfig();

    if (!config) {
        throw new Error('未配置AI密钥,请先在设置中配置');
    }

    const { apiKey, model, baseUrl } = config;
    const prompt = buildPrompt(request.astrolabeData, request.focusArea);

    try {
        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                stream: false, // 暂不支持流式响应
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message ||
                `API请求失败: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error('API返回数据格式错误');
        }

        const choice = data.choices[0];
        const content = choice.message?.content || '';

        // deepseek-reasoner模型会返回reasoning_content
        const reasoning = choice.message?.reasoning_content;

        return {
            content,
            reasoning,
            usage: data.usage ? {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
            } : undefined,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('AI解读失败,请检查网络连接和API配置');
    }
}

/**
 * 测试API连接
 */
export async function testConnection(): Promise<boolean> {
    const config = getAIConfig();

    if (!config) {
        throw new Error('未配置AI密钥');
    }

    const { apiKey, baseUrl } = config;

    try {
        const response = await fetch(`${baseUrl}/v1/models`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        return response.ok;
    } catch (error) {
        return false;
    }
}
