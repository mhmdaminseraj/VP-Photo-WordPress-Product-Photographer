
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col p-6 sticky top-0 md:h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">VP</div>
          <h1 className="text-xl font-bold tracking-tight">VP-Photo</h1>
        </div>
        
        <div className="flex flex-col gap-2 flex-grow">
          <button
            onClick={() => setActiveView(AppView.PHOTOGRAPHER)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === AppView.PHOTOGRAPHER ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Studio
          </button>
          
          <button
            onClick={() => setActiveView(AppView.CHAT)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === AppView.CHAT ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Expert Chat
          </button>

          <button
            onClick={() => setActiveView(AppView.GALLERY)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === AppView.GALLERY ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Gallery
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 text-slate-500 text-xs">
          <p>Powered by Gemini 3 Pro</p>
          <p className="mt-1">Pro Image Photographer</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
