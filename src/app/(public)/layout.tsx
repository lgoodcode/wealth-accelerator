import { Footer } from '@/components/public/footer';

export const dynamic = 'force-static';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <div className="font-sans bg-white flex-grow">{children}</div>
      <Footer />
    </>
  );
}
