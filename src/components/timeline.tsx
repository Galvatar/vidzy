import { useRef, useState } from "react";
import type { TimelineClip, FileWithPreview } from "../lib/types";

interface TimelineProps {
  // Existing timeline state & controls
  clips: TimelineClip[];
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  onAddClip: (clip: TimelineClip) => void;

  // Shared dropzone drag-and-drop state
  files: FileWithPreview[];
  draggedAsset: FileWithPreview | null;
}

export function Timeline({
  clips,
  currentTime,
  totalDuration,
  onSeek,
  onAddClip,
  files,
  draggedAsset,
}: TimelineProps) {
  const [dropPreviewTime, setDropPreviewTime] = useState<number | null>(null);
  const pxPerSec = 20;

  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleSeekFromPointer = (clientX: number) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;

    const rawTime = clickX / pxPerSec;
  
    const maxRulerTime = rect.width / pxPerSec;
    const newTime = Math.min(Math.max(0, rawTime), maxRulerTime);
    onSeek(newTime);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Capture pointer events so move/up fire even if mouse leaves the element
    e.currentTarget.setPointerCapture(e.pointerId);
    handleSeekFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Check if primary mouse button or touch pressure is active
    if (e.buttons === 1) {
      handleSeekFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleDragEnter = () => {
    // Cache the bounding box ONCE when the drag enters the container
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedAsset || !rectRef.current) return;

    const mouseX = e.clientX - rectRef.current.left;
    const rawTime = Math.max(0, mouseX / pxPerSec);
    
    // Snap to nearest 0.05 seconds (adjust grid precision as needed)
    const hoverTime = Math.round(rawTime * 20) / 20;

    // React state only updates when hoverTime shifts to a new step
    setDropPreviewTime((prev) => (prev === hoverTime ? prev : hoverTime));
  };

  const handleDragLeave = () => {
    rectRef.current = null;
    setDropPreviewTime(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropPreviewTime === null || !draggedAsset) return;

    const newClip: TimelineClip = {
      id: crypto.randomUUID(),
      name: draggedAsset.name,
      mediaType: draggedAsset.type.startsWith("video/") ? "video" : "image",
      startTime: dropPreviewTime,
      duration: draggedAsset.duration,
      trackId: 0,
    };

    onAddClip(newClip);
    setDropPreviewTime(null);
  };

  return (
    <div className="w-full bg-brand-white border-t border-brand-dark p-4 flex flex-col gap-2">
      {/* Time Ruler & Playhead Header */}
      <div
        ref={rulerRef}
        className="relative h-6 w-full bg-brand-dark rounded overflow-hidden select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Playhead Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-brand-light z-30 pointer-events-none"
          style={{ left: `${currentTime * pxPerSec}px` }}
        >
          <div className="w-3 h-3 bg-brand-light -translate-x-1/2 rotate-45 rounded-sm" />
        </div>
      </div>

      {/* Track Drop Area */}
      <div
        className="relative h-28 w-full bg-brand-dark/20 border border-brand-base/30 rounded-lg overflow-x-auto"
        ref={containerRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Existing Rendered Clips */}
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="absolute top-2 h-20 bg-brand-base rounded-md border border-brand-light p-2 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing text-brand-white select-none z-10"
            style={{
              left: `${clip.startTime * pxPerSec}px`,
              width: `${clip.duration * pxPerSec}px`,
            }}
          >
            <span className="text-xs font-bold truncate">{clip.name}</span>
            <span className="text-[10px] opacity-75">{clip.duration.toFixed(1)}s</span>
          </div>
        ))}

        {/* Dynamic Drag Preview Ghost */}
        {dropPreviewTime !== null && draggedAsset && (
          <div
            className="absolute top-2 h-20 border-2 border-dashed border-brand-light bg-brand-base/40 rounded-md pointer-events-none transition-all duration-75 flex flex-col justify-between p-2 z-20"
            style={{
              left: `${dropPreviewTime * pxPerSec}px`,
              width: `${draggedAsset.duration * pxPerSec}px`,
            }}
          >
            <span className="text-xs font-bold text-brand-white opacity-80 truncate">
              {draggedAsset.name}
            </span>
            <span className="text-[10px] text-brand-light font-semibold">
              {dropPreviewTime.toFixed(1)}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
}