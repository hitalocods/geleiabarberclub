import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Geleia Barber Club | Agendamento Online & Barbearia Premium',
  description:
    'Agende seu horário online na Geleia Barber Club. Estilo clássico, degradê na navalha, barba terapia com toalha quente e atendimento sem filas.',
  keywords: ['Barbearia', 'Geleia Barber Club', 'Agendamento Barbearia', 'Corte de Cabelo', 'Barba', 'Degradê'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-brand-black text-white antialiased selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
