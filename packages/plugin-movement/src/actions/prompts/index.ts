export const analyzeSentimentPrompt = (textContent: string) => {
    return `
        Classify this Movement blockchain-related Twitter post: "${textContent}"
        RETURN EXACTLY ONE WORD FROM: [LEGITIMATE|SCAM|NEUTRAL]

        Classification Guide:
        SCAM indicators (if ANY are present, classify as SCAM):
        - Unrealistic promises (1000x gains, guaranteed returns, instant wealth)
        - Fake giveaways or airdrops requiring deposits/fees
        - Requests for private keys, seed phrases, or wallet verification
        - Impersonation of Movement Foundation, or known figures
        - Suspicious links to unknown/cloned websites
        - Urgency or FOMO tactics ("limited time", "last chance", "ending soon")
        - Requests to DM for "exclusive" opportunities
        - Unauthorized presales or token offerings
        - Claims of "protocol upgrades" requiring immediate action
        - Multiple spam-like emoji patterns (🚀💰💎)
        - Requests to connect wallets on unofficial sites
        - Copy-paste spam campaigns

        LEGITIMATE indicators:
        - Posts from verified Movement Foundation/Mysten Labs accounts
        - Official protocol updates with verifiable links
        - Technical discussions about Movement/Move development
        - Posts from known and verified Movement ecosystem projects
        - Links to official documentation or GitHub
        - Announcements through official channels

        NEUTRAL content:
        - General price discussions and market analysis
        - Personal opinions about Movement ecosystem
        - Community questions and support
        - Memes and casual content
        - Project reviews without investment advice

        IMPORTANT: Return only one word - LEGITIMATE or SCAM or NEUTRAL. No other text allowed.
        `;
};

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
};

export const labelDataPrompt = (textContent: string) => {
    return `
        You are an AI model specialized in analyzing and categorizing social media posts. Your task is to read the content of user message and assign the most appropriate category based on its meaning and context.

Ensure that:

Always select the most suitable category. If the content fits into multiple categories, choose the most relevant one.
If the post does not match any predefined category, create a new, concise, and meaningful category based on the post's topic.
Do not modify the content of the post. Only add the "category" and "color" fields.
Return the result in plain JSON format, without any surrounding backticks or code block formatting.
Categorization Guidelines:

- If the post contains news or updates → "News/Update" (Color: #2196F3)
- If the post is related to hackathons, competitions, or winner announcements → "Hackathon Update" (Color: #FF9800)
- If the post announces an event, conference, or invitation to join → "Event Announcement" (Color: #9C27B0)
- If the post analyzes the crypto market, financial indicators → "Crypto Market Analysis" (Color: #F44336)
- If the post mentions collaborations, partnerships, or alliances → "Collaboration Announcement" (Color: #FFEB3B)
- If the post is a personal story, reflection, or life lesson → "Personal Reflection" (Color: #795548)
- If the post is a proposal or introduction of a new project → "Proposal/Project Introduction" (Color: #607D8B)
- If the post contains motivational content, encouragement, or inspiration → "Motivational Post" (Color: #E91E63)
- If the post contains errors or is unavailable → "Error/Unavailable" (Color: #9E9E9E)
- If the post is meant to connect with the community, discussions, or engagement → "Community Engagement" (Color: #3F51B5)
- If the post relates to blockchain development, new technologies → "Blockchain Development" (Color: #00BCD4)
- If the post provides financial advice, investment tips → "Financial Advice" (Color: #FF5722)
- If the post contains educational content, learning resources, or tutorials → "Educational Content" (Color: #8BC34A)
- If the post does not fit into any of the above categories, create a new category based on its content and meaning.

Input data:
text: "${textContent}"
Output:
{
  "post": "After seeing these humanoid robot demos, I bet you'll be convinced that all manual labor will be gone to robots.\n\n(even the world's oldest profession will be taken by them).\n\nAll 26 humanoid robot demos:",
  "category": "Technology Discussion",
  "color": "#4CAF50" // Example color for the category
}
    `;
};
