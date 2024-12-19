import { Provider, IAgentRuntime } from "@ai16z/eliza";
import Snoowrap from 'snoowrap';

export const redditProvider: Provider = {
    name: "redditProvider",
    description: "Provides Reddit API functionality",
    get: async (runtime: IAgentRuntime) => {
        const clientId = runtime.getSetting("REDDIT_CLIENT_ID");
        const clientSecret = runtime.getSetting("REDDIT_CLIENT_SECRET");
        const refreshToken = runtime.getSetting("REDDIT_REFRESH_TOKEN");
        const userAgent = runtime.getSetting("REDDIT_USER_AGENT") || 'Eliza:v1.0.0 (by /u/your_username)';

        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error("Missing Reddit credentials");
        }

        // Create Snoowrap instance with automatic token refresh
        const reddit = new Snoowrap({
            userAgent,
            clientId,
            clientSecret,
            refreshToken
        });

        // Configure rate limiting
        reddit.config({
            requestDelay: 1000, // 1 second between requests
            continueAfterRatelimitError: true,
            retryErrorCodes: [502, 503, 504, 522],
            maxRetryAttempts: 3
        });

        return { reddit };
    }
};
