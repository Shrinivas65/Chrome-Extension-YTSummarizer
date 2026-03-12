

---

# 📺 Chrome-Extension-YTSummarizer

A professional Chrome Extension built with **React**, **TypeScript**, and **Webpack** that integrates a custom sidebar into the YouTube interface to provide real-time AI video summaries using **Google Gemini 2.0 Flash-Lite**.

---

## 📂 Project Structure

* **`src/content.ts`** The core logic that monitors YouTube's DOM, detects video changes, and handles the injection of the React sidebar.
* **`src/transcript-service.ts`** A dedicated service for scraping YouTube HTML metadata and parsing XML timed-text into clean, usable strings.
* **`src/components/Sidebar.tsx`** The frontend UI component built with React, featuring a modern dark-mode "Glassmorphism" design.
* **`src/open-ai.ts`** The API bridge that handles secure communication with the Gemini 2.0 Flash-Lite model.

---

## 🏗 Installation & Setup

### 1. Prerequisites

Ensure you have **Node.js** installed (v18.0.0 or higher recommended).

### 2. Environment Variables

Create a `.env` file in the root directory. This key is used by Webpack during the build process:

```env
GEMINI_API_KEY=your_actual_api_key_here

```

### 3. Compile the Project

Since Chrome cannot execute TypeScript (`.ts` / `.tsx`) directly, you must bundle the project into a standard JavaScript distribution:

```bash
# Install project dependencies
npm install

# Compile and bundle the extension
npm run build

```

*This will generate a **`dist`** folder in your project root containing the compiled `content.js`, `manifest.json`, and required assets.*

---

## 🧩 Loading into Chrome

Follow these steps to load the compiled extension into your browser:

1. Open Chrome and navigate to **`chrome://extensions/`**.
2. Enable **Developer mode** via the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Navigate to your project folder and select the **`dist`** directory.
5. Open any YouTube video; the **AI Video Insights** card will automatically appear in the right-hand sidebar.

---

## 📝 How it Works

1. **Detection:** The extension uses a Mutation Observer and URL listener to detect when you've landed on a new video page.
2. **Scraping:** It fetches the video's internal HTML in the background to locate the `playerCaptionsTracklistRenderer`.
3. **Parsing:** The service requests the raw XML from YouTube's `timedtext` API and strips the timestamps to create a clean text block.
4. **AI Summary:** The processed text is sent to the Gemini API with a specialized prompt to generate structured insights and key takeaways.

---

## 🛠 Troubleshooting

* **Build Issues:** If the `dist` folder doesn't update, try deleting it and running `npm run build` again.
* **API Errors:** Check the console for `429` (Rate Limit) errors. Ensure your API key is valid in AI Studio.
* **UI Not Showing:** YouTube frequently updates its element IDs. Ensure the selector `#secondary #related` is still valid in the current YouTube layout.

