'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PillarEphemeralFeed from '@/components/PillarEphemeralFeed';
import PillarLanguageAI from '@/components/PillarLanguageAI';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ChatDashboard from '@/components/chat/ChatDashboard';

export default function Home() {
  const { user, isLoading } = useAuth();

  // Subtle loading screen while local session is determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090a0c] text-white">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl african-sunset-gradient shadow-2xl shadow-orange-500/30 animate-pulse">
          <span className="text-2xl font-black text-white font-mono">Y</span>
        </div>
        <p className="text-xs font-mono text-amber-400 mt-4 tracking-widest uppercase">
          Yethu • Africa. Live. Connected.
        </p>
      </div>
    );
  }

  // When user is authenticated: Landing page disappears, showing WhatsApp-style Chat Interface
  if (user) {
    return <ChatDashboard />;
  }

  // When unauthenticated: Show public Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-[#090a0c] text-white selection:bg-amber-500 selection:text-black">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Public Content */}
      <main className="flex-1">
        {/* Flagship Hero with Live Broadcast Simulator */}
        <HeroSection />

        {/* Principle 2: 48-Hour Ephemeral Vault */}
        <PillarEphemeralFeed />

        {/* Principle 3: Language Should Not Be a Barrier (Yethu AI) */}
        <PillarLanguageAI />
      </main>

      {/* Footer */}
      <Footer />

      {/* InsForge Sign In / Sign Up Modal */}
      <AuthModal />
    </div>
  );
}
