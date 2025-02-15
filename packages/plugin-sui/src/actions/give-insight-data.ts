import { OpenAIEmbeddings } from '@langchain/openai';
import { Action, ActionExample, Memory, IAgentRuntime, State, HandlerCallback, generateText, ModelClass, elizaLogger, RAGKnowledgeItem } from "@elizaos/core";
import { analyzePostPrompt } from "./prompts";
import { ChatDataAction } from "./enum";
import * as fs from 'fs/promises';
import * as path from 'path';
import { getFolderByUserAddress } from '../services/tusky';

// Utility function to write logs to file
async function writeToLog(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    try {
        await fs.appendFile('log.txt', logMessage);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

export interface DataItem {
    id: string;
    text: string;
}

interface ProcessedPost {
    id: string;
    text: string;
    embedding?: number[];
}

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, val, index) => sum + val * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

const groupPostsById = (posts: DataItem[]): ProcessedPost[] => {
    const groupedPosts = new Map<string, string[]>();
    
    // Group all texts by ID
    posts.forEach(post => {
        if (!groupedPosts.has(post.id)) {
            groupedPosts.set(post.id, []);
        }
        if (post.text) {
            groupedPosts.get(post.id)!.push(post.text);
        }
    });

    // Convert grouped posts to final format
    return Array.from(groupedPosts.entries()).map(([id, texts]) => ({
        id,
        text: texts.join('\n')
    }));
};

const calculateSimilarity = (
    postEmbedding: number[], 
    queryEmbedding: number[], 
    postText: string, 
    query: string
): number => {
    // Base semantic similarity
    const similarity = cosineSimilarity(postEmbedding, queryEmbedding);
    
    // Convert to lowercase for case-insensitive matching
    const postLower = postText.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact phrase matching boost
    const phraseBoost = postLower.includes(queryLower) ? 0.2 : 0;
    
    // Individual terms matching boost
    const queryTerms = queryLower.split(' ').filter(term => term.length > 2);
    const termBoost = queryTerms.reduce((boost, term) => {
        return boost + (postLower.includes(term) ? 0.1 : 0);
    }, 0);
    
    return similarity + phraseBoost + termBoost;
};

export default {
    name: "DATA_INSIGHT",
    similes: [
        "insight data", "what is the data", "show me the data purpose",
        "give me insights", "data insight"
    ],
    description: "Insight data from all collected data",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content?.text?.length > 0;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: {
            userAddress?: string;
            [key: string]: unknown
        },
        callback?: HandlerCallback
    ) => {
        try {
            await writeToLog("Starting DATA_INSIGHT analysis...");

            const userAddress = options.userAddress || "0xb4b291607e91da4654cab88e5e35ba2921ef68f1b43725ef2faeae045bf5915d";
            const rawData = await getFolderByUserAddress(userAddress);

            if (!rawData || typeof rawData === "string") {
                throw new Error('No valid data found');
            }

            // Process and group the raw data
            const processedPosts = rawData.map((item: any) => {
                const data = item.data;
                if (Array.isArray(data)) {
                    return data.map(d => ({
                        id: item.id,
                        text: d.text || d.msg || ''
                    }));
                } else if (typeof data === 'object' && data !== null) {
                    return [{
                        id: item.id,
                        text: data.text || data.msg || ''
                    }];
                }
                return [];
            }).flat().filter(post => post.text && post.text.length > 0);

            await writeToLog(`Processed ${processedPosts.length} posts`);

            // Group posts by ID
            const groupedPosts = groupPostsById(processedPosts);
            await writeToLog(`Grouped into ${groupedPosts.length} unique posts`);

            if (groupedPosts.length === 0) {
                throw new Error('No valid content found after processing');
            }

            // Initialize OpenAI Embeddings
            const embeddings = new OpenAIEmbeddings({
                apiKey: process.env.OPENAI_API_KEY,
            });

            // Create embeddings for posts
            const postEmbeddings = await embeddings.embedDocuments(
                groupedPosts.map(post => post.text)
            );

            // Create embedding for query
            const queryEmbedding = await embeddings.embedDocuments([message.content.text]);

            // Calculate similarities and rank posts
            const rankedPosts = groupedPosts.map((post, index) => ({
                ...post,
                similarity: calculateSimilarity(
                    postEmbeddings[index],
                    queryEmbedding[0],
                    post.text,
                    message.content.text
                )
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);  // Get top 3 most relevant posts

            // Generate comprehensive response using top posts
            const context = rankedPosts.map(post => post.text).join('\n\n');
            const response = await generateText({
                runtime,
                context: analyzePostPrompt(message.content.text, context),
                modelClass: ModelClass.MEDIUM,
                stop: ["\n"],
            });

            callback?.({
                text: response.trim(),
                action: ChatDataAction.INSIGHT_DATA,
                params: {
                    label: response.trim(),
                    relevantPosts: rankedPosts.map(post => ({
                        id: post.id,
                        text: post.text,
                        similarity: post.similarity
                    }))
                }
            });

        } catch (error) {
            await writeToLog(`Error in data analysis: ${error.message}\n${error.stack}`);
            throw error;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the trend in crypto posts?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Recent posts show strong focus on Bitcoin ETF approval and institutional adoption."
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the data insights"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "The posts discuss various crypto topics including BTC price, ETH ecosystem, and NFT markets."
                }
            }
        ]
    ] as ActionExample[][]
};