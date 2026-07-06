'use client';

import { useEffect } from 'react';
import 'driver.js/dist/driver.css';

const tourSteps = [
  {
    element: 'nav a[href="/"]',
    popover: {
      title: '🏠 Dashboard',
      description: 'Your home base — track XP, streaks, and jump into learning.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/learning-path"]',
    popover: {
      title: '📚 Learning Path',
      description: '21 structured modules from fundamentals to AI Quality Engineering.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/quiz"]',
    popover: {
      title: '🎯 Quiz Center',
      description: '100+ adaptive quizzes that adjust difficulty to your level.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/ai-tutor"]',
    popover: {
      title: '🤖 AI Tutor',
      description: 'Ask anything about QA — your 24/7 personalised testing mentor.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/lab"]',
    popover: {
      title: '🔬 Practice Lab',
      description: 'Hands-on bug-hunting in real codebases. Find bugs, earn XP.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/interview-prep"]',
    popover: {
      title: '💼 Interview Prep',
      description: 'Practice QA interview questions with AI-powered feedback.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/certifications"]',
    popover: {
      title: '🏅 Certifications',
      description: 'Study guides for ISTQB, Selenium, Cypress, and more.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/cv-writer"]',
    popover: {
      title: '📄 CV Writer',
      description: 'AI-powered resume builder tailored for QA roles.',
      side: 'right' as const,
      align: 'start' as const,
    },
  },
  {
    element: 'nav a[href="/settings"]',
    popover: {
      title: '⚙️ AI Settings',
      description: 'Customise your AI model, theme, and learning preferences.',
      side: 'right' as const,
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
        progressText: '{{current}} of {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: 'Done ✓',
        popoverClass: 'qa-tour-popover',
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
