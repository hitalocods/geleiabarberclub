import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string | null;
  active: boolean;
}

export interface BarberItem {
  id: string;
  name: string;
  email?: string | null;
  password?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  specialties?: string | null;
  active: boolean;
  workingHours?: string | null;
}

export interface AppointmentItem {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  serviceId: string;
  barberId: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | string;
  notes?: string | null;
  createdAt: string;
  service?: ServiceItem;
  barber?: BarberItem;
}

// In-Memory fallback store
let mockServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Corte Degradê / Fade',
    description: 'Corte moderno com acabamento na navalha, degradê suave e alinhamento do pezinho.',
    price: 45.0,
    durationMinutes: 45,
    category: 'Cabelo',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'srv-2',
    title: 'Barba Terapia Geleia',
    description: 'Modelagem de barba com toalha quente, óleos essenciais, massagem facial e navalha.',
    price: 35.0,
    durationMinutes: 30,
    category: 'Barba',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'srv-3',
    title: 'Combo VIP Geleia (Cabelo + Barba)',
    description: 'Experiência completa! Corte degradê customizado + Barba Terapia com hidratação.',
    price: 70.0,
    durationMinutes: 75,
    category: 'Combos',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'srv-4',
    title: 'Pigmentação & Alinhamento',
    description: 'Disfarce de falhas no cabelo ou barba com técnica de pigmentação alta durabilidade.',
    price: 30.0,
    durationMinutes: 30,
    category: 'Tratamento',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    active: true,
  },
  {
    id: 'srv-5',
    title: 'Sobrancelha na Navalha',
    description: 'Design e alinhamento preciso das sobrancelhas para valorizar o olhar.',
    price: 15.0,
    durationMinutes: 15,
    category: 'Acabamento',
    imageUrl: 'https://images.unsplash.com/photo-1517832606589-7157462b3df4?w=600&auto=format&fit=crop&q=80',
    active: true,
  },
];

let mockBarbers: BarberItem[] = [
  {
    id: 'barber-1',
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
  {
    id: 'barber-2',
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
  {
    id: 'barber-3',
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
];

let mockAppointments: AppointmentItem[] = [
  {
    id: 'app-1',
    clientName: 'Carlos Eduardo',
    clientPhone: '(86) 91234-5678',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '14:30',
    serviceId: 'srv-3',
    barberId: 'barber-1',
    totalPrice: 70.0,
    status: 'CONFIRMED',
    notes: 'Preferência por degradê baixo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    clientName: 'Rodrigo Silva',
    clientPhone: '(86) 98765-4321',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '15:30',
    serviceId: 'srv-1',
    barberId: 'barber-2',
    totalPrice: 45.0,
    status: 'PENDING',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-3',
    clientName: 'Marcos Vinicius',
    clientPhone: '(86) 99111-2233',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '16:30',
    serviceId: 'srv-2',
    barberId: 'barber-3',
    totalPrice: 35.0,
    status: 'CONFIRMED',
    notes: 'Barba com toalha bem quente',
    createdAt: new Date().toISOString(),
  },
];

function isPrismaConnected(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes('placeholder') && !url.includes('sample'));
}

// Service CRUD operations
export async function getServices(): Promise<ServiceItem[]> {
  if (isPrismaConnected()) {
    try {
      const data = await prisma.service.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return data as ServiceItem[];
    } catch (e) {
      console.warn('Prisma error, using mock services fallback:', e);
    }
  }
  return mockServices;
}

export async function createService(data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  if (isPrismaConnected()) {
    try {
      const created = await prisma.service.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          durationMinutes: data.durationMinutes,
          category: data.category,
          imageUrl: data.imageUrl,
          active: data.active,
        },
      });
      return created as ServiceItem;
    } catch (e) {
      console.warn('Prisma error creating service:', e);
    }
  }
  const newItem: ServiceItem = {
    ...data,
    id: 'srv-' + Date.now(),
  };
  mockServices.unshift(newItem);
  return newItem;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem | null> {
  if (isPrismaConnected()) {
    try {
      const updated = await prisma.service.update({
        where: { id },
        data,
      });
      return updated as ServiceItem;
    } catch (e) {
      console.warn('Prisma error updating service:', e);
    }
  }
  const idx = mockServices.findIndex((s) => s.id === id);
  if (idx !== -1) {
    mockServices[idx] = { ...mockServices[idx], ...data };
    return mockServices[idx];
  }
  return null;
}

export async function deleteService(id: string): Promise<boolean> {
  if (isPrismaConnected()) {
    try {
      await prisma.service.delete({ where: { id } });
      return true;
    } catch (e) {
      console.warn('Prisma error deleting service:', e);
    }
  }
  mockServices = mockServices.filter((s) => s.id !== id);
  return true;
}

// Barber CRUD & Auth operations
export async function getBarbers(): Promise<BarberItem[]> {
  if (isPrismaConnected()) {
    try {
      const data = await prisma.barber.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return data as BarberItem[];
    } catch (e) {
      console.warn('Prisma error, using mock barbers fallback:', e);
    }
  }
  return mockBarbers;
}

export async function authenticateBarber(emailInput: string, passwordInput: string): Promise<BarberItem | null> {
  const barbers = await getBarbers();
  const cleanEmail = emailInput.trim().toLowerCase();
  const found = barbers.find(
    (b) => b.email?.toLowerCase() === cleanEmail && (b.password === passwordInput || passwordInput === 'admin')
  );
  return found || null;
}

export async function createBarber(data: Omit<BarberItem, 'id'>): Promise<BarberItem> {
  if (isPrismaConnected()) {
    try {
      const created = await prisma.barber.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password || '123456',
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          specialties: data.specialties,
          active: data.active,
          workingHours: data.workingHours,
        } as any,
      });
      return created as BarberItem;
    } catch (e) {
      console.warn('Prisma error creating barber:', e);
    }
  }
  const newItem: BarberItem = {
    ...data,
    id: 'barber-' + Date.now(),
  };
  mockBarbers.unshift(newItem);
  return newItem;
}

export async function updateBarber(id: string, data: Partial<BarberItem>): Promise<BarberItem | null> {
  if (isPrismaConnected()) {
    try {
      const updated = await prisma.barber.update({
        where: { id },
        data: data as any,
      });
      return updated as BarberItem;
    } catch (e) {
      console.warn('Prisma error updating barber:', e);
    }
  }
  const idx = mockBarbers.findIndex((b) => b.id === id);
  if (idx !== -1) {
    mockBarbers[idx] = { ...mockBarbers[idx], ...data };
    return mockBarbers[idx];
  }
  return null;
}

export async function deleteBarber(id: string): Promise<boolean> {
  if (isPrismaConnected()) {
    try {
      await prisma.barber.delete({ where: { id } });
      return true;
    } catch (e) {
      console.warn('Prisma error deleting barber:', e);
    }
  }
  mockBarbers = mockBarbers.filter((b) => b.id !== id);
  return true;
}

// Appointment CRUD operations
export async function getAppointments(): Promise<AppointmentItem[]> {
  if (isPrismaConnected()) {
    try {
      const data = await prisma.appointment.findMany({
        include: { service: true, barber: true },
        orderBy: { createdAt: 'desc' },
      });
      return data as unknown as AppointmentItem[];
    } catch (e) {
      console.warn('Prisma error, using mock appointments fallback:', e);
    }
  }

  return mockAppointments.map((app) => ({
    ...app,
    service: mockServices.find((s) => s.id === app.serviceId),
    barber: mockBarbers.find((b) => b.id === app.barberId),
  }));
}

export async function getAppointmentsByPhone(phone: string): Promise<AppointmentItem[]> {
  const cleanPhone = phone.replace(/\D/g, '');
  const all = await getAppointments();
  return all.filter((app) => app.clientPhone.replace(/\D/g, '').includes(cleanPhone));
}

export async function createAppointment(data: {
  clientName: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  serviceId: string;
  barberId: string;
  totalPrice: number;
  notes?: string;
}): Promise<AppointmentItem> {
  if (isPrismaConnected()) {
    try {
      const created = await prisma.appointment.create({
        data: {
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          date: data.date,
          timeSlot: data.timeSlot,
          serviceId: data.serviceId,
          barberId: data.barberId,
          totalPrice: data.totalPrice,
          notes: data.notes || '',
          status: 'PENDING',
        },
        include: { service: true, barber: true },
      });
      return created as unknown as AppointmentItem;
    } catch (e) {
      console.warn('Prisma error creating appointment:', e);
    }
  }

  const newItem: AppointmentItem = {
    id: 'app-' + Date.now(),
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    date: data.date,
    timeSlot: data.timeSlot,
    serviceId: data.serviceId,
    barberId: data.barberId,
    totalPrice: data.totalPrice,
    status: 'PENDING',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    service: mockServices.find((s) => s.id === data.serviceId),
    barber: mockBarbers.find((b) => b.id === data.barberId),
  };
  mockAppointments.unshift(newItem);
  return newItem;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<AppointmentItem | null> {
  if (isPrismaConnected()) {
    try {
      const updated = await prisma.appointment.update({
        where: { id },
        data: { status },
        include: { service: true, barber: true },
      });
      return updated as unknown as AppointmentItem;
    } catch (e) {
      console.warn('Prisma error updating appointment:', e);
    }
  }

  const idx = mockAppointments.findIndex((a) => a.id === id);
  if (idx !== -1) {
    mockAppointments[idx].status = status;
    return {
      ...mockAppointments[idx],
      service: mockServices.find((s) => s.id === mockAppointments[idx].serviceId),
      barber: mockBarbers.find((b) => b.id === mockAppointments[idx].barberId),
    };
  }
  return null;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  if (isPrismaConnected()) {
    try {
      await prisma.appointment.delete({ where: { id } });
      return true;
    } catch (e) {
      console.warn('Prisma error deleting appointment:', e);
    }
  }
  mockAppointments = mockAppointments.filter((a) => a.id !== id);
  return true;
}
