import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollToTop } from '../../hooks/useScrollToTop';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  useScrollToTop();

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-sidebar flex min-h-screen flex-col max-[980px]:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="w-full max-w-[1400px] flex-1 px-6 py-[1.35rem] max-[980px]:px-[0.9rem] max-[980px]:py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AppLayout;
