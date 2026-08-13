import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!filename || !request.body) {
    return NextResponse.json({ success: false, error: 'Arquivo e nome de arquivo obrigatórios' }, { status: 400 });
  }

  try {
    if (token && token.length > 10) {
      const blob = await put(`barbearia/${Date.now()}-${filename}`, request.body, {
        access: 'public',
        token,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Fallback if token is not set yet
    return NextResponse.json({
      success: true,
      url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
      message: 'Vercel Blob Token não configurado. Imagem padrão utilizada.',
    });
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    return NextResponse.json({ success: false, error: 'Falha no upload do arquivo' }, { status: 500 });
  }
}
