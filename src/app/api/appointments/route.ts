import { NextResponse } from 'next/server';
import {
  getAppointments,
  getAppointmentsByPhone,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (phone) {
      const filtered = await getAppointmentsByPhone(phone);
      return NextResponse.json({ success: true, data: filtered }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    const appointments = await getAppointments();
    return NextResponse.json({ success: true, data: appointments }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, clientPhone, date, timeSlot, serviceId, barberId, totalPrice, notes } = body;

    if (!clientName || !clientPhone || !date || !timeSlot || !serviceId || !barberId) {
      return NextResponse.json(
        { success: false, error: 'Preencha todos os campos obrigatórios' },
        { status: 400 }
      );
    }

    const newAppointment = await createAppointment({
      clientName,
      clientPhone,
      date,
      timeSlot,
      serviceId,
      barberId,
      totalPrice: parseFloat(totalPrice) || 0,
      notes,
    });

    return NextResponse.json({ success: true, data: newAppointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao registrar agendamento' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID e status são obrigatórios' }, { status: 400 });
    }

    const updated = await updateAppointmentStatus(id, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar status do agendamento' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    await deleteAppointment(id);
    return NextResponse.json({ success: true, message: 'Agendamento cancelado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao remover agendamento' }, { status: 500 });
  }
}
