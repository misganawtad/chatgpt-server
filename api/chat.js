const OpenAI = require('openai');

// Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Fixed system prompt
const SYSTEM_PROMPT = "You reply '0' if false and '1' if true";

// Export the serverless function
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Note: Changed from GPT-4o-mini as that's not a valid model
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message }
            ],
        });

        res.json({
            success: true,
            response: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get response from ChatGPT'
        });
    }
};
