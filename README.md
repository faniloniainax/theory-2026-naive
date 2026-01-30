# ENI Theory 2026 Frontend
This is the frontend for the ENI Theory 2026 project. It is implemented using the following technologies:
- Vue 3 (as the base framework)
- Vite (as the build tool)
- Naive UI (as the UI library)
- PNPM (as the package manager)

## Setting up the project
### Prerequisites
- Node.js (version 20.11.0 or higher)
- PNPM (version 9.16.1 or higher)

#### Installing Node.js
NodeJS, the runtime environment for JavaScript, has installation instructions [on their official website](https://nodejs.org/en/download/current).

#### Installing PNPM
PNPM, the package manager for JavaScript, has installation instructions [on their official website](https://pnpm.io/installation).

#### Installing dependencies
As previously stated, since the project uses PNPM as the package manager, installing the dependencies is as simple as running the following command:

```sh
pnpm install
```

### Configuring environment variables
To configure the environment variables, copy the `.env.example` file to `.env` and fill in the values. As of now, only the `VITE_API_URL` is used.

## Running the project
### Serving with hot-reload for development
To serve the project and enable hot-reloading during development, run the following command (port 4724 is used here as a placeholder):

```sh
pnpm dev --port=4724
```

### Building for production
To build the project for production, run the following command:

```sh
pnpm build
```

Built artifacts are placed in the `dist` directory, and can be served using any static file server.
