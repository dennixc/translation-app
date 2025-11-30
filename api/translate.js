const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: process.env.POE_API_KEY,  // 在 Vercel 設定環境變數
    baseURL: "https://api.poe.com/v1",
});

module.exports = async (req, res) => {
    // 處理 CORS preflight
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // 設定 CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const chat = await client.chat.completions.create({
            model: "digitalguy",  // 你的 POE bot 名稱
            messages: [{ role: "user", content: message }]
        });

        const reply = chat.choices[0].message.content;

        return res.status(200).json({ 
            success: true, 
            translation: reply 
        });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ 
            error: "Translation failed", 
            details: error.message 
        });
    }
};