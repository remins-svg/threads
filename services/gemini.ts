
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, VIRAL_PROMPT_TEMPLATE, ADVISOR_SYSTEM_INSTRUCTION } from "../constants";
import { Persona, ViralFormula, FormulaRecommendation, ProfileContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transformTone = async (text: string, persona: Persona): Promise<string> => {
  const prompt = `
당신이 맡을 페르소나 정보:
이름: ${persona.name}
설명: ${persona.description}
지시사항: ${persona.promptInstruction}

입력된 원문:
"${text}"

이 원문을 위 페르소나의 목소리로 스레드 게시물로 변환해주세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });
    return response.text?.trim() || "변환 실패";
  } catch (error) {
    throw new Error("AI 변환 중 오류 발생");
  }
};

export const generateViralPost = async (situation: string, formula: ViralFormula): Promise<string> => {
  const prompt = VIRAL_PROMPT_TEMPLATE
    .replace('{title}', formula.title)
    .replace('{prompt}', formula.prompt)
    .replace('{situation}', situation);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      },
    });
    return response.text?.trim() || "생성 실패";
  } catch (error) {
    throw new Error("떡상 문구 생성 중 오류 발생");
  }
};

export const getFormulaRecommendation = async (situation: string): Promise<FormulaRecommendation[]> => {
  const prompt = `사용자 상황: "${situation}"\n이 상황에 가장 잘 어울리는 떡상 공식을 추천하고 이유를 알려줘.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  formulaId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["formulaId", "reason"]
              }
            }
          },
          required: ["recommendations"]
        }
      },
    });
    const data = JSON.parse(response.text);
    return data.recommendations;
  } catch (error) {
    console.error(error);
    throw new Error("추천 중 오류 발생");
  }
};

export const generateProfileContent = async (brandInfo: string, style: string): Promise<ProfileContent> => {
  const prompt = `브랜드 정보: "${brandInfo}", 원하는 스타일: "${style}". 
  이 정보를 바탕으로 스레드(Threads)용 프로필 이름(Catchy name), 바이오(Bio), 그리고 프로필 이미지 생성용 프롬프트(English image prompt)를 생성해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "당신은 SNS 브랜딩 전문가입니다. 스레드 감성에 맞는 친근하고 위트있는 프로필을 만들어주세요. JSON 형식으로 응답하세요.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "스레드 프로필 이름" },
            bio: { type: Type.STRING, description: "스레드 프로필 바이오" },
            imagePrompt: { type: Type.STRING, description: "프로필 이미지 생성을 위한 영어 프롬프트" }
          },
          required: ["name", "bio", "imagePrompt"]
        }
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    throw new Error("프로필 정보 생성 중 오류 발생");
  }
};

export const generateProfileImage = async (imagePrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional and stylish social media profile avatar for Threads, following this description: ${imagePrompt}. High quality, minimal, artistic.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("이미지 데이터가 응답에 없습니다.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw new Error("이미지 생성 중 오류 발생");
  }
};
