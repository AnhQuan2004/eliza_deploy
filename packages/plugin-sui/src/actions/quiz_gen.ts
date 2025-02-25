import { Action, ActionExample, Memory, IAgentRuntime, State, HandlerCallback, generateText, ModelClass, elizaLogger } from "@elizaos/core";
import { quizGenPrompt } from "./prompts";
import { QuizGenAction } from "./enum";
import axios from 'axios';

// Add interface for Ideogram API response
interface IdeogramResponse {
    created: string;
    data: Array<{
        url: string;
        is_image_safe: boolean;
        prompt: string;
        resolution: string;
        seed: number;
        style_type: string;
    }>;
}

export default {
    name: "QUIZ_GEN",
    similes: [
        "quiz gen", "quiz", "I need to quiz gen", "help me quiz gen", "what quiz gen"
    ],
    description: "Quiz gen of text content",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content?.text?.length > 0;
    },
    handler: async (runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback) => {
        try {
            const context = quizGenPrompt(message.content.text);
            console.log(context);

            const response = await generateText({
                runtime,
                context: JSON.stringify(context),
                modelClass: ModelClass.MEDIUM,
            });

            let parsedResponse;
            try {
                // First try parsing as JSON
                parsedResponse = JSON.parse(response.trim());
            } catch (e) {
                // If JSON parsing fails, try parsing the formatted text
                const lines = response.trim().split('\n');
                parsedResponse = {};
                
                // Parse question
                const questionMatch = lines[0].match(/Question:\s*(.*)/);
                if (questionMatch) {
                    parsedResponse.question = questionMatch[1].trim();
                }

                // Parse answers
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('A.')) parsedResponse.answerA = line.substring(2).trim();
                    if (line.startsWith('B.')) parsedResponse.answerB = line.substring(2).trim();
                    if (line.startsWith('C.')) parsedResponse.answerC = line.substring(2).trim();
                    if (line.startsWith('D.')) parsedResponse.answerD = line.substring(2).trim();
                }

                // Parse correct answer
                const correctMatch = lines.find(line => line.toLowerCase().includes('correct answer'))?.match(/:\s*([A-D])/i);
                if (correctMatch) {
                    parsedResponse.correctAnswer = correctMatch[1].trim();
                }

                if (!parsedResponse.question || !parsedResponse.correctAnswer) {
                    elizaLogger.error('Failed to parse formatted response:', response);
                    throw new Error('Invalid quiz generation response format');
                }
            }

            const {
                question = message.content.text,
                answerA,
                answerB,
                answerC,
                answerD,
                correctAnswer
            } = parsedResponse;

            // Generate image using Ideogram API
            try {
                const imagePrompt = `An animated character, resembling a yellow duck, wearing glasses and a white lab coat. The character stands in front of a large whiteboard that reads '${question}'. The background appears to be a room with a window.`;
                
                const ideogramResponse = await axios.post<IdeogramResponse>(
                    'https://api.ideogram.ai/generate',
                    {
                        image_request: {
                            prompt: imagePrompt,
                            aspect_ratio: "ASPECT_10_16",
                            model: "V_2",
                            magic_prompt_option: "AUTO"
                        }
                    },
                    {
                        headers: {
                            'Api-Key': process.env.IDEOGRAM_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (ideogramResponse.status === 200 && ideogramResponse.data.data[0]?.url) {
                    const imageUrl = ideogramResponse.data.data[0].url;
                    elizaLogger.info('Image URL generated:', imageUrl);
                    callback({
                        text: response.trim(),
                        action: QuizGenAction.QUIZ_GEN,
                        params: {
                            question,
                            answerA,
                            answerB,
                            answerC,
                            answerD,
                            correctAnswer,
                            imageUrl,
                        }
                    });
                } else {
                    elizaLogger.error('Failed to get image URL from response');
                    callback({
                        text: response.trim(),
                        action: QuizGenAction.QUIZ_GEN,
                        params: {
                            question,
                            answerA,
                            answerB,
                            answerC,
                            answerD,
                            correctAnswer,
                        }
                    });
                }
            } catch (error) {
                elizaLogger.error('Error generating image:', error);
                callback({
                    text: response.trim(),
                    action: QuizGenAction.QUIZ_GEN,
                    params: {
                        question,
                        answerA,
                        answerB,
                        answerC,
                        answerD,
                        correctAnswer,
                    }
                });
            }

        } catch (error) {
            console.error('Error in quiz gen:', error);
            throw error;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I love the new features in the app! It's so user-friendly."
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "The app has improved a lot, especially the new updates!"
                }
            }
        ],
        [
            {
                user: "{{user3}}",
                content: {
                    text: "I'm not happy with the recent changes. They made it worse."
                }
            },
            {
                user: "{{user4}}",
                content: {
                    text: "The latest update is frustrating and confusing."
                }
            }
        ]
    ] as ActionExample[][],
};

export interface TwitterPost {
    id: string;
    text: string;
    userId: string;
    createdAt: Date;
}