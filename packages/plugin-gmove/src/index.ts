import { Plugin } from "@elizaos/core";
import analyzeSentimentAction from "./actions/analyze-sentiment.ts";
import chatData from "./actions/give-insight-data.ts";
// Export all actions
export {
    analyzeSentimentAction,
    chatData
};

// Export providers and services

export const gmovePlugin: Plugin = {
    name: "gmove",
    description: "GMove Plugin for Eliza",
    actions: [
        analyzeSentimentAction,
        chatData],
    evaluators: [],
    providers: [],
    services: [],
};

export default gmovePlugin;
