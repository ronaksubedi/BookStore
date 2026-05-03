# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Production Configuration Notes

Set these environment variables in your hosting provider:

- `VITE_API_BASE_URL` (supports values with or without `/api`)
- `VITE_API_KEY`
- `VITE_AUTH_DOMAIN` (preferred key)
- `VITE_PROJECT_ID`
- `VITE_STORAGE_BUCKET`
- `VITE_MESSAGING_SENDERID`
- `VITE_APPID`
- `VITE_MEASUREMENT_ID`

Firebase Google authentication additionally requires the deployed frontend domain in:

Firebase Console -> Authentication -> Settings -> Authorized domains

For example, if your app is deployed at `bookstore.ronaksubedi.com.np`, add:

- `bookstore.ronaksubedi.com.np`

## Environment Setup

- Copy `.env.example` to `.env.local` for local development.
- Set `VITE_API_BASE_URL` to your backend API origin:
  - local: `http://localhost:5000/api`
  - production: `https://your-backend-domain/api`
