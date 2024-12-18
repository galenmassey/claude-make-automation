import axios from 'axios';

export interface WebhookConfig {
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    authentication?: {
        type: 'basic' | 'bearer' | 'custom';
        credentials?: {
            username?: string;
            password?: string;
            token?: string;
        };
    };
}

export class WebhookManager {
    private baseUrl: string;
    private headers: Record<string, string>;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${apiKey}`
        };
    }

    async createWebhook(scenarioId: string, config: WebhookConfig) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/scenarios/${scenarioId}/webhooks`,
                config,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating webhook:', error.response?.data || error);
            throw error;
        }
    }

    async listWebhooks(scenarioId: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/scenarios/${scenarioId}/webhooks`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error listing webhooks:', error.response?.data || error);
            throw error;
        }
    }

    async updateWebhook(scenarioId: string, webhookId: string, updates: Partial<WebhookConfig>) {
        try {
            const response = await axios.patch(
                `${this.baseUrl}/scenarios/${scenarioId}/webhooks/${webhookId}`,
                updates,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating webhook:', error.response?.data || error);
            throw error;
        }
    }

    async deleteWebhook(scenarioId: string, webhookId: string) {
        try {
            const response = await axios.delete(
                `${this.baseUrl}/scenarios/${scenarioId}/webhooks/${webhookId}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting webhook:', error.response?.data || error);
            throw error;
        }
    }

    async testWebhook(scenarioId: string, webhookId: string, testPayload?: any) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/scenarios/${scenarioId}/webhooks/${webhookId}/test`,
                testPayload || {},
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error testing webhook:', error.response?.data || error);
            throw error;
        }
    }
}