import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Video } from "./components/video";

type FileWithPreview = File & { preview: string };

export default function App() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(prevFiles => [
        ...prevFiles,
        ...acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        ) as FileWithPreview[]
      ]);
    }
  });

  return (
    <div {...getRootProps} className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Sidebar / Asset Library */}
      <aside {...getInputProps} className="w-81 border-r border-slate-800 p-4 bg-slate-900">
        <div {...getRootProps({className: "dropzone"})} className="relative border-2 w-full h-full rounded-lg border-gray-700 border-dashed p-2">
          <input {...getInputProps()} className="outline-none" />
          <h2 className="font-semibold text-sm tracking-wide text-slate-400 uppercase mb-3">Assets</h2>
          <div className="flex flex-wrap gap-3">
            {files.map(file => (
              <div onClick={(e) => e.stopPropagation()} key={file.name} className="flex w-32 h-18 rounded-lg overflow-hidden items-center justify-center border border-transparent hover:border-gray-300">
                {file.type.startsWith('video/') ? (
                  <Video
                    src={file.preview}
                  />
                ) : (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="flex aspect-square h-full"
                  />
                )}
              </div>
            ))}
          </div>
          {isDragActive &&
            <div className="flex flex-col items-center justify-center absolute top-0 left-0 rounded-lg bg-black opacity-50 text-gray-300 w-full h-full z-10">
              <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="currentColor"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/>
              </svg>
              <span>Drag here to upload</span>
            </div>
          }
        </div>
      </aside>

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
