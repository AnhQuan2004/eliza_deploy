import { Plugin } from "@elizaos/core";
import quizGenAction from "./actions/quiz_gen";
// Export all actions
export {
    quizGenAction,
};

export const moveDuckPlugin: Plugin = {
    name: "moveDuck",
    description: "Move Duck Plugin for Eliza",
    actions: [
        quizGenAction,
    ],
    evaluators: [],
    providers: [],
    services: [],
};

export default moveDuckPlugin;
