import { MakeClient } from '../src/make/MakeClient';
import dotenv from 'dotenv';

dotenv.config();

async function createBasicScenario() {
    const client = new MakeClient(process.env.MAKE_API_KEY);
    
    try {
        await client.initialize();
        
        // Create a basic scenario
        const scenario = await client.createScenario({
            name: 'Basic Automation Example',
            description: 'A simple example scenario'
        });
        
        console.log('Created scenario:', scenario);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

createBasicScenario().catch(console.error);