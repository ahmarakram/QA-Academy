'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { countries, globalStats, hotJobTitles, skillDemand, CountryJobData } from '@/lib/jobs-data';

const demandColor: Record<string, string> = {
  'Very High': '#10b981',
  'High': '#6366f1',
  'Growing': '#f59e0b',
  'Medium': '#64748b',
};

const remoteColor: Record<string, string> = {
  'Abundant': '#10b981',
  'High': '#6366f1',
  'Moderate': '#f59e0b',
  'Limited': '#ef4444',
};

function CountryCard({ country, selected, onClick }: { country: CountryJobData; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? 'rgba(99,102,241,0.15)' : '#12121a',
      border: `1px solid ${selected ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.15s', width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{country.flag}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#e2e8f0' }}>{country.name}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{country.region}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 8px', borderRadius: 20, fontSize: 10,
          background: `${demandColor[country.demand]}22`, color: demandColor[country.demand],
          border: `1px solid ${demandColor[country.demand]}44`,
        }}>{country.demand}</span>
        <span style={{
          padding: '2px 8px', borderRadius: 20, fontSize: 10,
          background: `${remoteColor[country.remoteAvailability]}22`, color: remoteColor[country.remoteAvailability],
          border: `1px solid ${remoteColor[country.remoteAvailability]}44`,
        }}>🌐 {country.remoteAvailability} Remote</span>
      </div>
    </button>
  );
}

function SalaryRow({ label, local, usd }: { label: string; local: string; usd: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{label}</div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{local}</div>
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{usd}</div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryJobData>(countries[0]);
  const [regionFilter, setRegionFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'salaries' | 'insights' | 'platforms'>('overview');

  const regions = ['All', ...Array.from(new Set(countries.map(c => c.region)))];
  const filtered = regionFilter === 'All' ? countries : countries.filter(c => c.region === regionFilter);

  return (
    <AppShell>
      <div className="page-content">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🌍</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#e2e8f0' }}>Global QA Jobs Market</h1>
              <p style={{ margin: 0, fontSize: 14, color: '#64748b', marginTop: 2 }}>
                Salaries, demand, skills, and opportunities across 12 countries — updated for 2025
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12, marginBottom: 36,
        }}>
          {[
            { icon: '💼', label: 'Est. Open Roles', value: globalStats.totalJobsEstimate, color: '#6366f1' },
            { icon: '📈', label: 'AI Roles Growth', value: globalStats.avgGrowthRate, color: '#10b981' },
            { icon: '🔥', label: 'Hottest Skill', value: globalStats.topSkill2025, color: '#a855f7' },
            { icon: '🚀', label: 'Fastest Role', value: globalStats.fastestGrowingRole, color: '#f59e0b' },
            { icon: '🌐', label: 'Remote Roles', value: globalStats.remotePercentage, color: '#ec4899' },
            { icon: '💰', label: 'US Senior Avg', value: globalStats.avgSalaryUSA, color: '#10b981' },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '16px 14px',
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Skill Demand Chart */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>
            🔥 Global Skill Demand 2025
          </h2>
          <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px' }}>
            {skillDemand.slice(0, 12).map((s) => (
              <div key={s.skill} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{s.skill}</span>
                    <span style={{
                      padding: '1px 6px', borderRadius: 10, fontSize: 9, fontWeight: 600,
                      background: s.trend === 'Rising' ? 'rgba(16,185,129,0.15)' : s.trend === 'Declining' ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)',
                      color: s.trend === 'Rising' ? '#10b981' : s.trend === 'Declining' ? '#ef4444' : '#64748b',
                    }}>{s.trend === 'Rising' ? '↑' : s.trend === 'Declining' ? '↓' : '→'} {s.trend}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#64748b', minWidth: 30, textAlign: 'right' }}>{s.demand}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${s.demand}%`,
                    background: s.demand > 85 ? 'linear-gradient(90deg, #a855f7, #6366f1)' :
                      s.demand > 65 ? 'linear-gradient(90deg, #6366f1, #10b981)' :
                        'linear-gradient(90deg, #334155, #475569)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Job Titles */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>
            💼 Hot Job Titles 2025
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {hotJobTitles.slice(0, 6).map((job) => (
              <div key={job.title} style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: job.color, lineHeight: 1.3 }}>{job.title}</h3>
                  <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 9, fontWeight: 700, flexShrink: 0, marginLeft: 8,
                    background: 'rgba(16,185,129,0.15)', color: '#10b981',
                  }}>{job.growth}</span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{job.description}</p>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#a5b4fc', marginBottom: 8 }}>💰 {job.avgSalaryUSD}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {job.skills.slice(0, 3).map((sk) => (
                    <span key={sk} style={{
                      padding: '2px 7px', borderRadius: 8, fontSize: 10,
                      background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}33`,
                    }}>{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country Deep-Dive */}
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>
            🗺️ Country Deep-Dive
          </h2>

          {/* Region filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                  background: regionFilter === r ? '#6366f1' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${regionFilter === r ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                  color: regionFilter === r ? '#fff' : '#94a3b8',
                }}
              >{r}</button>
            ))}
          </div>

          <div className="jobs-country-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, alignItems: 'start' }}>
            {/* Country list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((c) => (
                <CountryCard
                  key={c.id}
                  country={c}
                  selected={selectedCountry.id === c.id}
                  onClick={() => { setSelectedCountry(c); setActiveTab('overview'); }}
                />
              ))}
            </div>

            {/* Country Detail */}
            <div style={{
              background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '24px',
            }}>
              {/* Country header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                <span style={{ fontSize: 44, flexShrink: 0 }}>{selectedCountry.flag}</span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>
                    {selectedCountry.name}
                  </h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11,
                      background: `${demandColor[selectedCountry.demand]}22`, color: demandColor[selectedCountry.demand],
                      border: `1px solid ${demandColor[selectedCountry.demand]}44`,
                    }}>📊 {selectedCountry.demand} Demand</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11,
                      background: `${remoteColor[selectedCountry.remoteAvailability]}22`, color: remoteColor[selectedCountry.remoteAvailability],
                      border: `1px solid ${remoteColor[selectedCountry.remoteAvailability]}44`,
                    }}>🌐 {selectedCountry.remoteAvailability} Remote</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11,
                      background: 'rgba(99,102,241,0.1)', color: '#a5b4fc',
                      border: '1px solid rgba(99,102,241,0.25)',
                    }}>💱 {selectedCountry.currency}</span>
                    {selectedCountry.avgOpenRoles && (
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11,
                        background: 'rgba(16,185,129,0.1)', color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.25)',
                      }}>🔍 {selectedCountry.avgOpenRoles}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
                {(['overview', 'salaries', 'insights', 'platforms'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, color: activeTab === tab ? '#6366f1' : '#64748b',
                      borderBottom: `2px solid ${activeTab === tab ? '#6366f1' : 'transparent'}`,
                      textTransform: 'capitalize',
                    }}
                  >{tab}</button>
                ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div>
                  <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                    {selectedCountry.outlook}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>🏙️ Top Cities</div>
                      {selectedCountry.topCities.map((city) => (
                        <div key={city} style={{ fontSize: 12, color: '#e2e8f0', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          📍 {city}
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>💼 Job Titles</div>
                      {selectedCountry.jobTitles.slice(0, 5).map((title) => (
                        <div key={title} style={{ fontSize: 11, color: '#94a3b8', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>🔥 Hot Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedCountry.hotSkills.map((skill) => (
                        <span key={skill} style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11,
                          background: 'rgba(168,85,247,0.1)', color: '#c084fc',
                          border: '1px solid rgba(168,85,247,0.25)',
                        }}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>🏅 Valued Certifications</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedCountry.certifications.map((cert) => (
                        <span key={cert} style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11,
                          background: 'rgba(245,158,11,0.1)', color: '#fbbf24',
                          border: '1px solid rgba(245,158,11,0.25)',
                        }}>{cert}</span>
                      ))}
                    </div>
                  </div>

                  {selectedCountry.visaInfo && (
                    <div style={{
                      marginTop: 16, padding: 14, borderRadius: 10,
                      background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
                    }}>
                      <div style={{ fontSize: 11, color: '#f87171', fontWeight: 600, marginBottom: 4 }}>✈️ Visa / Work Authorization</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{selectedCountry.visaInfo}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Salaries */}
              {activeTab === 'salaries' && (
                <div>
                  <div style={{ marginBottom: 12, fontSize: 12, color: '#64748b' }}>
                    Local currency ({selectedCountry.currency}) with USD equivalent. All figures are gross annual salary unless noted as /mo.
                  </div>
                  {[
                    { label: 'Junior QA Engineer (0–2 yrs)', local: selectedCountry.salaries.junior, usd: selectedCountry.salariesUSD.junior },
                    { label: 'Mid QA Engineer (2–5 yrs)', local: selectedCountry.salaries.mid, usd: selectedCountry.salariesUSD.mid },
                    { label: 'Senior QA Engineer (5+ yrs)', local: selectedCountry.salaries.senior, usd: selectedCountry.salariesUSD.senior },
                    { label: 'QA Lead / Test Manager', local: selectedCountry.salaries.lead, usd: selectedCountry.salariesUSD.lead },
                    { label: 'SDET / Automation Engineer', local: selectedCountry.salaries.sdet, usd: selectedCountry.salariesUSD.sdet },
                    { label: 'AI Quality Engineer', local: selectedCountry.salaries.aiEngineer, usd: selectedCountry.salariesUSD.aiEngineer },
                  ].map((row) => (
                    <SalaryRow key={row.label} {...row} />
                  ))}
                  <div style={{
                    marginTop: 16, padding: 12, borderRadius: 10,
                    background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                    fontSize: 11, color: '#94a3b8', lineHeight: 1.5,
                  }}>
                    💡 Salaries are approximate ranges. Total compensation (bonuses, equity, benefits) can be significantly higher at product companies vs. service companies. AI Quality Engineers command a 40–80% premium at AI-first companies.
                  </div>
                </div>
              )}

              {/* Tab: Insights */}
              {activeTab === 'insights' && (
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14, fontWeight: 600 }}>
                    📊 Market Intelligence — {selectedCountry.name}
                  </div>
                  {selectedCountry.marketInsights.map((insight, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, padding: '12px 0',
                      borderBottom: i < selectedCountry.marketInsights.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                        background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      }}>{i + 1}</div>
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{insight}</p>
                    </div>
                  ))}

                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>🏢 Top Employers</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedCountry.topCompanies.map((co) => (
                        <span key={co} style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11,
                          background: 'rgba(255,255,255,0.04)', color: '#e2e8f0',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}>{co}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Platforms */}
              {activeTab === 'platforms' && (
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14, fontWeight: 600 }}>
                    🔍 Where to Find QA Jobs in {selectedCountry.name}
                  </div>
                  {selectedCountry.hiringPlatforms.map((platform, i) => (
                    <div key={platform} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', marginBottom: 6,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{platform}</span>
                    </div>
                  ))}

                  <div style={{
                    marginTop: 20, padding: 14, borderRadius: 12,
                    background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)',
                  }}>
                    <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>💡 Job Search Tips for {selectedCountry.name}</div>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      <li style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>LinkedIn is effective in every country — optimise your profile with the hot skills listed above</li>
                      <li style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>Add your ISTQB badge to LinkedIn certifications — it increases profile views significantly</li>
                      <li style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>Target &quot;QA Engineer&quot;, &quot;Test Analyst&quot;, &quot;SDET&quot; and &quot;Automation Engineer&quot; job titles — the same role can have different names</li>
                      {selectedCountry.id === 'india' && <li style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>Naukri.com premium profile is worth the investment — most Indian HRs search here first</li>}
                      {selectedCountry.id === 'uk' && <li style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>CWJobs and JobServe are the UK-specific tech boards where most contract roles appear</li>}
                      {selectedCountry.id === 'poland' && <li style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>NoFluffJobs and JustJoin.it display salaries on the listing — use them to benchmark your ask</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
