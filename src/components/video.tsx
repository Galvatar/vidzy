import React, { useState, useRef } from 'react';
import type { FileWithPreview } from '../lib/types';

interface VideoProps {
  src: FileWithPreview;
  className?: string;
}

export function Video({ src, className = '' }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(Number(e.target.value));
  };

  const displayTime = () => {
    if (src.duration == null) return "-:-"
    let duration = Math.round(src.duration);
    let mins = Math.floor(duration/60);
    let sec = duration%60;
    return `${mins}:${sec}`
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className={`group relative flex flex-col w-32 h-18 overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        src={src.preview}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="block aspect-auto h-full"
      />
      <div className="flex absolute top-0 left-0 w-full h-full items-center justify-center pointer-events-none">
        <button
            type="button"
            onClick={togglePlay}
            className="pointer-events-auto aspect-square bg-transparent cursor-pointer border-none text-xs font-medium text-brand-white hover:text-gray-300"
        >
            {isPlaying ? 
                <svg className='group-hover:opacity-100 opacity-0 transition-opacity duration-500 group-hover:duration-0' xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="currentColor"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/>
                </svg>
            : 
                <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="currentColor"><path d="M320-200v-560l440 280-440 280Z"/>
                </svg>
            }
        </button>
      </div>
      <span className={`absolute top-1 left-2 text-xs ${isPlaying ? 'opacity-0 transition-opacity duration-500 group-hover:duration-0 group-hover:opacity-100' : 'opacity-100'}`}>
        {displayTime()}
      </span>

      {/* Custom Control Bar */}
      <div className="absolute bottom-0 flex items-center bg-transparent p-2 group-hover:opacity-100 opacity-0 transition-opacity duration-500 group-hover:duration-0">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="h-1 w-full flex-1 cursor-pointer accent-brand-base rounded-full"
        />
      </div>
    </div>
  );
}