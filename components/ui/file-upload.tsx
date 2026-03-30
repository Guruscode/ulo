'use client'

import { useCallback, useState } from 'react';
import { FileImage, UploadCloud, Video } from 'lucide-react';
import { getSignedUploadUrl } from '@/lib/upload';

interface FileUploadProps {
  onUpload: (url: string) => void;
  className?: string;
  id?: string;
  accept?: string;
  label?: string;
  uploadingLabel?: string;
  maxSizeMb?: number;
}

export function FileUpload({
  onUpload,
  className,
  id = 'file-upload',
  accept = 'image/*',
  label = 'Choose File',
  uploadingLabel = 'Uploading...',
  maxSizeMb = 4,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const isVideoUpload = accept.includes('video')
  const uploadTypeLabel = isVideoUpload ? 'video' : 'image'
  const Icon = isVideoUpload ? Video : FileImage

  const handleUpload = useCallback(async (file: File) => {
    const isImageUpload = accept.includes('image')
    const isVideoUpload = accept.includes('video')

    if (isImageUpload && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (isVideoUpload && !file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File must be ${maxSizeMb} MB or smaller`);
      return;
    }

    setUploading(true);
    try {
      const config = await getSignedUploadUrl('uploads');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', config.apiKey);
      formData.append('timestamp', String(config.timestamp));
      formData.append('signature', config.signature);
      formData.append('folder', config.folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const result = await response.json();
      onUpload(result.secure_url);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  }, [accept, maxSizeMb, onUpload]);

  return (
    <div className={className}>
      <input 
        type="file" 
        accept={accept}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        className="sr-only"
        id={id}
      />
      <label
        htmlFor={id}
        className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-secondary hover:bg-secondary/5"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          {uploading ? <UploadCloud className="h-5 w-5 animate-pulse text-secondary" /> : <Icon className="h-5 w-5 text-secondary" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">
            {uploading ? uploadingLabel : label}
          </p>
          <p className="text-xs text-slate-500">
            Click to upload a {uploadTypeLabel}. Maximum file size: {maxSizeMb} MB.
          </p>
        </div>
      </label>
    </div>
  );
}
