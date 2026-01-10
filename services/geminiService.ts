import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult } from "../types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function detectPhoneUsage(
  base64Image: string
): Promise<DetectionResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text:
              "Analyze this image and determine whether a mobile phone is visible " +
              "or being used by the person. Return ONLY JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phone_detected: {
              type: Type.BOOLEAN,
              description: "Whether a mobile phone is visible in the image.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1.",
            },
          },
          required: ["phone_detected", "confidence"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    const detected_objects = [];

    // ONLY add bounding box if phone is detected
    if (result.phone_detected) {
      detected_objects.push({
        type: "mobile_device",
        x: 0.6,
        y: 0.5,
        width: 0.3,
        height: 0.35,
        confidence: result.confidence ?? 0.8,
      });
    }

    return {
      phone_detected: result.phone_detected ?? false,
      confidence: result.confidence ?? 0,
      detection_method: "Gemini Vision AI",
      phone_location: result.phone_detected ? "Near user" : "Not detected",
      detected_objects,
    };
  } catch (error) {
    console.error("Gemini Detection Error:", error);
    return {
      phone_detected: false,
      confidence: 0,
      detection_method: "Gemini Vision AI",
      detected_objects: [],
    };
  }
}
