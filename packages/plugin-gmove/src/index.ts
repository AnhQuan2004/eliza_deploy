import { Plugin } from "@elizaos/core";
import analyzeSentimentAction from "./actions/analyze-sentiment.ts";
import chatData from "./actions/give-insight-data.ts";
import labelData from "./actions/label-data.ts";
// Export all actions
export {
    analyzeSentimentAction,
    chatData,
    labelData
};

export const gmovePlugin: Plugin = {
    name: "gmove",
    description: "Gmove Plugin for Eliza",
    actions: [
        analyzeSentimentAction,
        chatData,
        labelData
    ],
    evaluators: [],
    providers: [],
    services: [],
};

export default gmovePlugin;
