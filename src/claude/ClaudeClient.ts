import { Anthropic } from '@anthropic-ai/sdk';
import { MPCProtocol } from '../security/MPCProtocol';
import { EncryptedMessage, Share } from '../types';

export class ClaudeClient {
    private anthropic: Anthropic;
    private mpc: MPCProtocol;
    private sessionId: string;

    constructor(apiKey: string) {
        this.anthropic = new Anthropic({
            apiKey: apiKey
        });
        this.mpc = new MPCProtocol();
        this.sessionId = '';
    }

    async initializeSession(): Promise<void> {
        try {
            const response = await this.anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 1024,
                messages: [{
                    role: "user",
                    content: `You are now entering secure MPC mode. When you receive an encrypted payload, respond with EXACTLY the same payload wrapped in <secure_response></secure_response> tags. Do not interpret, modify, or add any additional text to the payload. Confirm you understand by responding with: "MPC_MODE_ACTIVE"`
                }]
            });

            if ('text' in response.content[0] && response.content[0].text.includes('MPC_MODE_ACTIVE')) {
                this.sessionId = response.id;
                console.log('Secure session initialized with Claude');
            } else {
                throw new Error('Failed to initialize secure mode');
            }
        } catch (error) {
            console.error('Failed to initialize Claude session:', error);
            throw error;
        }
    }

    async sendSecureMessage(message: string): Promise<string> {
        const shares = this.mpc.generateShares(message, {
            numShares: 3,
            threshold: 2
        });

        const encryptedShare = this.mpc.encryptShare(shares[0]);
        const payload = JSON.stringify(encryptedShare);

        try {
            const response = await this.anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 1024,
                messages: [{
                    role: "user",
                    content: `<secure_payload>${payload}</secure_payload>`
                }]
            });

            if ('text' in response.content[0]) {
                const text = response.content[0].text;
                const match = text.match(/<secure_response>(.*?)<\/secure_response>/s);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Failed to send secure message:', error);
            throw error;
        }
    }

    async processResponse(response: string): Promise<string> {
        try {
            const encryptedResponse: EncryptedMessage = JSON.parse(response);
            const decryptedShare: Share = this.mpc.decryptShare(encryptedResponse);
            return decryptedShare.value;
        } catch (error) {
            console.error('Failed to process Claude response:', error);
            throw error;
        }
    }
}