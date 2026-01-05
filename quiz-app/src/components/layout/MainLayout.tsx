import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from '@/components/common/Breadcrumbs';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[80px]">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <Breadcrumbs />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
