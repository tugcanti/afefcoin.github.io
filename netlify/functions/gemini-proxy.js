// This file runs on Netlify's servers, not in the user's browser.
// Your API key is secure here.

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: 'A prompt is required.' }) };
        }

        // Get the API key from secure environment variables.
        // This key is never exposed in public-facing code.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };
        }

        // Use the Gemini 1.5 Flash model (Standard/Stable model)
        // Or stick to your preview model if you prefer: gemini-2.5-flash-preview-09-2025
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // System prompt that defines the AI assistant's personality and knowledge base.
        // Updated to reflect AFEF Token specifics you provided earlier.
        const systemPrompt = `
            You are 'AFEF Token Support', a friendly and helpful AI assistant created for the AFEF Token project.
            
            PROJECT DETAILS:
            - Name: AFEF Token (The Professional Platform)
            - Vision: A decentralized, secure, and community-driven DeFi ecosystem.
            - Tokenomics: 40% Liquidity Pool, 30% Airdrop & Community, 20% Team & Advisors, 10% Marketing.
            - Roadmap Phase 1: Project Launch & Airdrop.
            - Roadmap Phase 2: CEX Listings & Partnerships.
            - Roadmap Phase 3: Utility Development (Staking).
            - Contract Address: 0x367a584a928b641330E8B20e7C4739675741f40d
            
            Answer user questions about the project clearly, concisely, and in an understandable way.
            If you don't know the answer to a question, respond with something like, "I'll need to consult with the team on that."
            Always be positive, encouraging, and professional.
        `;

        const payload = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            return { statusCode: response.status, body: JSON.stringify({ error: 'Failed to get a response from the Gemini API.' }) };
        }

        const data = await response.json();
        
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I can't answer that question right now. Please try asking in a different way.";

        return {
            statusCode: 200,
            body: JSON.stringify({ response: aiResponse }),
        };

    } catch (error) {
        console.error('Proxy function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An internal server error occurred.' }),
        };
    }
};