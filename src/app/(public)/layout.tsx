import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';

export const dynamic = 'force-static';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <div className="font-sans bg-blackAlpha-50">{children}</div>
      <Footer />
    </>
  );
}
