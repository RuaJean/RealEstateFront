"use client";
import { useRef, useState } from "react";
import { uploadPropertyImage, setImageEnabled, deleteImage } from "@/services/propertyImage.service";
import type { PropertyImage } from "@/models/Property";

export default function ImageUploader({ propertyId, onUploaded }: { propertyId: string; onUploaded?: (img: PropertyImage) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onPick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const img = await uploadPropertyImage(propertyId, file, { description, enabled, onProgress: setProgress });
      onUploaded?.(img);
    } catch (e: any) {
      setError(e?.message ?? "Error subiendo imagen");
    } finally {
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <div>
          <label className="block text-sm">Descripción</label>
          <input className="border rounded p-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Habilitada
        </label>
        <button type="button" className="bg-black text-white px-3 py-2 rounded" onClick={onPick}>Elegir imagen</button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
      </div>
      {progress > 0 && <div className="text-sm">Subiendo: {progress}%</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}

export { setImageEnabled, deleteImage };


