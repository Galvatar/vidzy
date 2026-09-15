import { useState } from "react";
import Dropzone from "./components/dropzone";
import { Timeline } from "./components/timeline";
import type { FileWithPreview } from "./lib/types";

export default function App() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  function handleSeek(time: number) {

  }

  return (
    <div className="flex h-screen w-screen bg-brand-white text-gray-900 overflow-hidden select-none">
      {/* Sidebar / Asset Library */}
      <div className="w-83 h-full">
        <Dropzone files={files} onChange={setFiles} />
      </div>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col">
        {/* Preview Player Canvas Area */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <canvas id="editor-preview" className="max-h-full aspect-video border border-slate-800 rounded shadow-2xl" />
        </div>

        {/* Timeline Container */}
        <div className="h-50">
          <Timeline files={files} currentTime={0} totalDuration={60} onSeek={handleSeek} />
        </div>
      </main>
    </div>
  );
}
