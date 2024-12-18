import { MakeClient } from './MakeClient';
import { ErrorHandler } from './ErrorHandler';

export interface BatchOperation {
    type: 'create' | 'update' | 'delete' | 'start' | 'stop';
    scenarioId?: string;
    data?: any;
}

export class BatchManager {
    private client: MakeClient;
    private errorHandler: ErrorHandler;

    constructor(client: MakeClient) {
        this.client = client;
        this.errorHandler = new ErrorHandler();
    }

    async executeBatch(operations: BatchOperation[]) {
        const results = [];
        const errors = [];

        for (const operation of operations) {
            try {
                const result = await this.executeOperation(operation);
                results.push({
                    operation,
                    status: 'success',
                    result
                });
            } catch (error) {
                errors.push({
                    operation,
                    status: 'error',
                    error: error.message
                });
            }
        }

        return {
            results,
            errors,
            success: errors.length === 0
        };
    }

    private async executeOperation(operation: BatchOperation) {
        switch (operation.type) {
            case 'create':
                return await this.errorHandler.withRetry(() =>
                    this.client.createScenario(operation.data)
                );

            case 'update':
                if (!operation.scenarioId) throw new Error('Scenario ID required for update');
                return await this.errorHandler.withRetry(() =>
                    this.client.updateScenario(operation.scenarioId!, operation.data)
                );

            case 'delete':
                if (!operation.scenarioId) throw new Error('Scenario ID required for delete');
                return await this.errorHandler.withRetry(() =>
                    this.client.deleteScenario(operation.scenarioId!)
                );

            case 'start':
                if (!operation.scenarioId) throw new Error('Scenario ID required for start');
                return await this.errorHandler.withRetry(() =>
                    this.client.startScenario(operation.scenarioId!)
                );

            case 'stop':
                if (!operation.scenarioId) throw new Error('Scenario ID required for stop');
                return await this.errorHandler.withRetry(() =>
                    this.client.stopScenario(operation.scenarioId!)
                );

            default:
                throw new Error(`Unknown operation type: ${operation.type}`);
        }
    }

    async validateBatch(operations: BatchOperation[]) {
        const validationResults = [];

        for (const operation of operations) {
            try {
                await this.validateOperation(operation);
                validationResults.push({
                    operation,
                    valid: true
                });
            } catch (error) {
                validationResults.push({
                    operation,
                    valid: false,
                    error: error.message
                });
            }
        }

        return validationResults;
    }

    private async validateOperation(operation: BatchOperation) {
        switch (operation.type) {
            case 'create':
                if (!operation.data) {
                    throw new Error('Data required for create operation');
                }
                break;

            case 'update':
            case 'delete':
            case 'start':
            case 'stop':
                if (!operation.scenarioId) {
                    throw new Error(`Scenario ID required for ${operation.type} operation`);
                }
                break;

            default:
                throw new Error(`Unknown operation type: ${operation.type}`);
        }
    }
}
