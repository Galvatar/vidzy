import Dropzone from "./components/dropzone";

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Sidebar / Asset Library */}
      <div className="w-81 h-full">
        <Dropzone />
      </div>
      

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col">
        {/* Preview Player Canvas Area */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <canvas id="editor-preview" className="max-h-full aspect-video border border-slate-800 rounded shadow-2xl" />
        </div>

        {/* Timeline Container */}
        <div className="h-64 border-t border-slate-800 bg-slate-900 p-2 flex flex-col">
          <div className="text-xs text-slate-500 font-mono">00:00:00:00</div>
          {/* Track layers go here */}
        </div>
      </main>
    </div>
  );
}
