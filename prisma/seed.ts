import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed no banco Neon PostgreSQL...');

  // 1. Limpar registros antigos se existirem
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.barber.deleteMany({});

  // 2. Criar Barbeiros
  const barber1 = await prisma.barber.create({
    data: {
      name: 'Geleia (Master Barber)',
      email: 'geleia@barber.com',
      password: '123',
      phone: '(86) 99999-8888',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
      bio: 'Fundador do Geleia Barber Club. Especialista em degradê de alta precisão.',
      specialties: 'Degradê Navalhado, Freestyles, Barba Terapia',
      active: true,
      workingHours: 'Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30',
    },
  });

  const barber2 = await prisma.barber.create({
    data: {
      name: 'Lucas "Navalha"',
      email: 'lucas@barber.com',
      password: '123',
      phone: '(86) 98888-7777',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      bio: 'Mestre em cortes clássicos e visagismo masculino.',
      specialties: 'Cortes Clássicos, Pompadour, Pigmentação',
      active: true,
      workingHours: 'Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30',
    },
  });

  const barber3 = await prisma.barber.create({
    data: {
      name: 'Mateus "Fade"',
      email: 'mateus@barber.com',
      password: '123',
      phone: '(86) 97777-6666',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      bio: 'Especialista em tendências urbanas, platinados e texturização.',
      specialties: 'Platinados, Texturização, Riscos e Desenhos',
      active: true,
      workingHours: 'Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30',
    },
  });

  // 3. Criar Serviços
  const service1 = await prisma.service.create({
    data: {
      title: 'Corte Degradê / Fade',
      description: 'Corte moderno com acabamento na navalha, degradê suave e alinhamento do pezinho.',
      price: 45.0,
      durationMinutes: 45,
      category: 'Cabelo',
      imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      title: 'Barba Terapia Geleia',
      description: 'Modelagem de barba com toalha quente, óleos essenciais, massagem facial e navalha.',
      price: 35.0,
      durationMinutes: 30,
      category: 'Barba',
      imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      title: 'Combo VIP Geleia (Cabelo + Barba)',
      description: 'Experiência completa! Corte degradê customizado + Barba Terapia com hidratação.',
      price: 70.0,
      durationMinutes: 75,
      category: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      title: 'Pigmentação & Alinhamento',
      description: 'Disfarce de falhas no cabelo ou barba com técnica de pigmentação alta durabilidade.',
      price: 30.0,
      durationMinutes: 30,
      category: 'Tratamento',
      imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
  });

  // 4. Criar Agendamentos Iniciais
  const today = new Date().toISOString().split('T')[0];

  await prisma.appointment.create({
    data: {
      clientName: 'Carlos Eduardo',
      clientPhone: '(86) 91234-5678',
      date: today,
      timeSlot: '14:30',
      serviceId: service3.id,
      barberId: barber1.id,
      totalPrice: 70.0,
      status: 'CONFIRMED',
      notes: 'Preferência por degradê baixo',
    },
  });

  await prisma.appointment.create({
    data: {
      clientName: 'Rodrigo Silva',
      clientPhone: '(86) 98765-4321',
      date: today,
      timeSlot: '15:30',
      serviceId: service1.id,
      barberId: barber2.id,
      totalPrice: 45.0,
      status: 'PENDING',
      notes: '',
    },
  });

  console.log('Seed concluído com sucesso no Neon PostgreSQL!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
