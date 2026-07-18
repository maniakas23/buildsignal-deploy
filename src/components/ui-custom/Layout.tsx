import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink-primary">
      <Navbar />
      <main className="pt-0 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
