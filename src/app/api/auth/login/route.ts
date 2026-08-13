import { NextResponse } from 'next/server';
import { authenticateBarber } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const barber = await authenticateBarber(email, password);

    if (!barber) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      barber: {
        id: barber.id,
        name: barber.name,
        email: barber.email,
        avatarUrl: barber.avatarUrl,
        specialties: barber.specialties,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao processar login' }, { status: 500 });
  }
}
