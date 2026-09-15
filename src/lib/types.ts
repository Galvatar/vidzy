export type TimelineClip = {
  id: string; // Unique ID (e.g. crypto.randomUUID())
  name: string;
  mediaType: 'image' | 'video';
  startTime: number; // Position on timeline in seconds
  duration: number; // Length in seconds
  trackId: number; // Row index
};

export type FileWithPreview = File & { 
  preview: string,
  duration: number
};