import { GoogleGenAI, Modality } from "@google/genai";
import { StagingStyle, AspectRatio, RoomType } from '../types';

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimePart, base64Part] = result.split(';base64,');
      if (!mimePart || !base64Part) {
        reject(new Error("Invalid file format. Could not extract base64 data."));
        return;
      }
      const mimeType = mimePart.split(':')[1];
      if (!mimeType) {
        reject(new Error("Invalid file format. Could not determine MIME type."));
        return;
      }
      resolve({ mimeType, data: base64Part });
    };
    reader.onerror = (error) => reject(error);
  });
};

let ai: GoogleGenAI | null = null;
const getAiClient = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const stageImage = async (file: File, style: StagingStyle, aspectRatio: AspectRatio, roomType: RoomType, feedback?: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const { mimeType, data } = await fileToBase64(file);

        let promptText = `Strictly follow these instructions: Do not change the room layout, walls, windows, doors, ceiling structures, or any existing fixtures. Only add furniture and decorative props. The props and furniture should be added without modifying the original picture's structure in any way. Ensure all added furniture is realistically scaled to fit the room's dimensions. The floor must also remain unchanged. Ensure the final image has an aspect ratio of ${aspectRatio}. `;
        if (roomType === 'Other') {
            promptText += `Please identify the type of this empty room and stage it with appropriate furniture and decor in a ${style} style.`;
        } else {
            promptText += `Please stage this empty ${roomType} with appropriate furniture and decor in a ${style} style.`;
        }

        if (feedback && feedback.trim()) {
            promptText += ` Please incorporate the following user feedback to refine the image: "${feedback}".`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: data,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: promptText,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // Assuming the API returns a PNG image for consistency
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }

        throw new Error("AI did not return a staged image. It might have only returned text.");
    } catch (error) {
        console.error("Error staging image:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to stage image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image staging.");
    }
};