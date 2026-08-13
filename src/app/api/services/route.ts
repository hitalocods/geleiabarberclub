import { NextResponse } from 'next/server';
import { getServices, createService, updateService, deleteService } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ success: true, data: services }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar serviços' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.price) {
      return NextResponse.json({ success: false, error: 'Título e preço são obrigatórios' }, { status: 400 });
    }
    const newService = await createService({
      title: body.title,
      description: body.description || '',
      price: parseFloat(body.price),
      durationMinutes: parseInt(body.durationMinutes) || 30,
      category: body.category || 'Cabelo',
      imageUrl: body.imageUrl || null,
      active: body.active !== false,
    });
    return NextResponse.json({ success: true, data: newService });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao criar serviço' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }
    const updated = await updateService(body.id, {
      title: body.title,
      description: body.description,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      durationMinutes: body.durationMinutes !== undefined ? parseInt(body.durationMinutes) : undefined,
      category: body.category,
      imageUrl: body.imageUrl,
      active: body.active,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar serviço' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do serviço é obrigatório' }, { status: 400 });
    }
    await deleteService(id);
    return NextResponse.json({ success: true, message: 'Serviço excluído' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao deletar serviço' }, { status: 500 });
  }
}
