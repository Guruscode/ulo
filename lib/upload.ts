// Client-safe upload utils (no server secrets)
export async function getSignedUploadUrl(filename: string): Promise<string> {
  const res = await fetch('/api/upload/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType: 'image/jpeg' }),
  });
  if (!res.ok) throw new Error('Failed to get upload URL');
  const { url } = await res.json();
  return url;
}

export function getPublicUrl(key: string): string {
  return `https://pub-c2bfd2e55d86f0958531fc2ee2e2087d.r2.dev/${key}`;
}

