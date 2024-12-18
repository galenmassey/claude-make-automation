import axios, { AxiosError } from 'axios';

export interface RetryConfig {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
}

export class ErrorHandler {
    private retryConfig: RetryConfig;

    constructor(config: Partial<RetryConfig> = {}) {
        this.retryConfig = {
            maxRetries: config.maxRetries || 3,
            initialDelay: config.initialDelay || 1000,
            maxDelay: config.maxDelay || 10000,
            backoffFactor: config.backoffFactor || 2
        };
    }

    async withRetry<T>(operation: () => Promise<T>): Promise<T> {
        let lastError: Error;
        let delay = this.retryConfig.initialDelay;

        for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                if (!this.shouldRetry(error)) {
                    throw error;
                }

                if (attempt < this.retryConfig.maxRetries) {
                    await this.sleep(delay);
                    delay = Math.min(
                        delay * this.retryConfig.backoffFactor,
                        this.retryConfig.maxDelay
                    );
                }
            }
        }

        throw lastError!;
    }

    private shouldRetry(error: any): boolean {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            // Retry on network errors or specific HTTP status codes
            return !status || [408, 429, 500, 502, 503, 504].includes(status);
        }
        return false;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleApiError(error: AxiosError) {
        const errorResponse = error.response?.data;
        const status = error.response?.status;

        switch (status) {
            case 400:
                throw new Error(`Bad Request: ${JSON.stringify(errorResponse)}`);
            case 401:
                throw new Error('Unauthorized: Invalid API key');
            case 403:
                throw new Error('Forbidden: Insufficient permissions');
            case 404:
                throw new Error('Not Found: Resource does not exist');
            case 429:
                throw new Error('Too Many Requests: Rate limit exceeded');
            case 500:
                throw new Error('Internal Server Error');
            default:
                throw new Error(`API Error: ${error.message}`);
        }
    }
}