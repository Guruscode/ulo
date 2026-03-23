# Cloudflare R2 Image Upload for Hotels & Properties
Status: [0/10]

## Info Gathered:
- No existing upload API/S3 (search 0 hits).
- No AWS deps.
- R2 creds/endpoint provided (add to .env.local).
- Targets: hotel-manager.tsx (4 gallery + room images), property-manager.tsx (4 images).

## Plan:
1. Add R2 vars to .env.local.
2. `pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`.
3. Create lib/upload.ts (S3 client, signed URL gen).
4. Create app/api/upload/route.ts (signed POST URLs).
5. Update hotel/property managers: FileInput → upload on change/save, set URL.
6. Add upload progress/preview.
7. Test admin/dashboard create (files → R2 URLs).
8. Update TODO.

**Dependent Files:** package.json, .env.local, lib/upload.ts, app/api/upload/route.ts, components/*/manager.tsx.

Followup: `pnpm install`, `pnpm dev`, test uploads to bucket.

Confirm plan before edits?

