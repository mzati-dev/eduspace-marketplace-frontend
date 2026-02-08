import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eduspace Marketplace | The knowledge marketplace',
  description: 'Eduspace Marketplace is the marketplace where students unlock knowledge and educators turn expertise into impact, for all levels and lifelong learning.',
  icons: {
    icon: '/edumarketplacelogo.png',
  },
  openGraph: {
    title: 'Eduspace Marketplace',
    description: 'The knowledge marketplace for all education levels',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eduspace Marketplace',
    description: 'The knowledge marketplace for all education levels',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { Providers } from './providers';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Eduspace Marketplace',
//   description: 'The knowledge marketplace. It is the marketplace where students unlock knowledge and educators turn expertise into impact, from secondary school to university and beyond.',
//   icons: {
//     icon: '/favicon.png',
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-slate-900 text-white`}>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }