import axiosInstance from "../Interceptor/AxiosInterceptor";

/**
 * Upload a PDF resume and get back structured profile data from AI.
 */
const parseResume = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance
        .post(`/resume/parse`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res: any) => {
            try {
                return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            } catch {
                return { error: "Could not parse response from AI." };
            }
        })
        .catch((err: any) => { throw err; });
};

/**
 * Ask the AI to generate a professional job description.
 * Used on the PostJob page by employers.
 */
const generateJobDescription = async (jobTitle: string, notes: string): Promise<string> => {
    return axiosInstance
        .post(`/ai/generate-description`, { jobTitle, notes })
        .then((res: any) => res.data.description)
        .catch((err: any) => { throw err; });
};

/**
 * Strip markdown code fences that some LLMs wrap JSON in.
 * e.g. ```json\n{...}\n``` → {...}
 */
const stripMarkdownFences = (raw: string): string => {
    let clean = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/, '')
        .trim();
    // In case the AI adds conversational text, extract just the JSON object
    const startIdx = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        clean = clean.substring(startIdx, endIdx + 1);
    }
    return clean;
};

/**
 * Get an AI match score between this user's profile and a job.
 * Used on the JobPage by applicants.
 */
const getMatchScore = async (candidateProfile: string, jobDescription: string): Promise<any> => {
    return axiosInstance
        .post(`/ai/match-score`, { candidateProfile, jobDescription })
        .then((res: any) => {
            try {
                // Groq returns a string, strip markdown fences if present
                const raw: string = typeof res.data === "string"
                    ? stripMarkdownFences(res.data)
                    : stripMarkdownFences(JSON.stringify(res.data));
                return JSON.parse(raw);
            } catch {
                // Fallback: return a structured error object
                return {
                    score: null,
                    summary: "AI returned an unexpected format. Please try again.",
                    strengths: [],
                    gaps: [],
                };
            }
        })
        .catch((err: any) => { throw err; });
};

/**
 * Parse natural language into structured search filters using AI.
 */
const parseSearchQuery = async (query: string): Promise<any> => {
    return axiosInstance
        .post(`/ai/parse-search`, { query })
        .then((res: any) => {
            try {
                const raw: string = typeof res.data === "string"
                    ? stripMarkdownFences(res.data)
                    : stripMarkdownFences(JSON.stringify(res.data));
                return JSON.parse(raw);
            } catch {
                throw new Error("Failed to parse AI response into JSON");
            }
        })
        .catch((err: any) => { throw err; });
};

/**
 * Chat with the CareerConnect support bot.
 */
const chatBot = async (history: { role: string, text: string }[]): Promise<string> => {
    return axiosInstance
        .post(`/ai/chat`, history)
        .then((res: any) => res.data.message)
        .catch((err: any) => { throw err; });
};

export { parseResume, generateJobDescription, getMatchScore, parseSearchQuery, chatBot };
