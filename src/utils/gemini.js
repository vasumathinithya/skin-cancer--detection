
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

export const generateAIAnalysis = async (diseaseName, severity, confidence, apiKey = getStoredKey()) => {
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
                throw new Error(proError.message || "Failed to generate report.");
            }
        }
    }
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
