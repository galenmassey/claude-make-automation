# Claude Make.com Automation

A secure, Claude-powered system for automating Make.com scenario creation and management. This project implements a Multi-Party Computation (MPC) router between Claude and Make.com for secure scenario automation.

## Features

- 🔒 Secure MPC communication between Claude and Make.com
- 🤖 Automated scenario creation and management
- 🔄 Integration with Claude API for intelligent automation
- 📝 Template-based scenario generation
- 🛠️ Configurable scheduling and execution options

## Prerequisites

- Node.js (v14 or higher)
- Make.com account with API access
- Claude API key
- TypeScript understanding (for development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/galenmassey/claude-make-automation.git
cd claude-make-automation
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

## Configuration

Create a `.env` file with the following:

```env
MAKE_API_KEY=your_make_api_key
CLAUDE_API_KEY=your_claude_api_key
```

## Usage

1. Initialize the client:
```typescript
import { MakeClient } from './src/make/MakeClient';

const client = new MakeClient(process.env.MAKE_API_KEY);
await client.initialize();
```

2. Create a scenario:
```typescript
const scenario = await client.createScenario({
    name: 'My Automated Scenario',
    description: 'Created via Claude automation'
});
```

## Project Structure

```
claude-make-automation/
├── src/
│   ├── make/           # Make.com integration
│   ├── claude/         # Claude integration
│   ├── security/       # MPC implementation
│   └── types/          # TypeScript types
├── examples/           # Example scenarios
├── docs/              # Documentation
├── tests/             # Test files
└── config/            # Configuration templates
```

## Security

This project implements Multi-Party Computation (MPC) to ensure secure communication between Claude and Make.com. All sensitive data is encrypted and split into shares before transmission.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.