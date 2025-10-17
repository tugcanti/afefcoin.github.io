// Bu dosya, Netlify'ın sunucularında çalışır, kullanıcının tarayıcısında değil.
// API anahtarınız burada güvendedir.

exports.handler = async function (event, context) {
    // Sadece POST isteklerine izin ver
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required.' }) };
        }

        // API anahtarını güvenli ortam değişkenlerinden alıyoruz.
        // Bu anahtar asla herkese açık kodda yer almaz.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
             return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const systemPrompt = `
            Sen 'AFEF Token Destek', AFEF Token projesi için oluşturulmuş dost canlısı ve yardımsever bir yapay zeka asistanısın.
            AFEF Token, oyuncuların oyun içi harcamalarından daha fazla değer elde etmelerine ve kazanç sağlamalarına yardımcı olmak için tasarlanmış bir kripto para projesidir.
            Misyonu, oyuncular için daha ödüllendirici bir oyun deneyimi yaratmaktır.
            Kullanıcıların proje hakkındaki sorularını net, kısa ve anlaşılır bir şekilde yanıtla.
            Eğer bir sorunun cevabını bilmiyorsan, "Bu konuda ekibe danışmam gerekiyor." gibi bir yanıt ver.
            Her zaman pozitif, cesaretlendirici ve profesyonel ol.
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
            return { statusCode: response.status, body: JSON.stringify({ error: 'Failed to get response from Gemini API.' }) };
        }

        const data = await response.json();
        
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Bu soruya şu anda yanıt veremiyorum. Lütfen farklı bir şekilde sormayı deneyin.";

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
```

### Kurulum Adımları (Çok Önemli!)

Bu sistemi çalışır hale getirmek için projenizde birkaç ayarlama yapmanız gerekiyor.

1.  **Klasörleri Oluşturun:** Projenizin ana dizininde `netlify` adında bir klasör oluşturun. Bu klasörün içine de `functions` adında başka bir klasör oluşturun.
    ```
    /
    ├── index.html
    └── netlify/
        └── functions/
            └── gemini-proxy.js  <-- Yeni dosyayı buraya koyun
    
