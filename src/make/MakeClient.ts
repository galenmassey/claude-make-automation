import axios from 'axios';
import { ScenarioConfig, Module, Connection } from './types';

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

    // List all scenarios
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

    // Create a new scenario
    async createScenario(config: ScenarioConfig) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.post(
                `${this.baseUrl}/scenarios`,
                {
                    ...config,
                    teamId: this.teamId
                },
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating scenario:', error.response?.data || error);
            throw error;
        }
    }

    // Update an existing scenario
    async updateScenario(scenarioId: string, updates: Partial<ScenarioConfig>) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.patch(
                `${this.baseUrl}/scenarios/${scenarioId}`,
                updates,
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating scenario:', error.response?.data || error);
            throw error;
        }
    }

    // Add a module to a scenario
    async addModule(scenarioId: string, module: Module) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.post(
                `${this.baseUrl}/scenarios/${scenarioId}/modules`,
                module,
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding module:', error.response?.data || error);
            throw error;
        }
    }

    // Connect modules in a scenario
    async connectModules(scenarioId: string, sourceModuleId: string, targetModuleId: string) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const connection = {
                sourceModuleId,
                targetModuleId
            };

            const response = await axios.post(
                `${this.baseUrl}/scenarios/${scenarioId}/connections`,
                connection,
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error connecting modules:', error.response?.data || error);
            throw error;
        }
    }

    // Start a scenario
    async startScenario(scenarioId: string) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.post(
                `${this.baseUrl}/scenarios/${scenarioId}/start`,
                {},
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error starting scenario:', error.response?.data || error);
            throw error;
        }
    }

    // Stop a scenario
    async stopScenario(scenarioId: string) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.post(
                `${this.baseUrl}/scenarios/${scenarioId}/stop`,
                {},
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error stopping scenario:', error.response?.data || error);
            throw error;
        }
    }

    // Delete a scenario
    async deleteScenario(scenarioId: string) {
        if (!this.teamId) {
            throw new Error('Must call initialize() first');
        }

        try {
            const response = await axios.delete(
                `${this.baseUrl}/scenarios/${scenarioId}`,
                {
                    headers: this.getHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting scenario:', error.response?.data || error);
            throw error;
        }
    }
}