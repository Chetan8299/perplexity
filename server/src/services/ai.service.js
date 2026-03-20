import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage, tool, createAgent } from "langchain"
import { searchInternet } from "./internet.service.js";
import * as z from "zod";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(searchInternet, {
    name: "searchInternet",
    description: "Search the internet for latest information on a given topic",
    schema: z.object({
        query: z.string().describe("The search query to find information on the internet")
    })
})

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool],
})

export async function generateResponse(messages) {
    const response = await agent.invoke({
        messages: [
            new SystemMessage(`You are a helpful assistant that can search the internet for information on a given topic.
                You have access to the following tools:
                - searchInternet: Search the internet for latest information on a given topic
                `),
            ...messages.map(msg => {
                if (msg?.role == "user") {
                    return new HumanMessage(msg?.content);
                } else if (msg?.role == "assistant") {
                    return new AIMessage(msg?.content);
                }
            })
        ]
    })

    return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for the chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the
            essence of the conversation in 2-4 words. The title should be clear , relevant and engaging, giving users a quick understanding
            of the chat's topic
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message: 
            "${message}"
        `)
    ])

    return response.text;
}