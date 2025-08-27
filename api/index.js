import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// {{user}}人设生成端点
app.post('/generate-user-profile', async (req, res) => {
    try {
        const { charInfo, options } = req.body;
        
        // 构建提示词
        let prompt = `根据以下{{char}}角色信息，生成一个与之完美匹配的{{user}}人设。\n\n`;
        prompt += `{{char}}信息:\n${charInfo}\n\n`;
        prompt += `生成要求:\n`;
        prompt += `- ${options.nsfw ? '包含NSFW内容' : '不包含NSFW内容'}\n`;
        prompt += `- ${options.perfect ? '生成完美人设' : '生成普通人设'}\n`;
        prompt += `- ${options.detailed ? '详细生成，包含背景故事、性格特点等' : '简洁生成'}\n\n`;
        
        prompt += `请使用以下完整格式回复，确保包含所有部分:\n\n`;
        
        prompt += `姓名:\n  - "[姓名]"\n  - "[昵称]"\n年龄: "[年龄]"\n性别: "[性别]"\n身高: "[身高]"\n生辰: "[生日日期]，[星座]"\n身份: "[身份职位]"\n\n`;
        
        prompt += `教育经历:\n  学历: "[学历背景]"\n  关键课程:\n    - "[课程1]"\n    - "[课程2]"\n  学校与导师: "[学校] / [导师]"\n\n`;
        
        prompt += `社会经济背景:\n  出身阶层: "[阶层背景]"\n  当前经济状况: "[经济状况]"\n  财务观念: "[财务观念]"\n\n`;
        
        prompt += `语言与沟通:\n  能力:\n    - "[语言1] (水平)"\n    - "[语言2] (水平)"\n  口头风格: "[口头风格描述]"\n  非语言: "[非语言习惯]"\n\n`;
        
        prompt += `文化与信仰:\n  文化根源: "[文化背景]"\n  宗教/信仰: "[宗教信仰]"\n  价值排序:\n    - "[价值1]"\n    - "[价值2]"\n\n`;
        
        prompt += `社交网络:\n  组织/派系:\n    - "[组织1]"\n    - "[组织2]"\n  在线足迹:\n    - "[在线行为]"\n\n`;
        
        prompt += `日常节奏:\n  典型一天:\n    - "[时间] → [活动]"\n    - "[时间] - [时间] → [活动]"\n  闲暇模式:\n    - "[休闲活动1]"\n    - "[休闲活动2]"\n\n`;
        
        prompt += `服装风格:\n  日常: "[日常着装]"\n  正式: "[正式着装]"\n  关键饰品:\n    - "[饰品1]"\n    - "[饰品2]"\n\n`;
        
        prompt += `幽默感:\n  类型: "[幽默类型]"\n  典型笑料:\n    - "[笑话示例]"\n\n`;
        
        prompt += `冲突与决策:\n  决策风格: "[决策风格]"\n  冲突处理:\n    - "[冲突处理方式]"\n\n`;
        
        prompt += `形貌:\n  头发: "[头发描述]"\n  皮肤: "[皮肤描述]"\n  眼睛: "[眼睛描述]"\n  面容: "[面容描述]"\n  身体: "[身体描述]"\n  疤痕: "[疤痕描述]"\n  气味: "[气味描述]"\n  姿态: "[姿态描述]"\n  纹身: "[纹身描述]"\n\n`;
        
        prompt += `性格:\n  核心特质: "[核心特质]"\n  详细方面:\n    - "[方面1]"\n    - "[方面2]"\n  隐藏特质:\n    - "[隐藏特质]"\n  内在冲突:\n    - "[冲突1]"\n    - "[冲突2]"\n\n`;
        
        prompt += `喜恶:\n  喜欢:\n    - "[喜欢1]"\n    - "[喜欢2]"\n  厌恶:\n    - "[厌恶1]"\n    - "[厌恶2]"\n  食物:\n    - "[喜欢食物]"\n    - "[厌恶食物]"\n  爱好:\n    - "[爱好1]"\n    - "[爱好2]"\n  环境:\n    - "[喜欢环境]"\n    - "[厌恶环境]"\n\n`;
        
        prompt += `强项:\n  技能:\n    - "[技能1]"\n    - "[技能2]"\n  特殊能力:\n    - "[特殊能力1]"\n    - "[特殊能力2]"\n\n`;
        
        prompt += `弱点:\n  缺点:\n    - "[缺点1]"\n    - "[缺点2]"\n  脆弱点:\n    - "[脆弱点1]"\n    - "[脆弱点2]"\n\n`;
        
        prompt += `生活习惯:\n  住所: "[住所描述]"\n  日常: "[日常习惯]"\n  怪癖: "[特殊习惯或怪癖]"\n\n`;
        
        prompt += `价值观:\n  信念: "[信念]"\n  禁忌: "[禁忌]"\n  目标: "[目标]"\n  动机:\n    - "[动机1]"\n    - "[动机2]"\n\n`;
        
        prompt += `爱情观: "[爱情观描述]"\n\n`;
        
        prompt += `过往人生:\n  概述: "[人生概述]"\n  童年: "[童年经历]"\n  形成性事件:\n    - "[事件1]"\n    - "[事件2]"\n  重要时期:\n    - "[时期1]"\n    - "[时期2]"\n\n`;
        
        prompt += `人际关系:\n  总述: "[人际关系总述]"\n  家庭: "[家庭关系]"\n  朋友: "[朋友关系]"\n  职业: "[职业关系]"\n\n`;
        
        prompt += `恐惧:\n  - "[恐惧1]"\n  - "[恐惧2]"\n\n`;
        
        prompt += `秘密:\n  - "[秘密1]"\n  - "[秘密2]"\n\n`;
        
        prompt += `对话风格:\n  一般风格: "[对话风格]"\n  常用语:\n    - "[常用语1]"\n    - "[常用语2]"\n  语言特点: "[语言特点]"\n\n`;
        
        prompt += `与{{char}}的关系: "[关系描述]"\n初遇: "[初次相遇场景]"\n\n`;
        
        if (options.nsfw) {
            prompt += `NSFW_traits:\n  私人习惯:\n    - 频率: "[频率]"\n    - 场所: "[场所]"\n    - 习惯: "[习惯]"\n  性经历:\n    - "[性经历描述]"\n  内心想法:\n    - "[内心想法1]"\n    - "[内心想法2]"\n  癖好/恋物:\n    - "[癖好1]"\n    - "[癖好2]"\n  界限:\n    - "[界限1]"\n    - "[界限2]"\n  心理层面:\n    - "[心理层面1]"\n    - "[心理层面2]"\n\n`;
        }
        
        prompt += `请确保生成的内容与{{char}}角色高度契合，且符合上述所有格式要求。`;

        // 调用OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 10000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 提取生成的文本
        const userProfile = response.data.choices[0].message.content;
        
        res.json({ userProfile });
        
    } catch (error) {
        console.error('Error generating user profile:', error);
        
        // 返回错误信息
        if (error.response?.status === 401) {
            res.status(500).json({ error: 'API密钥错误，请检查OpenAI API密钥' });
        } else if (error.response?.status === 429) {
            res.status(500).json({ error: '请求过于频繁，请稍后再试' });
        } else {
            res.status(500).json({ error: '生成失败，请稍后重试' });
        }
    }
});

// 优化人设端点
app.post('/optimize-user-profile', async (req, res) => {
    try {
        const { originalProfile, optimizationInstruction } = req.body;
        
        // 构建优化提示词
        let prompt = `请根据以下优化指令对已有的{{user}}人设进行优化：\n\n`;
        prompt += `原始人设:\n${originalProfile}\n\n`;
        prompt += `优化指令:\n${optimizationInstruction}\n\n`;
        prompt += `请根据优化指令对原始人设进行修改和优化，保持原有的格式和结构，只修改需要优化的部分。`;
        prompt += `确保优化后的人设仍然保持完整性和一致性。`;

        // 调用OpenAI API进行优化
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 10000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 提取优化后的文本
        const optimizedProfile = response.data.choices[0].message.content;
        
        res.json({ optimizedProfile });
        
    } catch (error) {
        console.error('Error optimizing user profile:', error);
        
        // 返回错误信息
        if (error.response?.status === 401) {
            res.status(500).json({ error: 'API密钥错误，请检查OpenAI API密钥' });
        } else if (error.response?.status === 429) {
            res.status(500).json({ error: '请求过于频繁，请稍后再试' });
        } else {
            res.status(500).json({ error: '优化失败，请稍后重试' });
        }
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'SillyTavern {{user}}人设生成器API运行正常',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
});
