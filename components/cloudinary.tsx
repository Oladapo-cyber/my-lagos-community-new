

import { useMemo, useState } from "react";

export default function ImageUploader() {
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState("");

  const hasImage = useMemo(() => Boolean(uploadedUrl), [uploadedUrl]);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    setError("");

    if (!file) return;

    try {
      setLoading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ozitech1");
      data.append("cloud_name", "dth0on4sc");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dth0on4sc/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Upload failed (${res.status})`);
      }

      const uploaded = await res.json();
      const url = uploaded.secure_url || uploaded.url || "";
      setUploadedUrl(url);
    } catch (err) {
      setUploadedUrl("");
      setError(err && err.message ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="text-sm font-medium">Upload an image</div>
            <div className="text-xs text-zinc-400">
              Cloudinary preset: <span className="font-mono">ozitech1</span>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={loading}
            />
            <span>{loading ? "Uploading..." : "Choose file"}</span>
          </label>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {hasImage ? (
          <div className="flex flex-col gap-3">
            <img
              src={uploadedUrl}
              alt="Uploaded"
              className="max-h-[420px] w-full rounded-lg object-contain"
            />

            <div className="rounded-lg bg-black/30 p-3">
              <div className="text-xs text-zinc-400">Uploaded URL</div>
              <a
                className="break-all text-sm text-sky-300 underline"
                href={uploadedUrl}
                target="_blank"
                rel="noreferrer"
              >
                {uploadedUrl}
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-800 px-3 py-8 text-center text-sm text-zinc-400">
            No upload yet.
          </div>
        )}
      </div>
    </div>
  );
}
