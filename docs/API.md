# API Documentation

## MakeClient

### Initialization
```typescript
const client = new MakeClient(apiKey);
await client.initialize();
```

### Methods

#### listScenarios()
List all scenarios in your team.

#### createScenario(config)
Create a new scenario.

## ClaudeClient

### Initialization
```typescript
const claude = new ClaudeClient(apiKey);
await claude.initializeSession();
```

### Methods

#### sendSecureMessage(message)
Send an encrypted message to Claude.

#### processResponse(response)
Decrypt and process Claude's response.

## Security

### MPCProtocol

#### generateShares(secret, config)
Generate MPC shares for secure data splitting.

#### encryptShare(share)
Encrypt an individual share.

#### decryptShare(encrypted)
Decrypt an encrypted share.