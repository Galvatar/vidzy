import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Video } from "./video";
import type { FileWithPreview } from "../lib/types";

interface DropzoneProps {
    files: FileWithPreview[],
    onChange(files: FileWithPreview[]): void
    onDrag(file: FileWithPreview | null): void
}

export default function Dropzone({ files, onChange, onDrag }: DropzoneProps) {
    const filesRef = useRef(files);
    filesRef.current = files;

    useEffect(() => {
        return () => {
            filesRef.current.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
        'image/*': [],
        'video/*': []
        },
        onDrop: async (acceptedFiles: File[]) => {
            const filePromises = acceptedFiles.map(async (file) => {
                const preview = URL.createObjectURL(file);
                const duration = await getMediaDuration(file, preview);

                return Object.assign(file, {
                    preview,
                    duration,
                }) as FileWithPreview;
            });

            const resolvedFiles = await Promise.all(filePromises);

            onChange([...files, ...resolvedFiles]);
        }
    });

    const getMediaDuration = (file: File, previewUrl: string): Promise<number> => {
        return new Promise((resolve) => {
            // Images default to a standard timeline length (e.g., 5 seconds)
            if (!file.type.startsWith('video/')) {
                resolve(0);
                return;
            }

            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = previewUrl;

            video.onloadedmetadata = () => {
            resolve(video.duration);
            };

            video.onerror = () => {
            resolve(5);
            };
        });
        };

    function removeAsset(name: string) {
        onChange(files.filter((f) => f.name !== name))
    }

    return (
        <div className="flex h-full w-full text-brand-white">
            <aside className="w-full border-r border-brand/50 p-4 bg-brand-white">
                <div {...getRootProps({className: "dropzone"})} className="relative border-2 w-full h-full rounded-lg border-brand-light border-dashed">
                    <input {...getInputProps()} className="outline-none" />
                    <span className="flex justify-between items-center w-full p-2">
                        <h2 className="font-bold text-sm tracking-wide text-brand-base uppercase mb-3">Assets</h2>
                        <button className="flex gap-2 items-center px-2 py-1 rounded bg-brand-base hover:bg-brand-dark text-sm transition-colors">
                            <p className="text-center leading-none pt-0.5">
                                Upload
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/>
                            </svg>
                        </button>
                    </span>
                    
                    <div onClick={(e) => e.stopPropagation()} className="flex h-full p-2 flex-wrap gap-3 content-start">
                        {files.map(file => (
                            <div 
                                draggable 
                                onDragStart={(e) => {
                                    onDrag(file);
                                    e.dataTransfer.setData("application/json", JSON.stringify(file));
                                }}
                                onDragEnd={() => onDrag(null)}
                                className="flex flex-col items-center border-2 border-transparent hover:border-brand-dark rounded-xl">
                                <div onClick={(e) => e.stopPropagation()} key={file.name} className="flex flex-col relative w-32 h-22 rounded-xl overflow-hidden items-center justify-center border-2">
                                    <button 
                                        onClick={() => removeAsset(file.name)}
                                        className="absolute z-20 top-1 right-1 p-0.5 rounded-full bg-brand-base/50 text-brand-white hover:bg-brand-base transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/>
                                        </svg>
                                    </button>
                                    {file.type.startsWith('video/') ? (
                                        <Video
                                            src={file}
                                        />
                                    ) : (
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="flex h-16"
                                        />
                                    )}
                                    <span className="text-ellipsis line-clamp-1 bg-brand-light w-full text-center text-brand-darkest text-xs p-0.5">
                                        {file.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isDragActive &&
                    <div className="flex flex-col items-center justify-center absolute top-0 left-0 rounded-lg bg-brand-darkest opacity-50 text-brand-white w-full h-full z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="currentColor"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/>
                        </svg>
                        <span>Drag here to upload</span>
                    </div>
                    }
                </div>
            </aside>
        </div>
    )
}