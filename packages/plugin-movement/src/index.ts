import { Plugin } from "@elizaos/core";
import transferToken from "./actions/transfer.ts";
import { WalletProvider, walletProvider } from "./providers/wallet.ts";
import analyzeSentimentAction from "./actions/analyze-sentiment.ts";
import chatData from "./actions/give-insight-data.ts";
import labelData from "./actions/label-data.ts";
// Export all actions
export { transferToken, analyzeSentimentAction, chatData, labelData };

// Export providers and services
export { WalletProvider, walletProvider };

export const movementPlugin: Plugin = {
    name: "movement",
    description: "Movement Plugin for Eliza",
    actions: [analyzeSentimentAction, chatData, labelData],
    evaluators: [],
    providers: [walletProvider],
    services: [],
};

export default movementPlugin;
