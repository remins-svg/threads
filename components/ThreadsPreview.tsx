
import React from 'react';
import { Share2, MessageCircle, Heart, Repeat } from 'lucide-react';

interface ThreadsPreviewProps {
  content: string;
  personaName: string;
  personaEmoji: string;
}

const ThreadsPreview: React.FC<ThreadsPreviewProps> = ({ content, personaName, personaEmoji }) => {
  return (
    <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-4 font-sans text-[15px]">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl overflow-hidden">
            {personaEmoji}
          </div>
          <div className="w-[2px] flex-grow bg-gray-100 my-1 rounded-full"></div>
        </div>
        
        <div className="flex-1 pb-2">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-bold hover:underline cursor-pointer">{personaName.replace(/\s/g, '_').toLowerCase()}</span>
            <span className="text-gray-400 text-sm">지금</span>
          </div>
          
          <div className="whitespace-pre-wrap leading-relaxed text-[#1a1a1a] mb-4">
            {content}
          </div>
          
          <div className="flex gap-4 text-gray-400">
            <button className="hover:text-red-500 transition-colors"><Heart size={20} /></button>
            <button className="hover:text-blue-500 transition-colors"><MessageCircle size={20} /></button>
            <button className="hover:text-green-500 transition-colors"><Repeat size={20} /></button>
            <button className="hover:text-gray-600 transition-colors"><Share2 size={20} /></button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-2 ml-1">
         <div className="flex -space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-white bg-gray-200"></div>
            <div className="w-4 h-4 rounded-full border-2 border-white bg-gray-300"></div>
         </div>
         <span className="text-gray-400 text-sm">답글 2개 · 좋아요 14개</span>
      </div>
    </div>
  );
};

export default ThreadsPreview;
