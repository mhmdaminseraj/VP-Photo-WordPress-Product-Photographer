
import React from 'react';

interface ApiKeyWallProps {
  onSuccess: () => void;
}

const ApiKeyWall: React.FC<ApiKeyWallProps> = ({ onSuccess }) => {
  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // As per instructions, assume success after triggering
      onSuccess();
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Pro Access Required</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          To generate high-quality 2K/4K product images, you must select an API key from a paid Google Cloud project.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
        >
          Select Pro API Key
        </button>
        <div className="mt-6 text-sm text-slate-500">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Learn about Billing & Keys
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWall;
