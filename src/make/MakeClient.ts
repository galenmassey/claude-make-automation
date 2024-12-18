import axios from 'axios';

export class MakeClient {
    private apiKey: string;
    private baseUrl: string = 'https://us1.make.com/api/v2';
    private teamId: string | null = null;
    private organizationId: string = '1785063';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.apiKey}`
        };
    }

    async initialize() {
        try {
            const teamsResponse = await axios.get(
                `${this.baseUrl}/teams`, 
                {
                    headers: this.getHeaders(),
                    params: {
                        organizationId: this.organizationId
                    }
                }
            );
            
            if (teamsResponse.data && teamsResponse.data.teams && teamsResponse.data.teams.length > 0) {
                this.teamId = teamsResponse.data.teams[0].id;
                console.log('Selected Team ID:', this.teamId);
                return true;
            } else {
                throw new Error('No teams found in organization');
            }
        } catch (error) {
            console.error('Initialization error:', error.response?.data || error);
            throw error;
        }
    }

    async listScenarios() {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.get(
                `${this.baseUrl}/scenarios`,
                {
                    headers: this.getHeaders(),
                    params: {
                        teamId: this.teamId
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error listing scenarios:', error.response?.data || error);
            throw error;
        }
    }
}