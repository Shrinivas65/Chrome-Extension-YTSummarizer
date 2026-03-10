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
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
   
    const result = await getLLMSummary(title , transcript);
    setSummary(result);
    setLoading(false);
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