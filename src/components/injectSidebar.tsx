import React from 'react';
import { createRoot } from 'react-dom/client';
import SidebarUI from './Sidebar'; 
import '../style.css';

function injectSidebar(title: string, transcript: string, videoId: string, element: HTMLElement) {
    console.log("react slide bar injection")
    console.log(element);
    
    const existingSidebar = document.getElementById('ai-summarizer-root');
    if (existingSidebar) {
        existingSidebar.remove(); 
    }

    const container = document.createElement('div');
    container.id = 'ai-summarizer-root';
    

    element.prepend(container);

   
    const root = createRoot(container);
    root.render(
        <SidebarUI 
            title={title} 
            transcript={transcript} 
            videoId={videoId} 
        />
    );
}

export default injectSidebar;