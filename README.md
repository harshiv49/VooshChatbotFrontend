# VooshChatbotFrontend
## Features

-   **Real-time Chat Interface**: Messages appear instantly as they are streamed from the backend.
-   **Streaming Responses**: The chatbot's response is displayed token-by-token, simulating a "typing" effect.
-   **Session Management**: Automatically handles session creation and provides a button to reset the conversation.
-   **Markdown Rendering**: Correctly renders formatted text like lists, code blocks, and links from the bot.
-   **Responsive Design**: Usable across a range of screen sizes.

---

## Tech Stack

-   **Framework**: React (using Vite)
-   **Language**: TypeScript
-   **Styling**: SCSS
-   **State Management**: React Hooks (`useState`, `useEffect`)

-- 

## Install dependencies:
- Bash
- pnpm install

## Set up environment variables:
- Create a .env.local file in the root directory. You must provide the URL where your backend server is running.

## Example for local development
- VITE_API_BASE_URL=http://localhost:8000/api
- Run the development server:
- pnpm run dev

The application will be available at http://localhost:5173 (or another port if 5173 is busy).

## Deployment
This application is configured for easy deployment on static hosting platforms like Netlify or Vercel.

Connect your Git repository to the platform.

Set the build command to pnpm run build.

Set the publish directory to dist.

Add the VITE_API_BASE_URL environment variable in the platform's settings, pointing to your deployed backend URL.
