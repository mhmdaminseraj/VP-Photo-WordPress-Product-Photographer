
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Studio from './components/Studio';
import ChatBot from './components/ChatBot';
import Gallery from './components/Gallery';
import ApiKeyWall from './components/ApiKeyWall';
import { AppView, GeneratedImage } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.PHOTOGRAPHER);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
      } catch (e) {
        console.error("Error checking API key", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleImageGenerated = (img: GeneratedImage) => {
    setImages(prev => [img, ...prev]);
  };

  const handleResetKey = () => {
    setIsKeySelected(false);
  };

  if (checkingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isKeySelected) {
    return <ApiKeyWall onSuccess={() => setIsKeySelected(true)} />;
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {activeView === AppView.PHOTOGRAPHER && (
        <Studio onImageGenerated={handleImageGenerated} resetApiKey={handleResetKey} />
      )}
      {activeView === AppView.CHAT && (
        <ChatBot />
      )}
      {activeView === AppView.GALLERY && (
        <Gallery images={images} />
      )}
    </Layout>
  );
};

export default App;
