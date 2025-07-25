"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const FloatingElement = ({ 
  size, 
  top, 
  left, 
  delay = 0, 
  duration = 6 
}: {
  size: number;
  top: string;
  left: string;
  delay?: number;
  duration?: number;
}) => {
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/70`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        animation: `float ${duration}s ease-in-out infinite ${delay}s`,
      }}
    />
  );
};

// Feature card component
const FeatureCard = ({ 
  title, 
  description, 
  delay = 0 
}: {
  title: string;
  description: string;
  delay?: number;
}) => {
  return (
    <div
      className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// Main landing page component
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-black/90 to-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] animate-pulse" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating background elements */}
      <FloatingElement size={120} top="10%" left="8%" delay={0} duration={8} />
      <FloatingElement size={80} top="20%" left="85%" delay={1} duration={6} />
      <FloatingElement size={100} top="60%" left="5%" delay={2} duration={7} />
      <FloatingElement size={60} top="70%" left="90%" delay={0.5} duration={5} />
      <FloatingElement size={140} top="40%" left="80%" delay={1.5} duration={9} />
      <FloatingElement size={40} top="30%" left="15%" delay={2.5} duration={4} />

      {/* Navigation */}
      <nav className="relative z-10 p-6 animate-fade-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Image className="w-10 h-10 object-contain" src="/logo.png" alt="DevPlanner" width={40} height={40} />
            </div>
            <span className="text-white text-xl font-semibold">DevPlanner</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => {
                router.push('/sign-in');
              }}
              variant="ghost" 
              className="text-white hover:bg-white/90 border border-white/20 hover:border-white/30"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => {
                router.push('/sign-in');
              }}
              className="bg-white text-black hover:bg-gray-100 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="animate-scale-in">
            <div className="w-20 h-20 bg-white/90 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
              {/* <span className="text-white text-2xl font-bold">DP</span> */}
              <Image className="w-15 h-15 object-contain" src="/logo.png" alt="DevPlanner" width={40} height={40} />
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white animate-slide-up">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DevPlanner
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
              AI-Powered Project Planning & Team Collaboration
            </p>
          </div>

          {/* Subtitle */}
          <div className="animate-slide-up [animation-delay:400ms]">
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Transform your development workflow with intelligent project planning, 
              seamless team collaboration, and automated progress tracking.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up [animation-delay:600ms]">
            <Button 
              onClick={() => {
                router.push('/sign-in');
              }}
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started
            </Button>
            {/* <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 text-lg backdrop-blur-sm"
            >
              Watch Demo
            </Button> */}
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-up">
              What We Do
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
              Everything you need to plan, execute, and deliver successful projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Smart Project Planning"
              description="AI-powered project breakdown, timeline estimation, and resource allocation that adapts to your team's velocity and constraints."
              delay={0}
            />
            <FeatureCard
              title="Real-time Collaboration"
              description="Seamless team coordination with live updates, comment threads, and integrated communication tools that keep everyone aligned."
              delay={200}
            />
            <FeatureCard
              title="Intelligent Progress Tracking"
              description="Automated progress monitoring with predictive analytics, bottleneck detection, and personalized insights for better delivery."
              delay={400}
            />
            <FeatureCard
              title="Risk Management"
              description="Proactive risk identification and mitigation strategies powered by machine learning and historical project data analysis."
              delay={600}
            />
            <FeatureCard
              title="Resource Optimization"
              description="Dynamic resource allocation and workload balancing that maximizes team efficiency and prevents burnout."
              delay={800}
            />
            <FeatureCard
              title="Performance Analytics"
              description="Comprehensive dashboards and reports that provide actionable insights into team performance and project health."
              delay={1000}
            />
          </div>
        </section>

        {/* Feature Pills */}
        <section className="mt-24 text-center">
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up [animation-delay:1200ms]">
            {[
              'AI-Powered Planning',
              'Team Collaboration',
              'Progress Tracking',
              'Risk Management',
              'Resource Optimization',
              'Performance Analytics'
            ].map((feature, index) => (
              <div
                key={feature}
                className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-gray-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${1200 + index * 100}ms` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-32 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Projects?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of teams who are already building better software with DevPlanner`&apos;`s intelligent project management platform.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 font-semibold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
            >
              Get Started Free
            </Button>
          </div>
        </section>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}