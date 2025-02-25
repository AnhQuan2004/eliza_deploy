# Movement Plugin

## Overview
Movement Plugin is a comprehensive blockchain integration module designed to provide seamless interaction with the Sui blockchain ecosystem. It offers a robust set of features for wallet management, decentralized finance (DeFi) operations, and advanced blockchain analytics.

# Table of Contents
- [Movement Plugin](#movement-plugin)
  - [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Project structure](#project-structure)
  - [Response Format](#response-format)
  - [Core Capabilities](#core-capabilities)
    - [Suilend Integration](#suilend-integration)
    - [Get insights from data](#get-insights-from-data)
  - [Architecture](#architecture)

# Project structure
``` 
packages/plugin-movement/
├── .npmignore                 # NPM package ignore rules
├── package.json              # Package configuration and dependencies
├── src/
│   ├── actions/              # Action handlers for different operations
│   │   ├── analyze-sentiment.ts
│   │   ├── enum.ts          # Action type enums
│   │   ├── give-insight-data.ts
│   │   ├── prompts/        # LLM prompts for various operations
│   │   │   └── index.ts
│   │   ├── transfer.ts
│   │   └── utils/          # Action utilities
│   │       └── index.ts
│   ├── providers/           # Service providers
│   │   └── wallet.ts       # Wallet provider implementation
│   ├── services/           # Core services
│   │   └── tusky.ts       # call tusky api
│   ├── tests/             # Test files
│   │   └── wallet.test.ts
│   ├── environment.ts      # Environment configuration
│   ├── index.ts           # Main plugin entry point
│   └── utils.ts           # General utilities
```

## Response Format
```json
{
    "text": "",
    "action": "",
    "params: ""
}
```

## Architecture
![image](./image/architecture.png)
