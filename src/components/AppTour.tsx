'use client';

import { useEffect } from 'react';
import 'driver.js/dist/driver.css';

const tourSteps = [
  {
    element: '#tour-hero',
    popover: {
      title: '👋 Welcome to QA Academy',
      description: 'This is your personal dashboard — it tracks your learning progress, XP earned, bugs found, and daily streak all in one place. Set your experience level here to get a personalised learning path.',
      side: 'bottom' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-level-badge',
    popover: {
      title: '🎯 Your Experience Level',
      description: 'Select your current level — Beginner, Intermediate, Advanced, Expert, or AI Quality Engineer. The platform adapts the recommended modules and starting point to match where you are in your QA career.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-xp-streak',
    popover: {
      title: '✨ XP & Daily Streak',
      description: 'Every quiz, module, bug found, and AI tutor question earns you XP. Your daily streak grows each time you visit — keep it going to unlock special badges like "7-Day Streak" and "Month Master".',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-search',
    popover: {
      title: '🔍 Quick Search (⌘K)',
      description: 'Press Cmd+K (or Ctrl+K on Windows) anywhere in the app to instantly search modules, tools, certifications, and features. The fastest way to navigate the platform.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-nav',
    popover: {
      title: '📂 Full Navigation',
      description: 'Everything is one click away — Learning Path, Practice Lab, Quiz Center, AI Tutor, Interview Prep, Certifications, Capstone Projects, Jobs Market, CV Writer, and more. 20+ tools in the sidebar.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-stats',
    popover: {
      title: '📊 Your Progress Stats',
      description: 'Track how many of the 21 modules you\'ve completed, your total XP, bugs found in the Practice Lab, and badges earned. These update in real time as you learn.',
      side: 'bottom' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-platform',
    popover: {
      title: '🗺️ Platform Overview',
      description: 'Click any card to jump straight into that section — 21 modules, 40+ practice labs, 100+ quiz questions, 8 capstone projects, 50+ achievements, and an AI-powered tutor. Each card links directly to the feature.',
      side: 'bottom' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-tracks',
    popover: {
      title: '📚 Learning Tracks',
      description: 'Modules are grouped into 5 tracks: Core Testing, Automation, AI Quality Engineering, Specialised, and Leadership. Pick a track that matches your career goal — or complete all 21 modules to earn the Full Stack QA badge.',
      side: 'top' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-challenge',
    popover: {
      title: '🏆 Daily Challenge',
      description: 'Every day a new QA challenge appears — write test cases, explain a concept, or design a test strategy. Complete it to earn bonus XP. Challenges rotate daily and cover all QA specialisations.',
      side: 'top' as const,
      align: 'start' as const,
    },
  },
  {
    element: '#tour-quick-actions',
    popover: {
      title: '⚡ Quick Actions — Your Launchpad',
      description: 'Jump straight into any key feature from here. Start a module, hunt for bugs in the Practice Lab, take a quiz, chat with the AI Tutor, prep for interviews, or browse job salaries by country. This is where your QA journey begins!',
      side: 'top' as const,
      align: 'start' as const,
    },
  },
];

interface AppTourProps {
  onDone: () => void;
}

export default function AppTour({ onDone }: AppTourProps) {
  useEffect(() => {
    let driverInstance: { destroy: () => void; drive: () => void } | null = null;

    import('driver.js').then(({ driver }) => {
      driverInstance = driver({
        animate: true,
        showProgress: true,
        progressText: 'Step {{current}} of {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: '🎉 Let\'s Start!',
        popoverClass: 'qa-tour-popover',
        overlayOpacity: 0.6,
        smoothScroll: true,
        onDestroyed: onDone,
        steps: tourSteps,
      });
      driverInstance.drive();
    });

    return () => {
      driverInstance?.destroy();
    };
  }, [onDone]);

  return null;
}
