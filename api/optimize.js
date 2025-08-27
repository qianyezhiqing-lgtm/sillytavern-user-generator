export default async function handler(request, response) {
  // CORS设置（同上）
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { originalProfile, optimizationInstruction } = request.body;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `优化以下人设：\n${originalProfile}\n\n优化要求：${optimizationInstruction}`
        }],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API调用失败');
    }

    const data = await openaiResponse.json();
    const optimizedProfile = data.choices[0].message.content;

    response.status(200).json({ optimizedProfile });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ error: '优化失败，请稍后重试' });
  }
                      }
