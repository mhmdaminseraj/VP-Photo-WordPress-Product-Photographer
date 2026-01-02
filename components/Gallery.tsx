
import React from 'react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-20 h-20 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <p className="text-xl font-medium">No images yet</p>
        <p className="text-sm">Head over to the Studio to create your first shot.</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Project Gallery</h2>
        <p className="text-slate-500 mt-2">All your AI generated product shots for this session.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                   onClick={() => {
                    const link = document.createElement('a');
                    link.href = img.url;
                    link.download = `vp-photo-${img.id}.png`;
                    link.click();
                  }}
                  className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-800 line-clamp-1">{img.prompt}</h3>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{img.size}</span>
                <span className="text-xs text-slate-400">{new Date(img.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
