# Setup Guide

## Prerequisites

1. Node.js v14 or higher
2. Make.com account with API access
3. Claude API key

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

3. Configure environment:
- Copy `.env.example` to `.env`
- Add your Make.com API key
- Add your Claude API key

## Make.com API Setup

1. Log into Make.com
2. Go to Profile Settings > API Tokens
3. Generate a new token with these permissions:
   - scenarios:read
   - scenarios:write
   - scenarios:run
   - connections:read
   - connections:write

## Testing

Run the test suite:
```bash
npm test
```

## Troubleshooting

### Common Issues

1. Authentication Errors
   - Verify API keys are correct
   - Check token permissions

2. Connection Issues
   - Verify network connectivity
   - Check Make.com API status

3. MPC Issues
   - Ensure proper initialization
   - Check share generation