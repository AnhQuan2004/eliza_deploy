import { Action, ActionExample, Memory, IAgentRuntime, State, HandlerCallback, generateText, ModelClass, elizaLogger } from "@elizaos/core";
import { labelDataPrompt } from "./prompts";
import { LabelDataAction } from "./enum";

// Define a mapping of categories to color codes
const categoryColorMap: { [key: string]: string } = {
    "Technology Discussion": "#4CAF50", // Green
    "News/Update": "#2196F3", // Blue
    "Hackathon Update": "#FF9800", // Orange
    "Event Announcement": "#9C27B0", // Purple
    "Crypto Market Analysis": "#F44336", // Red
    "Collaboration Announcement": "#FFEB3B", // Yellow
    "Personal Reflection": "#795548", // Brown
    "Proposal/Project Introduction": "#607D8B", // Blue Grey
    "Motivational Post": "#E91E63", // Pink
    "Error/Unavailable": "#9E9E9E", // Grey
    "Community Engagement": "#3F51B5", // Indigo
    "Blockchain Development": "#00BCD4", // Cyan
    "Financial Advice": "#FF5722", // Deep Orange
    "Educational Content": "#8BC34A", // Light Green
    "Uncategorized": "#000000" // Black for uncategorized
};

export default {
    name: "LABEL_DATA",
    similes: [
        "label data", "label", "you need to label data", "help me label data", "what label post"
    ],
    description: "Label data of text content",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content?.text?.length > 0;
    },
    handler: async (runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback) => {
        try {
            const context = labelDataPrompt(message.content.text);
            console.log(context);

            const response = await generateText({
                runtime,
                context: JSON.stringify(context),
                modelClass: ModelClass.MEDIUM,
                stop: ["\n"],
            });

            const parsedResponse = JSON.parse(response.trim());
            const post = parsedResponse.post || message.content.text;
            const category = parsedResponse.category || "Uncategorized"; // Extract category
            const color = categoryColorMap[category] || "#000000"; // Get color code

            callback({
                text: response.trim(),
                action: LabelDataAction.LABEL_DATA,
                params: {
                    post,
                    label: category,
                    color // Include the color code in the params
                }
            });

        } catch (error) {
            console.error('Error in label data:', error);
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
