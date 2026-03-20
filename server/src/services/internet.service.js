import { tavily } from "@tavily/core";

const tavilyClient = new tavily({
    apiKey: process.env.TAVILY_API_KEY
})

export const searchInternet = async ({ query }) => {
    const results = await tavilyClient.search(query, {
        maxResults: 5,
        searchDepth: "basic"
    })

    return JSON.stringify(results);
}