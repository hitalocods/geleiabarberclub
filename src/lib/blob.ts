import { put } from '@vercel/blob';

export async function uploadImage(file: File, folderName = 'uploads'): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token && token.length > 10) {
    try {
      const filename = `${folderName}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const blob = await put(filename, file, {
        access: 'public',
        token,
      });
      return blob.url;
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
    }
  }

  // Local fallback: convert file to Base64 Data URL for immediate preview without Vercel token
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
