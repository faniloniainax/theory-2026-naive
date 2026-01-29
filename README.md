# ENI Theory 2026 Frontend
This is the frontend for the ENI Theory 2026 project. It is implemented using the following technologies:
- Vue 3 (as the base framework)
- Vite (as the build tool)
- Naive UI (as the UI library)
- PNPM (as the package manager)

## Project Setup
### Installing dependencies
As previously stated, since the project uses PNPM as the package manager, installing the dependencies is as simple as running the following command:

```sh
pnpm install
```

### Configuring environment variables
To configure the environment variables, copy the `.env.example` file to `.env` and fill in the values. As of now, only the `VITE_API_URL` is used.

## Running the project
### Serve and hot-reload for development
To serve the project and enable hot-reloading during development, run the following command (port 4723 is used here as a placeholder):

```sh
pnpm dev --port=4723
```

### Build for production
To build the project for production, run the following command:

```sh
pnpm build
```

Built artifacts are placed in the `dist` directory, and can be served using any static file server.
