
import React, { useState } from 'react';
import { generateProductImage } from '../services/geminiService';
import { ImageSize, GeneratedImage, ImageModel } from '../types';

interface StudioProps {
  onImageGenerated: (img: GeneratedImage) => void;
  resetApiKey: () => void;
}

const Studio: React.FC<StudioProps> = ({ onImageGenerated, resetApiKey }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Theme');
  const [style, setStyle] = useState('Modern Minimalist');
  const [size, setSize] = useState<ImageSize>('1K');
  const [model, setModel] = useState<ImageModel>('gemini-2.5-flash-image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastImage, setLastImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateProductImage(title, category, style, size, model);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: `WordPress ${category}: ${title} (${style})`,
        timestamp: Date.now(),
        size,
        model
      };
      setLastImage(imageUrl);
      onImageGenerated(newImage);
    } catch (err: any) {
      if (err.message === 'API_KEY_RESET_REQUIRED') {
        resetApiKey();
      } else {
        setError(err.message || "Failed to generate image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Virtual Photographer Studio</h2>
        <p className="text-slate-500 mt-2">Generate pixel-perfect hero images using either Gemini 2.5 or Gemini 3.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">AI Engine</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModel('gemini-2.5-flash-image')}
                  className={`px-3 py-2 rounded-lg text-xs transition-all border ${
                    model === 'gemini-2.5-flash-image'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                  }`}
                >
                  Gemini 2.5 Flash
                </button>
                <button
                  type="button"
                  onClick={() => setModel('gemini-3-pro-image-preview')}
                  className={`px-3 py-2 rounded-lg text-xs transition-all border ${
                    model === 'gemini-3-pro-image-preview'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                  }`}
                >
                  Gemini 3 Pro
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ZenOne - Minimal Portfolio Theme"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option>Theme</option>
                  <option>Plugin</option>
                  <option>Template Kit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Resolution</label>
                <select
                  disabled={model === 'gemini-2.5-flash-image'}
                  value={size}
                  onChange={(e) => setSize(e.target.value as ImageSize)}
                  className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    model === 'gemini-2.5-flash-image' ? 'bg-slate-50 cursor-not-allowed opacity-60' : ''
                  }`}
                >
                  <option value="1K">1K HD</option>
                  <option value="2K">2K Ultra</option>
                  <option value="4K">4K Pro</option>
                </select>
                {model === 'gemini-2.5-flash-image' && <p className="text-[10px] text-slate-400 mt-1">Size locked in Flash model</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Visual Style</label>
              <div className="grid grid-cols-2 gap-2">
                {['Modern Minimalist', 'Dark Mode Pro', 'Creative Brutalist', 'Corporate Clean'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                      style === s 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                      : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Capturing Shot...
                </>
              ) : (
                `Generate with ${model.includes('2.5') ? '2.5 Flash' : '3 Pro'}`
              )}
            </button>
            
            {error && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {error}</p>}
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex flex-col items-center justify-center relative">
            {loading ? (
              <div className="text-center p-10 space-y-4">
                <div className="flex justify-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-slate-500 font-medium italic">Adjusting lighting & staging...</p>
              </div>
            ) : lastImage ? (
              <div className="w-full h-full flex flex-col">
                <img src={lastImage} alt="Generated Preview" className="w-full h-auto object-cover" />
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    {model.includes('2.5') ? '2.5 Flash Std' : `${size} Pro Resolution`}
                  </span>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = lastImage;
                      link.download = `vp-photo-${Date.now()}.png`;
                      link.click();
                    }}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    Download Original
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-slate-300">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-lg font-medium">Your masterpiece awaits</p>
                <p className="text-sm">Choose an engine and product details to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
