
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PerformanceStats, DailyStudyPlan, RemediationContent, MCQ, ClinicalCase, RevisionSheet, SmartExplanation } from "../types";

export const getAIResponse = async (prompt: string, context?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `You are a world-class Medical AI Tutor for students preparing for NEET PG and NEXT exams. 
  GUIDELINES: Base responses on Standard Textbooks. Format with Markdown. Context: ${context || 'General High-Yield Revision'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction, temperature: 0.6 },
  });
  return response.text;
};

export const generateSmartExplanation = async (
  mcq: MCQ, 
  isWeakTopic: boolean = false, 
  targetExam: string = 'NEET PG'
): Promise<SmartExplanation | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a structured, high-yield medical explanation for this MCQ:
  Question: ${mcq.question}
  Options: ${mcq.options.join(', ')}
  Correct Answer: ${mcq.options[mcq.correctAnswer]}
  
  Target Exam: ${targetExam}
  Student Status: ${isWeakTopic ? 'Weak in this topic' : 'Normal'}
  Difficulty: ${mcq.difficulty}
  
  GOAL:
  Ensure that every MCQ explanation follows a structured, high-yield, exam-focused format to maximize retention and conceptual clarity.

  REQUIRED SECTIONS:
  1. CONCEPT SUMMARY: 3–6 concise lines. Explain the core concept behind the correct answer. Focus on mechanism and logic. Keep it exam-oriented and high-yield. Avoid unnecessary textbook verbosity.
  2. CLINICAL CORRELATION: Explain how this concept appears in real clinical practice. Mention common patient scenarios. Link to diagnosis, management, or investigation. Keep it practical and application-based.
  3. EXAM TRAP NOTE: Highlight common confusion areas. Mention frequently mistaken concepts. Clarify why students usually get this wrong. Include memory hooks if helpful. Keep it short and sharp.
  4. WHY OTHER OPTIONS ARE WRONG: For EACH incorrect option, provide 1–2 lines explaining why it is incorrect. Focus on conceptual mismatch. Avoid generic statements like "This is wrong".

  OPTIONAL ENHANCEMENTS (Include if applicable):
  - If topic is high-yield: Add "mostTestedPoint" highlight.
  - If question is difficult: Add brief "stepwiseReasoning" breakdown (array of strings).
  - If student is weak in this topic: Add simplified "boosterExplanation" and a quick "mnemonic".

  Return the response as a structured JSON object matching the SmartExplanation interface.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conceptSummary: { type: Type.STRING },
          clinicalCorrelation: { type: Type.STRING },
          examTrapNote: { type: Type.STRING },
          optionExplanations: { type: Type.ARRAY, items: { type: Type.STRING } },
          boosterExplanation: { type: Type.STRING },
          mnemonic: { type: Type.STRING },
          mostTestedPoint: { type: Type.STRING },
          stepwiseReasoning: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["conceptSummary", "clinicalCorrelation", "examTrapNote", "optionExplanations", "mostTestedPoint"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as SmartExplanation;
  } catch (e) {
    console.error("Failed to parse smart explanation", e);
    return null;
  }
};

export const generateRemediation = async (topic: string): Promise<RemediationContent | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a comprehensive remediation package for the medical topic: "${topic}".
  The package must include:
  1. 5 Targeted MCQs (Gradual difficulty, mix of recall + application).
  2. 2 Clinical Mini-Cases (Scenario, stepwise reasoning, diagnostic approach).
  3. 1 Rapid Revision Sheet (High-yield summary, mnemonics, common traps, "Most Tested" markers).
  
  Return the response as a structured JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mcqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                clinicalClue: { type: Type.STRING },
                conceptHint: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation", "difficulty"]
            }
          },
          clinicalCases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.INTEGER },
                      reasoning: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "reasoning"]
                  }
                },
                diagnosticApproach: { type: Type.STRING }
              },
              required: ["scenario", "steps", "diagnosticApproach"]
            }
          },
          revisionSheet: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              mnemonics: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonTraps: { type: Type.ARRAY, items: { type: Type.STRING } },
              mostTestedMarkers: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "summary", "mnemonics", "commonTraps", "mostTestedMarkers"]
          }
        },
        required: ["mcqs", "clinicalCases", "revisionSheet"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as RemediationContent;
  } catch (e) {
    console.error("Failed to parse remediation content", e);
    return null;
  }
};

export const suggestSimilarQuestions = async (title: string, content: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on this medical doubt: "${title}. ${content}", suggest 3 similar high-yield medical questions or topics that a student should also review. Return as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text) as string[];
  } catch (e) {
    return [];
  }
};

export const summarizeNote = async (noteTitle: string, noteContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Summarize the following medical note: "${noteTitle}". 
  Note Content: ${noteContent}
  Provide:
  1. High-Yield Key Concepts (Bullet points).
  2. Frequently Asked Facts in Exams.
  3. A clinical mnemonic if applicable.
  Keep it concise and structured for a mobile study app.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.3 },
  });
  return response.text;
};

export const analyzeSyllabusContext = async (topic: string, tags: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze the importance of the medical topic "${topic}" (Syllabus Codes: ${tags.join(', ')}) for exams like NEET PG and NEXT. 
  Provide high-yield insights on frequency, integration, and focus areas.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.4 },
  });
  return response.text;
};

export const generateStudyPlan = async (stats: PerformanceStats): Promise<DailyStudyPlan | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a daily study plan for a medical student based on their stats: ${JSON.stringify(stats)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          focusArea: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                subject: { type: Type.STRING },
                duration: { type: Type.STRING },
                priority: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["title", "type", "subject", "duration", "priority", "reason"]
            }
          }
        },
        required: ["summary", "focusArea", "tasks"]
      }
    },
  });

  try {
    return JSON.parse(response.text) as DailyStudyPlan;
  } catch (e) {
    return null;
  }
};

export const generateMCQs = async (topic: string, count: number = 3) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate ${count} high-yield medical MCQs for ${topic}. Include progressive hints.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            clinicalClue: { type: Type.STRING },
            conceptHint: { type: Type.STRING },
            eliminationHint: { type: Type.STRING },
            mnemonic: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation", "difficulty"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Explain clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
};

export const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
