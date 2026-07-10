import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: '#050505',
        overflow: 'hidden',
      }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Minimal Header */}
      <header className="absolute top-0 w-full p-6 z-50 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        
        <div className="text-xl font-bold tracking-widest text-white">
          SHAMSH<span className="text-green-500">.</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
