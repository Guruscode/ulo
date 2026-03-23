import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@/lib/server/env';

const r2 = new S3Client({
  region: env.R2_REGION,
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID!,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getR2SignedUploadUrl(key: string, contentType = 'image/jpeg') {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });
  return await getSignedUrl(r2, command, { expiresIn: 3600 });
}

