import { useState } from "react";
import type { FileWithPreview, TimelineClip } from "../lib/types";

interface TimelineProps {
  files: FileWithPreview[];
  currentTime: number;
  totalDuration: number; // e.g., 60 seconds
  onSeek: (time: number) => void;
}

export function Timeline({ files, currentTime, totalDuration, onSeek }: TimelineProps) {
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const pxPerSec = 20;

  function handleDrop(fileData: FileWithPreview) {
    const sourceFile = files.find((f) => f.preview === fileData.preview);
    if (!sourceFile) {
      return;
    }
    console.log(sourceFile)
    const newClip: TimelineClip = {
      id: crypto.randomUUID(),
      name: sourceFile.name,
      mediaType: sourceFile.type.startsWith('video/') ? "video" : "image",
      startTime: 0,
      duration: sourceFile.type.startsWith('video/') ? sourceFile.duration : 0,
      trackId: 0
    }
    setClips([...clips, newClip])
  }

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const fileData = JSON.parse(e.dataTransfer.getData("application/json")) as FileWithPreview;
        handleDrop(fileData)
      }}
      className="w-full bg-brand-white border-t border-brand-dark p-4 flex flex-col gap-2">
      {/* Time Ruler / Playhead Header */}
      <div 
        className="relative h-6 w-full bg-brand-dark/40 rounded cursor-pointer overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          onSeek(clickX / pxPerSec);
        }}
      >
        {/* Playhead Marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-brand-light z-30 pointer-events-none"
          style={{ left: `${currentTime * pxPerSec}px` }}
        >
          <div className="w-3 h-3 bg-brand-light -translate-x-1/2 rotate-45 rounded-sm" />
        </div>
      </div>

      {/* Track Container */}
      <div className="relative h-24 w-full bg-brand-dark/20 border border-brand-base/30 rounded-lg overflow-x-auto">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="absolute top-2 h-20 bg-brand-base rounded-md border border-brand-light p-2 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing text-brand-white select-none"
            style={{
              left: `${clip.startTime * pxPerSec}px`,
              width: `${clip.duration * pxPerSec}px`,
            }}
          >
            <span className="text-xs font-bold truncate">{clip.name}</span>
            <span className="text-[10px] opacity-75">{clip.duration.toFixed(1)}s</span>
          </div>
        ))}
      </div>
    </div>
  );
}