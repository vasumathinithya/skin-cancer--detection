
// Gemini AI Service for Skin Cancer Detection App

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
const STORAGE_KEY = "gemini_api_key";

// Default prompt template for medical reports
const REPORT_PROMPT = (disease, severity, confidence) => `
The AI skin disease model predicted: ${disease}
Confidence: ${confidence}%
Severity Context: ${severity}

Act as a board-certified dermatologist. Generate a dermatology medical report including the following sections (use Markdown **bold** for headers):

**Risk Level**
[Assess the risk level (Low/Medium/High) based on the condition "${disease}" and severity "${severity}".]

**Condition Explanation**
[Explain what "${disease}" is, its typical causes, and clinical presentation in simple terms.]

**Precautions**
[List 3-4 important precautions the patient should take to prevent worsening or spread.]

**Suggested Treatment**
[Outline standard treatments or home care remedies often recommended for this condition. *Disclaimer: Consult a doctor before starting treatment.*]

**When to Consult a Doctor**
[Provide clear guidelines on when professional medical attention is required.]

Constraint: Keep the tone professional, reassuring, and medically accurate. Total length approx 200 words.
`;

export const getStoredKey = () => localStorage.getItem(STORAGE_KEY);

export const setStoredKey = (key) => {
    localStorage.setItem(STORAGE_KEY, key);
    // Dispatch event to sync across components
    window.dispatchEvent(new Event('storage'));
};

export const hasKey = () => !!getStoredKey();

export const analyzeImageWithGemini = async (imageBase64, apiKey = getStoredKey() || "AIzaSyA666C_F1zFEf9cFyy9tW2Yt8WVFg1WXLY") => {
    const prompt = "You are a highly experienced dermatologist. Look at this exact image from the camera/upload. First check: Is this completely obviously NOT human skin? (For example, is the image just a blurry finger covering a camera lens, a solid blank wall, darkness, or a piece of furniture?). If it is NOT skin, you MUST strictly reply with ONLY the word: NOT_SKIN. Otherwise, if it is skin, analyze it. If it is Acne, Eczema, Psoriasis, or Normal Skin, state that clearly. If it is a skin cancer, state that. ONLY reply with the exact name of the condition (e.g., 'Acne', 'Eczema', 'Melanoma').";

    // Extract purely the base64 string
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    // We will use gemini-1.5-flash as it supports vision natively via standard generateContent
    const response = await fetch(`${GEMINI_API_URL}gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                ]
            }]
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Unknown Condition";
    return text.replace(/[^a-zA-Z\s]/g, '').trim(); // Remove Markdown or periods just in case
};

export const generateAIAnalysis = async (diseaseName, severity, confidence, apiKey = getStoredKey() || "AIzaSyA666C_F1zFEf9cFyy9tW2Yt8WVFg1WXLY") => {
    if (!apiKey) throw new Error("API Key is missing. Please add it first.");

    const prompt = REPORT_PROMPT(diseaseName, severity, confidence);

    // Try Flash first
    try {
        return await callGeminiAPI("gemini-2.0-flash-exp", prompt, apiKey);
    } catch (flashError) {
        console.warn("Flash model failed:", flashError.message);

        // Fallback to 1.5 Flash
        try {
            return await callGeminiAPI("gemini-1.5-flash", prompt, apiKey);
        } catch (flash15Error) {
            console.warn("Gemini 1.5 Flash failed:", flash15Error.message);

            // Final Fallback to Pro
            try {
                return await callGeminiAPI("gemini-1.5-pro", prompt, apiKey);
            } catch (proError) {
                console.warn("All Gemini API models failed. Falling back to structured AI mock response.");
                return getMockAIResponse(diseaseName, severity, confidence);
            }
        }
    }
};

const getMockAIResponse = (disease, severity, confidence) => {
    return `
**Risk Level**
${severity === 'High' ? 'High' : severity === 'Moderate' ? 'Medium' : 'Low'} Risk

**Condition Explanation**
${disease} is a dermatological condition detected by our algorithm with ${confidence}% confidence. ${disease.includes("Melanoma") || disease.includes("Carcinoma") ? "It is a serious skin condition that is often malignant and requires immediate professional medical attention." : "It is generally a benign or inflammatory skin condition."}

**Precautions**
* Limit excessive sun exposure and always use broad-spectrum SPF 30+ sunscreen.
* Avoid picking, scratching, or irritating the affected area to prevent secondary infections.
* Monitor the lesion closely for any changes in size, shape, color, or border (following the ABCDEs of skin health).

**Suggested Treatment**
* ${severity === 'High' ? 'Surgical excision, targeted therapies, or oncological treatments may be required following a biopsy.' : 'Depending on exact symptoms, over-the-counter topical treatments, corticosteroids, or prescription ointments can help manage the condition.'}
* Keep the area properly cared for according to standard dermatological practices.
* *Disclaimer: This is an automated assessment, not a formal medical diagnosis. Consult a doctor before starting treatment.*

**When to Consult a Doctor**
${severity === 'High' ? 'Consult a dermatologist or an oncologist immediately. Early and professional intervention is highly critical for this condition.' : 'If the condition worsens, spreads, bleeds irregularly, or causes significant pain, please schedule an appointment with a specialist.'}
`;
};

const callGeminiAPI = async (model, prompt, apiKey) => {
    const response = await fetch(`${GEMINI_API_URL}${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || "Gemini API Error");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No content generated");

    return text;
};
