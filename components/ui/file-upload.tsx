'use client'

import { useCallback, useState } from 'react';
import { Button } from './button';
import { getSignedUploadUrl, getPublicUrl } from '@/lib/upload';

interface FileUploadProps {
  onUpload: (url: string) => void;
  className?: string;
  id?: string;
}

export function FileUpload({ onUpload, className, id = 'file-upload' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const key = `uploads/${Date.now()}-${file.name}`;
      const signedUrl = await getSignedUploadUrl(key);
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      const publicUrl = getPublicUrl(key);
      onUpload(publicUrl);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  return (
    <div className={className}>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        className="sr-only"
        id={id}
      />
      <label htmlFor={id} className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {uploading ? 'Uploading...' : 'Choose Image'}
      </label>
    </div>
  );
}

