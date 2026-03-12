import { getVideoTitle, getYouTubeTranscript } from './transcript-service';
import injectSidebar from './components/injectSidebar';
import './globals.css';

console.log("!!! SCRIPT LOADED SUCCESSFULLY !!!");
alert("Extension is active on this page!"); // debugging content.ts


function isYouTubeVideoPage(): boolean {
  return window.location.hostname === "www.youtube.com" && window.location.search.includes("v=");
}

function getVideoIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const urlParams = new URLSearchParams(urlObj.search);
    return urlParams.get('v');
  } catch (e) {
    return null;
  }
}

/**
 * Filled in your waitForElement logic.
 * Note: I added a '#' to the selector check so you can pass 'related' 
 * and it will look for the ID.
 */
async function waitForElement(elementId: string, timeoutMS = 5000): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const selector = `#${elementId}`;
    const element = document.querySelector(selector);
    
    if (element) {
      return resolve(element as HTMLElement);
    }

    const observer = new MutationObserver(() => {
      const targetElement = document.querySelector(selector);
      if (targetElement) {
        resolve(targetElement as HTMLElement);
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMS);
  });
}

let previousVideoId: string | null = null;
async function handleVideoChanges() {
  try {
    if (!isYouTubeVideoPage()) return;

    const videoId = getVideoIdFromUrl(window.location.href);
    if (!videoId || videoId === previousVideoId) return;
    
    previousVideoId = videoId;

    // 1. Fetching logic - getYouTubeTranscript handles the XML fetch internally now
    const [transcriptJSON, videoTitle] = await Promise.all([
      getYouTubeTranscript(videoId), 
      getVideoTitle(videoId),
    ]);

    // 2. transcriptJSON is already a string (the result of JSON.stringify)
    if (transcriptJSON && videoTitle) {
      const element = await waitForElement('related');
      
      if (element) {
        console.log('Injecting sidebar...');
        // Pass the transcriptJSON directly to the sidebar
        injectSidebar(videoTitle, transcriptJSON, videoId, element);
      }
    }
  } catch (error) {
    console.log('Error in Youtube summarizer:', error);
  }
}

async function fetchAndParseTranscript(url) {
  const response = await fetch(url);
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const textNodes = xmlDoc.getElementsByTagName("text");

  return Array.from(textNodes)
    .map(node => node.textContent)
    .join(" ")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function observeForVideoChanges() {
  // Use document.documentElement to ensure we catch changes as early as possible
  const targetNode = document.documentElement;
  const config = { childList: true, subtree: true };

  // We wrap the call so we don't trigger hundreds of times per second
  let timeout: number;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = window.setTimeout(handleVideoChanges, 500); 
  });

  observer.observe(targetNode, config);
}

// Initial call for the first page load
handleVideoChanges();
observeForVideoChanges();

