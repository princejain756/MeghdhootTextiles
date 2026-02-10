import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadApi } from "@/lib/api";
import { Trash2, UploadCloud, MoveLeft, MoveRight, Video } from "lucide-react";

export type UploaderVideo = {
    url: string;
    filename?: string;
    size?: number;
};

type Props = {
    value: UploaderVideo[];
    onChange: (videos: UploaderVideo[]) => void;
    max?: number;
};

export default function VideoUploader({ value, onChange, max = 4 }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    const canAddMore = value.length < max;

    const onFiles = useCallback(
        async (files: FileList | File[]) => {
            if (!files || files.length === 0) return;
            const arr = Array.from(files).filter((f) => f.type.startsWith("video/"));
            if (!arr.length) return;
            const remaining = Math.max(0, max - value.length);
            const toUpload = arr.slice(0, remaining);
            setUploading(true);
            setUploadPercent(0);
            try {
                const res = await UploadApi.videosWithProgress(toUpload, setUploadPercent);
                const uploaded = res.files.map((f) => ({ url: f.url, filename: f.filename, size: f.size }));
                onChange([...value, ...uploaded]);
            } catch (e) {
                console.error(e);
                alert((e as Error).message || "Upload failed");
            } finally {
                setUploading(false);
                setUploadPercent(0);
            }
        },
        [max, onChange, value]
    );

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        onFiles(e.dataTransfer.files);
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiles(e.target.files ?? []);
        if (inputRef.current) inputRef.current.value = "";
    };

    const move = (index: number, dir: -1 | 1) => {
        const next = [...value];
        const swap = index + dir;
        if (swap < 0 || swap >= next.length) return;
        [next[index], next[swap]] = [next[swap], next[index]];
        onChange(next);
    };

    const remove = (index: number) => {
        const next = value.slice();
        next.splice(index, 1);
        onChange(next);
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-3">
            <Label>Product videos</Label>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center ${isDragging ? "border-primary bg-primary/5" : "border-border"
                    } ${!canAddMore ? "opacity-50" : ""}`}
            >
                <Video className="h-6 w-6 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                    {canAddMore ? (
                        <>
                            Drag and drop videos here, or
                            <Button type="button" variant="link" className="px-1" onClick={() => inputRef.current?.click()}>
                                browse
                            </Button>
                            up to {max} videos (MP4, WebM, OGG).
                        </>
                    ) : (
                        <>Maximum of {max} videos added.</>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    multiple
                    className="hidden"
                    onChange={handleSelect}
                    disabled={!canAddMore || uploading}
                />
                {uploading && (
                    <div className="w-full max-w-xs">
                        <div className="text-xs text-muted-foreground mb-1">Uploading… {uploadPercent}%</div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${uploadPercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {value.map((vid, i) => (
                        <div key={`${vid.url}-${i}`} className="group rounded-lg border bg-card shadow-sm overflow-hidden">
                            <div className="relative aspect-video bg-black">
                                {/* Video thumbnail using video element */}
                                <video
                                    src={vid.url}
                                    className="h-full w-full object-cover"
                                    preload="metadata"
                                    muted
                                    playsInline
                                    onLoadedMetadata={(e) => {
                                        // Seek to 1 second to get a better thumbnail
                                        (e.target as HTMLVideoElement).currentTime = 1;
                                    }}
                                />
                                {/* Play icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                                        <Video className="h-5 w-5 text-primary ml-0.5" />
                                    </div>
                                </div>
                                {/* Action buttons */}
                                <div className="absolute left-1 top-1 flex gap-1">
                                    <Button type="button" size="icon" variant="secondary" className="h-7 w-7 opacity-80 hover:opacity-100" onClick={() => move(i, -1)} disabled={i === 0}>
                                        <MoveLeft className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" size="icon" variant="secondary" className="h-7 w-7 opacity-80 hover:opacity-100" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                                        <MoveRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="absolute right-1 top-1">
                                    <Button type="button" size="icon" variant="destructive" className="h-7 w-7 opacity-80 hover:opacity-100" onClick={() => remove(i)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-2 text-xs text-muted-foreground truncate">
                                {vid.filename || `Video ${i + 1}`}
                                {vid.size && <span className="ml-1">({formatFileSize(vid.size)})</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
