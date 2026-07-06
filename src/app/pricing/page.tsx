'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';
import type { Plan } from '@/lib/store';

interface PlanDef {
  id: Plan;
  name: string;
  price: number;
  yearlyPrice: number;
  color: string;
  gradient: string;
  badge?: string;
  certs: string;
  features: string[];
  cta: string;
}

const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    certs: '1 Certificate (free forever)',
    features: [
      '1 Academy Certificate exam',
      'All 27 learning modules',
      'AI Tutor (offline mode)',
      'Practice Lab & Quiz Center',
      'Interview prep questions',
      'Certifications Hub (browse)',
      'Glossary & Capstone Projects',
    ],
    cta: 'Current Plan',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    yearlyPrice: 7,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    badge: 'Popular',
    certs: '5 Certificates / month',
    features: [
      '5 Certification exams per month',
      'Everything in Free',
      'AI Tutor with your own API key',
      'Full exam history & analytics',
      'Downloadable PDF certificates',
      'Priority support',
      'Certificate sharing (LinkedIn)',
    ],
    cta: 'Start for $9/mo',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    yearlyPrice: 15,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #c026d3)',
    badge: 'Best Value',
    certs: 'Unlimited Certificates',
    features: [
      'Unlimited certification exams',
      'Everything in Starter',
      'All difficulty levels (Beginner → Expert)',
      'Detailed per-question analytics',
      'Custom certificate name & branding',
      'Export results to PDF/CSV',
      'Early access to new exams',
    ],
    cta: 'Go Pro for $19/mo',
  },
  {
    id: 'academy',
    name: 'Academy',
    price: 29,
    yearlyPrice: 23,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    certs: 'Unlimited + Career Support',
    features: [
      'Everything in Pro',
      '1-on-1 mentorship sessions',
      'Resume & CV review',
      'Job board exclusive listings',
      'Live cohort study groups',
      'Industry-recognised credential letter',
      'Interview coaching with feedback',
    ],
    cta: 'Join Academy for $29/mo',
  },
];

const CERT_LEVELS = [
  {
    level: 'Foundation',
    color: '#10b981',
    icon: '🌱',
    price: 'Free (first one)',
    certs: ['QA Fundamentals', 'ISTQB Foundation Prep', 'Software Testing Basics'],
    desc: 'Perfect for anyone starting their QA journey. Covers core testing concepts.',
  },
  {
    level: 'Intermediate',
    color: '#6366f1',
    icon: '🌿',
    price: 'Starter plan',
    certs: ['Test Automation Engineer', 'API Testing Professional', 'Agile QA Practitioner'],
    desc: 'For QAs with 1-2 years experience who want to level up their skills.',
  },
  {
    level: 'Advanced',
    color: '#f59e0b',
    icon: '⚡',
    price: 'Pro plan',
    certs: ['QA Automation Architect', 'Performance Testing Expert', 'DevOps QA Engineer'],
    desc: 'Senior-level certifications covering architecture, strategy and complex systems.',
  },
  {
    level: 'Expert',
    color: '#ef4444',
    icon: '🔥',
    price: 'Pro plan',
    certs: ['AI Quality Engineer', 'LLM Testing Specialist', 'Principal QA Engineer'],
    desc: 'Cutting-edge AI testing and leadership certifications for senior professionals.',
  },
];

export default function PricingPage() {
  const { plan, setPlan, earnedCerts, freeCertUsed } = useStore();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [upgrading, setUpgrading] = useState<Plan | null>(null);

  const PLAN_RANK: Record<Plan, number> = { free: 0, starter: 1, pro: 2, academy: 3 };

  const handleUpgrade = (targetPlan: Plan) => {
    if (targetPlan === plan) return;
    const isDowngrade = PLAN_RANK[targetPlan] < PLAN_RANK[plan];
    if (isDowngrade) {
      const ok = window.confirm(
        `Downgrade to ${targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}?\n\n` +
        `Your ${earnedCerts.length} earned certificate(s) are kept, but future exams will be limited to the ${targetPlan} plan allowance.`
      );
      if (!ok) return;
    }
    setUpgrading(targetPlan);
    // Simulate upgrade (in a real app this hits Stripe/payment)
    setTimeout(() => {
      setPlan(targetPlan);
      setUpgrading(null);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="page-content" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>💎</div>
          <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 900, color: '#f1f5f9' }}>
            Academy Plans & Pricing
          </h1>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 16, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Earn industry-recognised QA certifications. Start free — your first certificate is always on us.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            background: 'rgba(255,255,255,0.05)', borderRadius: 30,
            border: '1px solid rgba(255,255,255,0.1)', padding: 3,
          }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '7px 20px', borderRadius: 26, cursor: 'pointer', border: 'none',
                  background: billing === b ? '#6366f1' : 'transparent',
                  color: billing === b ? '#fff' : '#64748b',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === 'yearly' && (
                  <span style={{
                    marginLeft: 6, padding: '1px 6px', borderRadius: 10,
                    background: 'rgba(16,185,129,0.3)', color: '#10b981', fontSize: 10, fontWeight: 700,
                  }}>Save 20%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current plan banner */}
        {plan !== 'free' && (
          <div style={{
            padding: '12px 20px', borderRadius: 12, marginBottom: 28, textAlign: 'center',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            fontSize: 13, color: '#a5b4fc',
          }}>
            ✅ You&apos;re on the <strong>{plan.charAt(0).toUpperCase() + plan.slice(1)}</strong> plan ·{' '}
            {earnedCerts.length} certificate{earnedCerts.length !== 1 ? 's' : ''} earned
          </div>
        )}

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 60 }}>
          {PLANS.map(p => {
            const isCurrent = plan === p.id;
            const price = billing === 'yearly' ? p.yearlyPrice : p.price;

            return (
              <div
                key={p.id}
                style={{
                  borderRadius: 20, overflow: 'hidden',
                  border: `2px solid ${isCurrent ? p.color + '88' : 'rgba(255,255,255,0.08)'}`,
                  background: isCurrent ? `${p.color}0a` : '#0d0d1a',
                  display: 'flex', flexDirection: 'column',
                  transition: 'all 0.2s',
                  transform: p.badge === 'Best Value' ? 'scale(1.02)' : 'none',
                }}
              >
                {/* Plan header */}
                <div style={{ padding: '24px 22px 20px', background: `${p.color}0d` }}>
                  {p.badge && (
                    <div style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20, marginBottom: 12,
                      background: `${p.color}22`, color: p.color, fontSize: 11, fontWeight: 700,
                    }}>{p.badge}</div>
                  )}
                  {isCurrent && (
                    <div style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20, marginBottom: 12,
                      background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: 11, fontWeight: 700,
                    }}>✓ Current Plan</div>
                  )}

                  <div style={{ fontWeight: 800, fontSize: 20, color: p.color, marginBottom: 6 }}>{p.name}</div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9' }}>
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span style={{ fontSize: 13, color: '#64748b' }}>/ month</span>
                    )}
                  </div>

                  {billing === 'yearly' && price > 0 && (
                    <div style={{ fontSize: 11, color: '#64748b' }}>Billed annually · Save ${(p.price - p.yearlyPrice) * 12}/yr</div>
                  )}

                  <div style={{
                    marginTop: 10, padding: '8px 10px', borderRadius: 8,
                    background: `${p.color}15`, border: `1px solid ${p.color}30`,
                    fontSize: 12, color: p.color, fontWeight: 600,
                  }}>
                    🎓 {p.certs}
                  </div>
                </div>

                {/* Features */}
                <div style={{ padding: '16px 22px', flex: 1 }}>
                  {p.features.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 8, alignItems: 'flex-start',
                      marginBottom: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.4,
                    }}>
                      <span style={{ color: p.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ padding: '0 22px 22px' }}>
                  <button
                    onClick={() => handleUpgrade(p.id)}
                    disabled={isCurrent || upgrading !== null}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 10, cursor: isCurrent ? 'default' : 'pointer',
                      border: 'none',
                      background: isCurrent ? `${p.color}18` : p.gradient,
                      color: isCurrent ? p.color : '#fff',
                      fontSize: 13, fontWeight: 700,
                      transition: 'all 0.2s', opacity: upgrading && upgrading !== p.id ? 0.5 : 1,
                    }}
                  >
                    {upgrading === p.id ? '⏳ Upgrading…' : isCurrent ? '✓ Current Plan' : p.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate levels section */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>
              🏅 Certificate Levels
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Each certificate has 50 MCQ questions · 90 minutes · 70% pass mark · Instant PDF certificate
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {CERT_LEVELS.map(cl => (
              <div key={cl.level} style={{
                padding: '20px', borderRadius: 16,
                background: `${cl.color}08`, border: `1px solid ${cl.color}28`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 26 }}>{cl.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: cl.color }}>{cl.level}</div>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: '#475569',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{cl.price}</div>
                  </div>
                </div>

                <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{cl.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {cl.certs.map(c => (
                    <div key={c} style={{
                      padding: '6px 10px', borderRadius: 7,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                      fontSize: 12, color: '#94a3b8',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ color: cl.color }}>🎓</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800, color: '#f1f5f9', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { q: 'Is the first certificate really free?', a: 'Yes — your first certification exam and certificate is completely free, no credit card needed.' },
              { q: 'Are these certificates industry-recognised?', a: 'Academy certificates demonstrate your QA knowledge and are great for portfolios and LinkedIn. They are not accredited bodies like ISTQB but prepare you for those exams.' },
              { q: 'Can I retake a failed exam?', a: 'Yes, you can retry any exam. Each attempt uses one of your monthly certificate allowances if you pass.' },
              { q: 'What happens to my certificate if I downgrade?', a: 'All earned certificates remain yours permanently, even if you downgrade your plan.' },
              { q: 'Do unused certificates roll over?', a: 'Unused certificate attempts on Starter plan do not roll over to the next month.' },
              { q: 'Can I cancel anytime?', a: 'Yes, plans are monthly and you can cancel anytime. Your access continues until the end of the billing period.' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px 18px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{item.q}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Your certs */}
        {earnedCerts.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
              🏆 Your Earned Certificates ({earnedCerts.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {earnedCerts.map((c, i) => (
                <div key={i} style={{
                  padding: '14px 18px', borderRadius: 12,
                  background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>🎓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{c.certName}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      Issued to {c.userName} · Score: {c.pct}% ({c.score}/{c.total}) · {new Date(c.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: 'rgba(16,185,129,0.15)', color: '#10b981',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {c.pct}% ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', padding: '36px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, marginBottom: 20,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>
            Start Your QA Certification Journey
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 20px' }}>
            Your first certificate is free. No credit card required.
          </p>
          <a href="/certifications" style={{
            display: 'inline-block', padding: '13px 32px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
          }}>
            Browse Certifications →
          </a>
        </div>

      </div>
    </AppShell>
  );
}
