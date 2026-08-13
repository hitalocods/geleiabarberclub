import { NextResponse } from 'next/server';
import { getBarbers, createBarber, updateBarber, deleteBarber } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const barbers = await getBarbers();
    return NextResponse.json({ success: true, data: barbers }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar barbeiros' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Nome do barbeiro é obrigatório' }, { status: 400 });
    }
    const newBarber = await createBarber({
      name: body.name,
      email: body.email || `${body.name.toLowerCase().replace(/\s+/g, '')}@barber.com`,
      password: body.password || '123456',
      phone: body.phone || '',
      avatarUrl: body.avatarUrl || null,
      bio: body.bio || '',
      specialties: body.specialties || '',
      active: body.active !== false,
      workingHours: body.workingHours || 'Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30',
    });
    return NextResponse.json({ success: true, data: newBarber });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao cadastrar barbeiro' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }
    const updated = await updateBarber(body.id, {
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      avatarUrl: body.avatarUrl,
      bio: body.bio,
      specialties: body.specialties,
      active: body.active,
      workingHours: body.workingHours,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar barbeiro' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }
    await deleteBarber(id);
    return NextResponse.json({ success: true, message: 'Barbeiro removido' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao excluir barbeiro' }, { status: 500 });
  }
}
