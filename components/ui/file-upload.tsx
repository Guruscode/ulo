'use client'

import { useCallback, useState } from 'react';
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
      <label htmlFor={id} className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {uploading ? uploadingLabel : label}
      </label>
    </div>
  );
}
