import React, { useState } from 'react';
import '../style.css';
import {getLLMSummary} from '../open-ai';


interface SidebarProps {
  title: string;
  transcript: string;
  videoId: string;
}

const SidebarUI: React.FC<SidebarProps> = ({ title, transcript, videoId }) => {
  const [summary, setSummary] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

const [isProcessing, setIsProcessing] = useState(false);

const handleSummarize = async () => {
    if (loading || isProcessing) return; 

    setLoading(true);
    setIsProcessing(true);
    setErrorMessage("");
    
    try {
        // 1. PARSE the transcript (since getYouTubeTranscript returns a JSON string)
        const transcriptData = JSON.parse(transcript); 
        
        // 2. EXTRACT just the text content and join it
        // This removes the "start" and "duration" noise for the AI
        const cleanText = transcriptData
            .map((item: any) => item.text)
            .join(" ")
            .replace(/\s+/g, " ") // Clean up extra spaces
            .slice(0, 20000);    // Safety cap for token limits

        // 3. SEND the cleaned text to the AI
        const result = await getLLMSummary(title, cleanText);
        
        if (result.success) {
            setSummary(result.data);
        } else {
            // Error handling logic
            if (result.error.includes("limit: 0")) {
                setErrorMessage("Please link a billing account or switch to 'gemini-2.5-flash-lite'.");
            } else {
                setErrorMessage(result.error);
            }
        }
    } catch (err) {
        console.error("Summary error:", err);
        setErrorMessage("Failed to process transcript. Make sure it's valid JSON.");
    } finally {
        setLoading(false);
        setIsProcessing(false);
    }
};
  return (
    <div className="custom-sidebar-card">
      <div className="sidebar-header">
        <h3>AI Video Insights</h3>
      </div>
      <div className="sidebar-body">
        <h4 className="video-title-preview">{title}</h4>
        <button 
          className="summarize-btn" 
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Summarize Video'}
        </button>

          {errorMessage && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded">
          <strong>Error:</strong> {errorMessage}
        </div>
        )}
        
         {summary && (
            <div className="summary-content">
              {/* If summary contains **0:00**, this will make it look clean */}
              {summary.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: '12px' }}>
                  {line}
                </p>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default SidebarUI;
