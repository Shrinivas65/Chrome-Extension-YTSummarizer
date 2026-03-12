# Chrome-Extension-YTSummarizer
Chrome extension that inserts side bar as UI for summarizing you-tube video . Build using typescript , node , express and GPT.

A professional Chrome Extension built with React, TypeScript, and Webpack that uses Google Gemini to summarize YouTube videos in real-time.

🛠 Project Structure
src/content.ts: The "brains" that interact with the YouTube DOM and inject the sidebar.

src/transcript-service.ts: Handles fetching and parsing YouTube's XML transcripts.

src/components/Sidebar.tsx: The React-based UI for the AI interaction.

src/open-ai.ts: Handles the communication with the Gemini 2.0 Flash-Lite API.

🏗 Installation & Setup
1. Prerequisites
Ensure you have Node.js installed (v18 or higher recommended).

2. Environment Variables
Create a .env file in the root directory (this is where Webpack will look for your key):

Code snippet
GEMINI_API_KEY=your_actual_api_key_here
3. Compile the Project
Chrome cannot run .ts or .tsx files directly. You must compile the project into a standard JavaScript bundle.

Bash
# Install dependencies
npm install

# Build the project
npm run build
This will create a dist folder in your project root containing the compiled content.js, manifest.json, and assets.

🧩 Loading into Chrome
Once the build is finished, follow these steps to use the extension:

Open Chrome and navigate to chrome://extensions/.

Enable Developer mode using the toggle in the top-right corner.

Click the Load unpacked button.

Select the dist folder (not the src or root folder) from your project directory.

Open any YouTube video, and you should see the AI Video Insights card appear in the right-hand sidebar.

📝 How it Works
Detection: The extension monitors the URL. When a video ID is detected, it triggers the scraper.

Scraping: It fetches the video's internal HTML to find available caption tracks (English, Hindi, etc.).

Parsing: It fetches the raw XML from YouTube's timedtext API and converts it into a clean text string.

AI Summary: The text is sent to Gemini with a custom prompt to generate formatted insights.
