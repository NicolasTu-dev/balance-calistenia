export function publicStorageUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Supabase: /storage/v1/object/public/<bucket>/<path>
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
