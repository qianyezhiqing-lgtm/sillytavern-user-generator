export default async function handler(request, response) {
  // 设置CORS允许跨域
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { charInfo, options } = request.body;

    // 这里直接调用OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-16k',
        messages: [{
          role: 'user',
          content: `根据以下{{char}}角色信息生成匹配的{{user}}人设：\n${charInfo}\n\n选项：${JSON.stringify(options)}`
        }],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API调用失败');
    }

    const data = await openaiResponse.json();
    const userProfile = data.choices[0].message.content;

    response.status(200).json({ userProfile });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ error: '生成失败，请稍后重试' });
  }
}
