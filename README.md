# Chilldoc Boilerplate

TypeScript npm library boilerplate with modern development tools and configurations.

## Features

- 📦 TypeScript + ESM support
- 🛠️ Modern bundling with tsup
- ✨ Code formatting with Prettier
- 🔍 Linting with ESLint
- 🧪 Testing with both Jest and Mocha
- 📚 API documentation generation with TypeDoc
- 🔄 Git hooks with Husky
- 📱 Example projects showcasing Express.js integration

## Requirements

- Node.js >= 20.0.0
- pnpm >= 8.0.0

## Project Structure

```
.
├── src/                    # Main source code
├── test/                   # Test files for the main library
├── dist/                   # Compiled output (generated)
├── docs/                   # Generated documentation
└── packages/
    └── examples/          # Example projects
        ├── src/
        │   ├── jest-express/    # Jest + Express.js example
        │   └── mocha-express/   # Mocha + Express.js example
        └── package.json
```

## Setup

```bash
# Install dependencies
pnpm install

# Install example project dependencies
pnpm -F @chilldoc/examples setup

# Build the project
pnpm build

# Run tests
pnpm test                  # Run main library tests
pnpm -F @chilldoc/examples test:jest    # Run Jest example tests
pnpm -F @chilldoc/examples test:mocha   # Run Mocha example tests

# Run example servers
pnpm -F @chilldoc/examples start:jest   # Start Jest example server
pnpm -F @chilldoc/examples start:mocha  # Start Mocha example server
```

## Available Scripts

### Main Project Scripts

- `build`: Compiles TypeScript code using tsup
- `dev`: Watches for changes and rebuilds (development mode)
- `test`: Runs Mocha tests for the main library
- `lint`: Runs ESLint for code quality
- `format`: Formats code with Prettier
- `docs`: Generates API documentation using TypeDoc
- `clean`: Removes the dist directory

### Example Project Scripts

- `test:jest`: Runs Jest tests for the jest-express example
- `test:mocha`: Runs Mocha tests for the mocha-express example
- `start:jest`: Starts the Jest example server
- `start:mocha`: Starts the Mocha example server

## Configuration

### Prettier Configuration

The project uses Prettier for consistent code formatting with the following key settings:

```json
{
    "semi": true, // Semicolons at the end of statements
    "trailingComma": "all", // Trailing commas wherever possible
    "singleQuote": false, // Use double quotes
    "printWidth": 100, // Line length limit
    "tabWidth": 4 // 4 spaces indentation
}
```

### TypeScript Configuration

- Strict type checking enabled
- ESM module system
- Targets modern Node.js environments
- Includes type definitions and source maps

## Examples

The project includes two example implementations:

1. **Jest Express Example** (`packages/examples/src/jest-express/`)

    - Demonstrates integration with Jest testing framework
    - Shows how to test Express.js endpoints
    - Uses supertest for API testing

2. **Mocha Express Example** (`packages/examples/src/mocha-express/`)
    - Shows integration with Mocha testing framework
    - Includes Express.js API testing examples
    - Uses supertest for HTTP assertions

To try the examples:

1. Install dependencies: `pnpm install`
2. Set up examples: `pnpm -F @chilldoc/examples setup`
3. Run tests:
    - Jest: `pnpm -F @chilldoc/examples test:jest`
    - Mocha: `pnpm -F @chilldoc/examples test:mocha`
4. Start servers:
    - Jest: `pnpm -F @chilldoc/examples start:jest`
    - Mocha: `pnpm -F @chilldoc/examples start:mocha`

## VS Code 설정

이 프로젝트는 VS Code에 최적화되어 있습니다. 다음 확장 프로그램을 설치하는 것을 권장합니다:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Nightly (`ms-vscode.vscode-typescript-next`)

VS Code를 열면 자동으로 이러한 확장 프로그램을 설치하도록 제안할 것입니다.

### 자동 포맷팅

- 파일 저장 시 자동으로 Prettier 포맷팅이 적용됩니다.
- ESLint 규칙에 따른 자동 수정도 함께 적용됩니다.
- TypeScript 파일은 프로젝트의 로컬 TypeScript 버전을 사용합니다.

## License

MIT
