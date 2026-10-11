"use client";

import { useEffect, useRef, useState } from "react";
import "./styles/avatar-upload.styles.css";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function AvatarUpload({
  name = "avatar",
  label = "Upload avatar (optional)",
  error,
}: {
  name?: string;
  label?: string;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // revokes the previous object URL whenever the preview changes or on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const reject = (message: string) => {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setLocalError(message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    if (!ACCEPTED.includes(file.type))
      return reject("Use a JPG, PNG or WebP image");
    if (file.size > MAX_BYTES) return reject("Image must be under 2 MB");

    setLocalError(null);
    setPreview(URL.createObjectURL(file));
  };

  const remove = () => {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setLocalError(null);
  };

  const shownError = localError ?? error;

  return (
    <div className={`avatar-upload ${shownError ? "error" : ""}`}>
      <div className="avatar-upload-row">
        <div className="avatar-upload-box-container">
          <label className="avatar-upload-box clickable" htmlFor={name}>
            {preview ? (
              <img className="profile-avatar-preview" src={preview} alt="" />
            ) : (
              <img className="avatar-upload-icon" src={"/upload.svg"} />
            )}
          </label>
          <input
            id={name}
            ref={inputRef}
            name={name}
            type="file"
            accept={ACCEPTED.join(",")}
            className="avatar-upload-input"
            onChange={handleChange}
          />
          <div className="avatar-upload-label-container">
            <label className="avatar-upload-label">
              Upload avatar (optional)
            </label>
            <p className="avatar-upload-formats body-s">JPG, PNG or WEBP</p>
          </div>
        </div>

        {preview && (
          <button
            type="button"
            className="avatar-upload-remove label-s clickable"
            onClick={remove}
          >
            <img src="/x.svg" alt="" />
          </button>
        )}
      </div>
      {shownError && <p className="custom-input-error body-s">{shownError}</p>}
    </div>
  );
}
