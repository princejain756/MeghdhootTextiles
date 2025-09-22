import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadApi } from "@/lib/api";
import { Trash2, UploadCloud, MoveLeft, MoveRight } from "lucide-react";

export type UploaderImage = {
  url: string;
  alt?: string;
  filename?: string;
  size?: number;
};

type Props = {
  value: UploaderImage[];
  onChange: (images: UploaderImage[]) => void;
  max?: number;
};

export default function ImageUploader({ value, onChange, max = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const canAddMore = value.length < max;

  const onFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!files || files.length === 0) return;
      const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!arr.length) return;
      const remaining = Math.max(0, max - value.length);
      const toUpload = arr.slice(0, remaining);
      setUploading(true);
      try {
        const res = await UploadApi.images(toUpload);
        const uploaded = res.files.map((f) => ({ url: f.url, filename: f.filename, size: f.size }));
        onChange([...value, ...uploaded]);
      } catch (e) {
        console.error(e);
        alert((e as Error).message || "Upload failed");
      } finally {
        setUploading(false);
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

  const updateAlt = (index: number, alt: string) => {
    const next = value.slice();
    next[index] = { ...next[index], alt };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Label>Product images</Label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        } ${!canAddMore ? "opacity-50" : ""}`}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          {canAddMore ? (
            <>
              Drag and drop images here, or
              <Button type="button" variant="link" className="px-1" onClick={() => inputRef.current?.click()}>
                browse
              </Button>
              up to {max} images.
            </>
          ) : (
            <>Maximum of {max} images added.</>
          )}
        </div>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelect}
          disabled={!canAddMore || uploading}
        />
        {uploading && <div className="text-xs text-muted-foreground">Uploading…</div>}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {value.map((img, i) => (
            <div key={`${img.url}-${i}`} className="group rounded-lg border bg-card shadow-sm">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt ?? ""} className="h-40 w-full rounded-t-lg object-cover" />
                <div className="pointer-events-none absolute inset-0 rounded-t-lg ring-0 ring-primary/40 group-hover:ring-2" />
                <div className="absolute left-1 top-1 flex gap-1">
                  <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => move(i, -1)} disabled={i === 0}>
                    <MoveLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                    <MoveRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute right-1 top-1">
                  <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => remove(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 p-2">
                <Input
                  placeholder="Alt text (optional)"
                  value={img.alt ?? ""}
                  onChange={(e) => updateAlt(i, e.target.value)}
                />
                {i === 0 && (
                  <div className="text-xs text-muted-foreground">Cover image</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

