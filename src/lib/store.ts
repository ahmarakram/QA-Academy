import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'lead' | 'manager' | 'ai-engineer';
export type Theme = 'dark' | 'light';

export interface ModuleProgress {
  moduleId: number;
  completed: boolean;
  score?: number;
  completedAt?: string;
  lastStudiedAt?: string;
}

export interface QuizAttempt {
  moduleId: number;
  level: string;
  score: number;
  total: number;
  attemptedAt: string;
}

export interface LabBug {
  id: string;
  found: boolean;
  foundAt?: string;
}

export interface AISettings {
  provider: 'anthropic' | 'openai' | 'gemini';
  apiKey: string;
  model: string;
}

export interface GroqSettings {
  apiKey: string;
  model: string;
  enabled: boolean;
}

export interface TutorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type Plan = 'free' | 'starter' | 'pro' | 'academy';

export interface EarnedCert {
  certName: string;
  score: number;
  total: number;
  pct: number;
  earnedAt: string;
  userName: string;
}

interface Store {
  // existing
  level: ExperienceLevel;
  xp: number;
  badges: string[];
  moduleProgress: ModuleProgress[];
  quizAttempts: QuizAttempt[];
  labBugs: LabBug[];
  aiSettings: AISettings;
  groqSettings: GroqSettings;
  // new
  streak: number;
  lastActiveDate: string;
  moduleNotes: Record<number, string>;
  tutorHistory: TutorMessage[];
  theme: Theme;
  hasOnboarded: boolean;
  // cert / plan
  plan: Plan;
  earnedCerts: EarnedCert[];
  freeCertUsed: boolean;

  // existing actions
  setLevel: (level: ExperienceLevel) => void;
  addXP: (amount: number) => void;
  awardBadge: (badge: string) => void;
  completeModule: (moduleId: number, score?: number) => void;
  recordQuiz: (attempt: QuizAttempt) => void;
  markBugFound: (bugId: string) => void;
  updateAISettings: (settings: Partial<AISettings>) => void;
  updateGroqSettings: (settings: Partial<GroqSettings>) => void;
  // new actions
  visitModule: (moduleId: number) => void;
  recordActivity: () => void;
  setModuleNote: (moduleId: number, note: string) => void;
  setTutorHistory: (msgs: TutorMessage[]) => void;
  clearTutorHistory: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  tourActive: boolean;
  setTourActive: (v: boolean) => void;
  tourStep: number;
  setTourStep: (n: number) => void;
  // cert / plan actions
  setPlan: (plan: Plan) => void;
  earnCert: (cert: EarnedCert) => void;
  markFreeCertUsed: () => void;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      level: 'beginner',
      xp: 0,
      badges: [],
      moduleProgress: [],
      quizAttempts: [],
      labBugs: [],
      aiSettings: { provider: 'anthropic', apiKey: '', model: 'claude-sonnet-4-6' },
      groqSettings: { apiKey: '', model: 'llama-3.3-70b-versatile', enabled: false },
      streak: 0,
      lastActiveDate: '',
      moduleNotes: {},
      tutorHistory: [],
      theme: 'dark',
      hasOnboarded: false,
      tourActive: false,
      tourStep: 0,
      plan: 'free',
      earnedCerts: [],
      freeCertUsed: false,

      setLevel: (level) => set({ level }),
      addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
      awardBadge: (badge) =>
        set((s) => ({ badges: s.badges.includes(badge) ? s.badges : [...s.badges, badge] })),

      completeModule: (moduleId, score) =>
        set((s) => {
          const existing = s.moduleProgress.find((m) => m.moduleId === moduleId);
          const now = new Date().toISOString();
          if (existing) {
            return {
              moduleProgress: s.moduleProgress.map(m =>
                m.moduleId === moduleId ? { ...m, lastStudiedAt: now } : m
              ),
            };
          }
          return {
            moduleProgress: [
              ...s.moduleProgress,
              { moduleId, completed: true, score, completedAt: now, lastStudiedAt: now },
            ],
            xp: s.xp + 100,
          };
        }),

      recordQuiz: (attempt) =>
        set((s) => ({ quizAttempts: [...s.quizAttempts, attempt], xp: s.xp + 50 })),

      markBugFound: (bugId) =>
        set((s) => {
          if (s.labBugs.find((b) => b.id === bugId)?.found) return s;
          return {
            labBugs: [
              ...s.labBugs.filter((b) => b.id !== bugId),
              { id: bugId, found: true, foundAt: new Date().toISOString() },
            ],
            xp: s.xp + 25,
          };
        }),

      updateAISettings: (settings) =>
        set((s) => ({ aiSettings: { ...s.aiSettings, ...settings } })),

      updateGroqSettings: (settings) =>
        set((s) => ({ groqSettings: { ...s.groqSettings, ...settings } })),

      visitModule: (moduleId) =>
        set((s) => {
          const now = new Date().toISOString();
          const existing = s.moduleProgress.find(m => m.moduleId === moduleId);
          return {
            moduleProgress: existing
              ? s.moduleProgress.map(m => m.moduleId === moduleId ? { ...m, lastStudiedAt: now } : m)
              : [...s.moduleProgress, { moduleId, completed: false, lastStudiedAt: now }],
          };
        }),

      recordActivity: () =>
        set((s) => {
          const today = todayISO();
          if (s.lastActiveDate === today) return s;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yest = yesterday.toISOString().split('T')[0];
          const newStreak = s.lastActiveDate === yest ? s.streak + 1 : 1;
          return { streak: newStreak, lastActiveDate: today };
        }),

      setModuleNote: (moduleId, note) =>
        set((s) => ({ moduleNotes: { ...s.moduleNotes, [moduleId]: note } })),

      setTutorHistory: (msgs) => set({ tutorHistory: msgs }),
      clearTutorHistory: () => set({ tutorHistory: [] }),

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      setTheme: (theme) => set({ theme }),

      completeOnboarding: () => set({ hasOnboarded: true }),
      resetOnboarding: () => set({ hasOnboarded: false }),
      setTourActive: (v) => set({ tourActive: v }),
      setTourStep: (n) => set({ tourStep: n }),

      setPlan: (plan) => set({ plan }),
      // Idempotent: never store the same certName twice
      earnCert: (cert) => set((s) => ({
        earnedCerts: s.earnedCerts.some(c => c.certName === cert.certName)
          ? s.earnedCerts
          : [...s.earnedCerts, cert],
      })),
      markFreeCertUsed: () => set({ freeCertUsed: true }),
    }),
    { name: 'qa-academy-store' }
  )
);
