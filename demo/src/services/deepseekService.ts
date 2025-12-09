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
/**
 * 构建AI提示词
 */
export function buildPrompt(astrolabeData: any, focusArea?: string): string {
    const { astrolabe, horoscope } = astrolabeData;

    let prompt = `你是一位经验丰富、通情达理的紫微斗数命理大师。请根据以下排盘数据，为命主提供一份既专业又通俗易懂的解读。\n\n`;
    prompt += `请注意：\n`;
    prompt += `1. **通俗易懂**：避免过多使用晦涩难懂的专业术语，如果必须使用，请配合大白话解释（例如："天机化禄"意味着什么，对日常生活具体有什么影响）。\n`;
    prompt += `2. **逻辑清晰**：不要罗列星曜含义，而是要综合全盘（三方四正）进行逻辑推演。\n`;
    prompt += `3. **全面细致**：不仅要看本宫，还要结合对宫、三合宫以及大限流年的走势。\n\n`;

    // 基本信息
    prompt += `## 📋 命主基本信息\n`;
    prompt += `- 性别: ${['male', '男'].includes(astrolabe?.gender) ? '男' : '女'}\n`;
    prompt += `- 阳历: ${astrolabe?.solarDate}\n`;
    prompt += `- 农历: ${astrolabe?.lunarDate}\n`;
    prompt += `- 八字: ${astrolabe?.chineseDate}\n`;
    prompt += `- 局数: ${astrolabe?.fiveElementsClass}\n`;
    prompt += `- 命主: ${astrolabe?.soul} | 身主: ${astrolabe?.body}\n`;
    prompt += `- 命宫位置: ${astrolabe?.earthlyBranchOfSoulPalace}宫 | 身宫位置: ${astrolabe?.earthlyBranchOfBodyPalace}宫\n\n`;

    // 十二宫信息
    if (astrolabe?.palaces) {
        prompt += `## 🏰 十二宫详细配置\n`;
        astrolabe.palaces.forEach((palace: any) => {
            prompt += `\n### 【${palace.name}宫】 (地支:${palace.earthlyBranch} | 天干:${palace.heavenlyStem})\n`;

            // 主星
            const majorStars = palace.majorStars || [];
            if (majorStars.length > 0) {
                prompt += `🔴 主星: ${majorStars.map((s: any) =>
                    `${s.name}${s.mutagen ? `(${s.mutagen})` : ''}${s.brightness ? `[${s.brightness}]` : ''}`
                ).join(', ')}\n`;
            } else {
                prompt += `🔴 主星: (空宫)\n`;
            }

            // 辅星
            if (palace.minorStars?.length > 0) {
                prompt += `🔵 辅星: ${palace.minorStars.map((s: any) => s.name).join(', ')}\n`;
            }

            // 杂曜
            if (palace.adjectiveStars?.length > 0) {
                prompt += `⚪ 杂曜: ${palace.adjectiveStars.map((s: any) => s.name).join(', ')}\n`;
            }

            // 神煞/流曜 (如果数据中有)
            const otherStars = [];
            if (palace.changsheng12) otherStars.push(`长生12:${palace.changsheng12}`);
            if (palace.boshi12) otherStars.push(`博士12:${palace.boshi12}`);
            if (palace.jiangqian12) otherStars.push(`将前12:${palace.jiangqian12}`);
            if (palace.suiqian12) otherStars.push(`岁前12:${palace.suiqian12}`);

            if (otherStars.length > 0) {
                prompt += `✨ 其他神煞: ${otherStars.join(' | ')}\n`;
            }
        });
    }

    // 运限信息
    prompt += `\n## ⏳ 运限走势\n`;
    if (horoscope?.decadal) {
        prompt += `### 当前大限 (10年运)\n`;
        prompt += `- 大限位置: ${horoscope.decadal.name}宫\n`;
        prompt += `- 大限时间: ${horoscope.decadal.range?.join(' - ') || ''} (虚岁)\n`;
        prompt += `- 大限四化: ${horoscope.decadal.mutagens?.join(', ') || '无'}\n`; // 假设有大限四化数据，如果没有可能为空
    }

    if (horoscope?.yearly) {
        prompt += `\n### 当前流年 (1年运)\n`;
        prompt += `- 流年位置: ${horoscope.yearly.name}宫\n`;
        prompt += `- 流年时间: ${horoscope.yearly.year}年\n`;
        prompt += `- 命主虚岁: ${horoscope.age?.nominalAge}岁\n`;
    }

    if (focusArea) {
        prompt += `\n## 🎯 重点关注\n命主特别想了解: "${focusArea}"\n请重点针对此领域进行深入分析。\n`;
    }

    prompt += `\n## 📝 解读框架\n`;
    prompt += `请按照以下结构进行回复（语言要温暖、有力量，多给建设性意见）：\n`;
    prompt += `1. **核心格局**：一句话概括命盘最大的特点（如"杀破狼变格"、"机月同梁"等），并解释这意味着什么。\n`;
    prompt += `2. **性格画像**：优点和盲点各是什么？（用心理学视角的词汇，如"执行力强但容易冲动"）。\n`;
    prompt += `3. **${focusArea ? '重点解答' : '重点分析'}**：针对命主最关心的问题（或事业财运）进行详细剖析。\n`;
    prompt += `4. **运势指引**：结合大限流年，指出当下的机遇和风险。\n`;
    prompt += `5. **大师锦囊**：给出一两个切实可行的行动建议（如"适合从事...行业"、"今年注意..."）。\n`;

    return prompt;
}

/**
 * 调用DeepSeek API进行解读
 */
export async function interpretAstrolabe(
    request: InterpretationRequest,
    onProgress?: (text: string) => void
): Promise<InterpretationResponse> {
    const config = getAIConfig();

    if (!config) {
        throw new Error('未配置AI密钥,请先在设置中配置');
    }

    const { apiKey, model, baseUrl } = config;
    const prompt = buildPrompt(request.astrolabeData, request.focusArea);
    const useStream = !!onProgress;

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
                stream: useStream,
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

        if (!useStream) {
            const data = await response.json();
            if (!data.choices || data.choices.length === 0) {
                throw new Error('API返回数据格式错误');
            }
            const choice = data.choices[0];
            return {
                content: choice.message?.content || '',
                reasoning: choice.message?.reasoning_content,
                usage: data.usage ? {
                    promptTokens: data.usage.prompt_tokens,
                    completionTokens: data.usage.completion_tokens,
                    totalTokens: data.usage.total_tokens,
                } : undefined,
            };
        }

        // 处理流式响应
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('无法读取响应流');
        }

        const decoder = new TextDecoder();
        let fullContent = '';
        let fullReasoning = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') continue;

                    try {
                        const data = JSON.parse(dataStr);
                        const choice = data.choices?.[0];
                        if (choice?.delta) {
                            // deepseek-reasoner 可能会返回 reasoning_content
                            if (choice.delta.reasoning_content) {
                                fullReasoning += choice.delta.reasoning_content;
                                // 如果需要实时显示推理过程，可以修改 onProgress 接口或通过特定格式传递
                            }

                            if (choice.delta.content) {
                                const newContent = choice.delta.content;
                                fullContent += newContent;
                                onProgress(fullContent);
                            }
                        }
                    } catch (e) {
                        console.warn('解析流式数据失败:', e);
                    }
                }
            }
        }

        return {
            content: fullContent,
            reasoning: fullReasoning,
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
