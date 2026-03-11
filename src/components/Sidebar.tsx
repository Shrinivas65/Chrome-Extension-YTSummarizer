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
    // 1. Prevent "Double Tapping" the button
    if (loading || isProcessing) return; 

    setLoading(true);
    setIsProcessing(true);
    setErrorMessage("");
    
    try {
        const result = await getLLMSummary(title, transcript);
        
        if (result.success) {
            setSummary(result.data);
        } else {
            // 2. Handle the "Wait 32s" error gracefully
            if (result.error.includes("limit: 0")) {
                setErrorMessage("Please link a billing account in AI Studio to use Gemini 2.0, or switch to model 1.5.");
            } else if (result.error.includes("quota")) {
                setErrorMessage("Rate limit hit! Please wait a minute before trying again.");
            } else {
                setErrorMessage(result.error);
            }
        }
    } catch (err) {
        setErrorMessage("An unexpected error occurred.");
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
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarUI;