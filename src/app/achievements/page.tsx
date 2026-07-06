'use client';

import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';

const allAchievements = [
  { id: 'first-module', icon: '🎓', title: 'First Steps', desc: 'Complete your first module', xp: 100, category: 'Learning' },
  { id: 'five-modules', icon: '📚', title: 'Knowledge Seeker', desc: 'Complete 5 modules', xp: 250, category: 'Learning' },
  { id: 'ten-modules', icon: '🏅', title: 'Halfway Hero', desc: 'Complete 10 modules', xp: 500, category: 'Learning' },
  { id: 'all-modules', icon: '🏆', title: 'QA Master', desc: 'Complete all 21 modules', xp: 2000, category: 'Learning' },
  { id: 'first-quiz', icon: '🎯', title: 'Quiz Starter', desc: 'Complete your first quiz', xp: 50, category: 'Quizzes' },
  { id: 'quiz-streak-5', icon: '🔥', title: 'On Fire', desc: 'Score 100% on 5 quizzes in a row', xp: 300, category: 'Quizzes' },
  { id: 'quiz-master', icon: '🧠', title: 'Quiz Master', desc: 'Complete 50 quizzes', xp: 750, category: 'Quizzes' },
  { id: 'first-bug', icon: '🐛', title: 'Bug Hunter', desc: 'Find your first bug in the lab', xp: 75, category: 'Labs' },
  { id: 'ten-bugs', icon: '🔬', title: 'Senior Bug Hunter', desc: 'Find 10 bugs in the practice lab', xp: 400, category: 'Labs' },
  { id: 'all-labs', icon: '⚗️', title: 'Lab Expert', desc: 'Complete all practice labs', xp: 600, category: 'Labs' },
  { id: 'first-interview', icon: '💼', title: 'Interview Ready', desc: 'Complete your first interview session', xp: 100, category: 'Career' },
  { id: 'cv-created', icon: '📄', title: 'CV Pro', desc: 'Generate your QA CV', xp: 150, category: 'Career' },
  { id: 'first-cert', icon: '🏅', title: 'Certified Tester', desc: 'Earn your first certification', xp: 500, category: 'Career' },
  { id: 'capstone-1', icon: '🚀', title: 'Project Builder', desc: 'Complete your first capstone project', xp: 300, category: 'Projects' },
  { id: 'all-capstones', icon: '🌟', title: 'Project Legend', desc: 'Complete all 8 capstone projects', xp: 1500, category: 'Projects' },
  { id: 'ai-module', icon: '🤖', title: 'AI Pioneer', desc: 'Complete the AI Testing module', xp: 200, category: 'AI Quality' },
  { id: 'streak-7', icon: '⚡', title: 'Consistent Learner', desc: 'Maintain a 7-day learning streak', xp: 350, category: 'Dedication' },
  { id: 'streak-30', icon: '🌙', title: 'Month of Mastery', desc: 'Maintain a 30-day learning streak', xp: 1000, category: 'Dedication' },
  { id: 'xp-1000', icon: '✨', title: 'XP Collector', desc: 'Earn 1,000 XP', xp: 100, category: 'Dedication' },
  { id: 'xp-5000', icon: '💎', title: 'XP Legend', desc: 'Earn 5,000 XP', xp: 500, category: 'Dedication' },
  { id: 'ai-tutor-10', icon: '💬', title: 'Curious Mind', desc: 'Ask the AI Tutor 10 questions', xp: 100, category: 'AI Quality' },
  { id: 'full-profile', icon: '👤', title: 'Profile Complete', desc: 'Set your experience level and goal', xp: 50, category: 'Getting Started' },
];

const categoryColors: Record<string, string> = {
  'Getting Started': '#10b981',
  'Learning': '#6366f1',
  'Quizzes': '#a855f7',
  'Labs': '#14b8a6',
  'Career': '#f59e0b',
  'Projects': '#ef4444',
  'AI Quality': '#06b6d4',
  'Dedication': '#ec4899',
};

const categories = [...new Set(allAchievements.map(a => a.category))];

export default function AchievementsPage() {
  const { badges, xp, moduleProgress, labBugs, streak } = useStore();

  const earned = new Set(badges);
  const completedModules = moduleProgress.filter(m => m.completed).length;

  // Auto-derive earned badges from store state
  const derivedEarned = new Set<string>(badges);
  if (completedModules >= 1) derivedEarned.add('first-module');
  if (completedModules >= 5) derivedEarned.add('five-modules');
  if (completedModules >= 10) derivedEarned.add('ten-modules');
  if (completedModules >= 21) derivedEarned.add('all-modules');
  if (labBugs.filter(b => b.found).length >= 1) derivedEarned.add('first-bug');
  if (labBugs.filter(b => b.found).length >= 10) derivedEarned.add('ten-bugs');
  if (streak >= 7) derivedEarned.add('streak-7');
  if (streak >= 30) derivedEarned.add('streak-30');
  if (xp >= 1000) derivedEarned.add('xp-1000');
  if (xp >= 5000) derivedEarned.add('xp-5000');

  const earnedCount = allAchievements.filter(a => derivedEarned.has(a.id)).length;
  const totalXPFromAchievements = allAchievements
    .filter(a => derivedEarned.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  return (
    <AppShell>
      <div className="page-content">
        {/* Header */}
        <div className="hero-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 48 }}>🏆</div>
            <div style={{ flex: 1 }}>
              <h1 className="hero-title">Achievements</h1>
              <p className="hero-subtitle">Earn badges by completing learning milestones across the platform</p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '10px 20px', background: 'rgba(99,102,241,0.1)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#a5b4fc' }}>{earnedCount}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>of {allAchievements.length} earned</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 20px', background: 'rgba(245,158,11,0.1)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24' }}>{totalXPFromAchievements.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>XP from badges</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
              <span>Overall progress</span>
              <span>{Math.round((earnedCount / allAchievements.length) * 100)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${(earnedCount / allAchievements.length) * 100}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.map(cat => {
          const catAchievements = allAchievements.filter(a => a.category === cat);
          const catColor = categoryColors[cat] ?? '#6366f1';
          const catEarned = catAchievements.filter(a => derivedEarned.has(a.id)).length;

          return (
            <div key={cat} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 18, borderRadius: 2, background: catColor }} />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{cat}</h2>
                <span style={{ fontSize: 11, color: catColor, background: `${catColor}18`, border: `1px solid ${catColor}33`, padding: '2px 8px', borderRadius: 20 }}>
                  {catEarned}/{catAchievements.length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {catAchievements.map(achievement => {
                  const isEarned = derivedEarned.has(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      style={{
                        padding: '16px',
                        borderRadius: 14,
                        background: isEarned ? `${catColor}12` : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${isEarned ? catColor + '40' : 'rgba(255,255,255,0.06)'}`,
                        transition: 'all 0.2s',
                        opacity: isEarned ? 1 : 0.55,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {isEarned && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#10b981',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10,
                        }}>✓</div>
                      )}
                      <div style={{ fontSize: 28, marginBottom: 8, filter: isEarned ? 'none' : 'grayscale(1)' }}>
                        {achievement.icon}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isEarned ? '#f1f5f9' : '#475569', marginBottom: 4 }}>
                        {achievement.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4, marginBottom: 8 }}>
                        {achievement.desc}
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 600,
                        color: isEarned ? catColor : '#334155',
                        background: isEarned ? `${catColor}18` : 'rgba(255,255,255,0.04)',
                        padding: '3px 8px', borderRadius: 20, display: 'inline-block',
                      }}>
                        +{achievement.xp} XP
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
