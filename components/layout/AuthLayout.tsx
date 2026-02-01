import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[var(--surface-base)]">
      {/* 
        KINETIC BACKGROUND 
        Layered gradients that move slowly to create a "breathing" effect
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary Glow (Top Left) */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full opacity-30 mix-blend-multiply filter blur-[80px] animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, var(--brand-red), transparent 70%)' }}
        />
        
        {/* Secondary Glow (Bottom Right) */}
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full opacity-20 mix-blend-multiply filter blur-[60px]"
          style={{ background: 'radial-gradient(circle, var(--status-info), transparent 70%)' }}
        />
        
        {/* Glass Mesh Overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]" />
      </div>

      {/* 
        CONTENT CONTAINER 
        Centered card with glass effect
      */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {title && (
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Content */}
        <div className="w-full animate-slide-up" style={{ animationDelay: '200ms' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
