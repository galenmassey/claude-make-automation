import { ClaudeClient } from '../src/claude/ClaudeClient';
import dotenv from 'dotenv';

dotenv.config();

async function testSecureCommunication() {
    const claude = new ClaudeClient(process.env.CLAUDE_API_KEY);
    
    try {
        // Initialize secure session
        await claude.initializeSession();
        
        // Send a secure message
        const response = await claude.sendSecureMessage('Test secure message');
        console.log('Encrypted response:', response);
        
        // Decrypt the response
        const decrypted = await claude.processResponse(response);
        console.log('Decrypted response:', decrypted);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testSecureCommunication().catch(console.error);