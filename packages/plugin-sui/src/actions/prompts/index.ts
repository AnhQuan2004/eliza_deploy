export const extractAddressPrompt = (textContent: string) => {
    return `
        Extract only the address from this message: "${textContent}"
        Rules:
        - Return ONLY the address without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the address is"
        `;
}

export const extractCoinSymbolPrompt = (textContent: string) => {
    return `
        Extract only the coin symbol from this message: "${textContent}"
        Rules:
        - Return ONLY the coin symbol without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the coin symbol is"
        `;
}

export const extractAmountPrompt = (textContent: string) => {
    return `
        Extract only the amount from this message: "${textContent}"
        Rules:
        - Return ONLY the amount without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the amount is"
        `;
}

export const extractSwapFromTokenPrompt = (textContent: string) => {
    return `
        Extract only the source/from token symbol from this message: "${textContent}"
        Rules:
        - Return ONLY the token symbol (like SUI, USDC, ETH) without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the token is"
        - If multiple tokens are mentioned, return the one that comes after "from" or is mentioned first
        `;
}

export const extractSwapToTokenPrompt = (textContent: string) => {
    return `
        Extract only the destination/to token symbol from this message: "${textContent}"
        Rules:
        - Return ONLY the token symbol (like SUI, USDC, ETH) without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the token is"
        - If multiple tokens are mentioned, return the one that comes after "to" or is mentioned first
        `;
}

export const extractSenderAddressPrompt = (textContent: string) => {
    return `
        Extract only the sender address from this message: "${textContent}"
        Rules:
        - Return ONLY the address without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the address is"
        - If multiple addresses are mentioned, return the one that comes after "from" or "sender" or is mentioned first
        - The address should be in the correct Sui format (0x followed by hex characters)
        `;
}

export const extractRecipientAddressPrompt = (textContent: string) => {
    return `
        Extract only the recipient address from this message: "${textContent}"
        Rules:
        - Return ONLY the address without any explanation
        - Do not include quotes or punctuation
        - Do not include phrases like "I think" or "the address is"
        - If multiple addresses are mentioned, return the one that comes after "to" or "recipient" or is mentioned second
        - The address should be in the correct Sui format (0x followed by hex characters)
        `;
}

export const analyzeSentimentPrompt = (textContent: string) => {
    return `
        Classify this Sui blockchain-related Twitter post: "${textContent}"
        RETURN EXACTLY ONE WORD FROM: [LEGITIMATE|SCAM|NEUTRAL]

        Classification Guide:
        SCAM indicators (if ANY are present, classify as SCAM):
        - Unrealistic promises (1000x gains, guaranteed returns, instant wealth)
        - Fake giveaways or airdrops requiring deposits/fees
        - Requests for private keys, seed phrases, or wallet verification
        - Impersonation of Sui Foundation, Mysten Labs, or known figures
        - Suspicious links to unknown/cloned websites
        - Urgency or FOMO tactics ("limited time", "last chance", "ending soon")
        - Requests to DM for "exclusive" opportunities
        - Unauthorized presales or token offerings
        - Claims of "protocol upgrades" requiring immediate action
        - Multiple spam-like emoji patterns (🚀💰💎)
        - Requests to connect wallets on unofficial sites
        - Copy-paste spam campaigns

        LEGITIMATE indicators:
        - Posts from verified Sui Foundation/Mysten Labs accounts
        - Official protocol updates with verifiable links
        - Technical discussions about Sui/Move development
        - Posts from known and verified Sui ecosystem projects
        - Links to official documentation or GitHub
        - Announcements through official channels

        NEUTRAL content:
        - General price discussions and market analysis
        - Personal opinions about Sui ecosystem
        - Community questions and support
        - Memes and casual content
        - Project reviews without investment advice

        IMPORTANT: Return only one word - LEGITIMATE or SCAM or NEUTRAL. No other text allowed.
        `;
}



export const analyzePostPrompt = (textContent: string, datapost: string) => {
    return `
        Based on the question: "${textContent}"
        Analyze these relevant data posts: "${datapost}"

        Provide a focused analysis in the following format:

        ### 1. Direct Query Response
        - Provide the most direct and relevant answer to the query
        - Include only facts that are directly related to the main query
        - Note the confidence level of the information (High/Medium/Low)
        - Keep this section focused on core facts only

        ### 2. Key Information
        - **Core Details**:
          List only verified details directly related to the query (dates, numbers, requirements)
        - **Key Stakeholders**:
          List only organizations/entities directly involved

        ### 3. Additional Context & Insights
        - Note any missing but important information
        - List only directly related action items
        - Do not include speculative information
        - Do not mix information from unrelated events

        Important Guidelines:
        - Bold all dates, numbers, and deadlines using **text**
        - Keep each bullet point focused on a single piece of information
        - Maintain clear separation between sections with line breaks
        - Only include information that is directly related to the query
        - Exclude information from similar but different events
        - If information seems related but you're not sure, mention it in a 'Note:' at the end
    `;
}