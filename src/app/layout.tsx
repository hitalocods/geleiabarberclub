import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Geleia Barber Club | Agendamento Online & Barbearia Premium',
  description:
    'Agende seu horário online na Geleia Barber Club em Teresina-PI. Estilo clássico, degradê na navalha, barba terapia e atendimento pontual sem filas.',
  keywords: ['Barbearia', 'Geleia Barber Club', 'Agendamento Barbearia', 'Teresina', 'Corte de Cabelo', 'Barba', 'Degradê'],
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
    <html lang="pt-BR" className={`scroll-smooth ${outfit.variable} ${inter.variable}`}>
      <body className="bg-brand-black text-white antialiased selection:bg-brand-red selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
