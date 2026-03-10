import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import './globals.css';


const Popup = () => {
  return (
    <div className="container">
      <h1>AI Assistant</h1>
      <p>TypeScript + React is ready.</p>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);