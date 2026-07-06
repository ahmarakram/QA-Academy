'use client';

import { useState } from 'react';
import { Bug } from '@/lib/capstone-scenarios';

interface Props {
  hiddenBugs: Bug[];
  foundBugIds: Set<string>;
  onBugFound: (bugId: string) => void;
}

type Role = 'admin' | 'manager' | 'viewer';
type Tenant = 'A' | 'B';

const tenantData: Record<Tenant, { id: number; name: string; email: string; company: string }[]> = {
  A: [
    { id: 1, name: 'Alice Johnson', email: 'alice@acme.com', company: 'Acme Corp' },
    { id: 2, name: 'Bob Smith', email: 'bob@acme.com', company: 'Acme Corp' },
    { id: 3, name: 'Carol White', email: 'carol@acme.com', company: 'Acme Corp' },
  ],
  B: [
    { id: 4, name: 'David Lee', email: 'david@globex.com', company: 'Globex Inc' },
    { id: 5, name: 'Emma Chen', email: 'emma@globex.com', company: 'Globex Inc' },
  ],
};

const auditLog: { action: string; user: string; time: string }[] = [];

export function SaasApp({ hiddenBugs, foundBugIds, onBugFound }: Props) {
  const [role, setRole] = useState<Role>('viewer');
  const [tenant, setTenant] = useState<Tenant>('A');
  const [page, setPage] = useState<'contacts' | 'settings' | 'billing' | 'audit'>('contacts');
  const [notification, setNotification] = useState<{ msg: string; type: 'bug' | 'success' | 'error' } | null>(null);
  const [log, setLog] = useState<typeof auditLog>([]);
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const notify = (msg: string, type: 'bug' | 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const addLog = (action: string) => {
    setLog(prev => [{ action, user: `${role}@tenant${tenant}.com`, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleEdit = (contactId: number) => {
    if (role === 'viewer') {
      // Bug6: Edit button visible for viewer but silent failure
      onBugFound('bug6');
      notify('🐛 Bug found: Edit button visible for Viewer, click fails silently!', 'bug');
      return;
    }
    notify(`Contact #${contactId} saved`, 'success');
    addLog(`Edited contact #${contactId}`);
  };

  const handleDelete = (contactId: number) => {
    if (role === 'viewer' || role === 'manager') {
      notify('Access denied — insufficient permissions', 'error');
      return;
    }
    // Bug4: No confirmation dialog
    onBugFound('bug4');
    notify('🐛 Bug found: User deleted with no confirmation dialog!', 'bug');
    setDeletedIds(prev => [...prev, contactId]);
    addLog(`Deleted contact #${contactId}`);
  };

  const handleBillingAccess = () => {
    if (role === 'manager') {
      // Bug3: Manager can access billing
      onBugFound('bug3');
      notify('🐛 Bug found: Manager role accessed Billing settings!', 'bug');
      setPage('billing');
    } else if (role === 'admin') {
      setPage('billing');
    } else {
      notify('Access denied', 'error');
    }
  };

  const handleExport = () => {
    // Bug5: Audit log not created for exports
    notify('Contacts exported to CSV', 'success');
    // Intentionally NOT adding to audit log
    onBugFound('bug5');
    notify('🐛 Bug found: Export not recorded in audit log!', 'bug');
  };

  const handleApiCall = (method: string, endpoint: string, useViewerToken: boolean) => {
    if (method === 'DELETE' && useViewerToken) {
      // Bug2: Viewer can delete via direct API call
      onBugFound('bug2');
      setApiResult(`HTTP 200 OK\n{\n  "success": true,\n  "message": "Record deleted",\n  "id": 1\n}`);
      notify('🐛 Bug found: Viewer token can call DELETE endpoint!', 'bug');
    } else if (method === 'GET' && useViewerToken) {
      setApiResult(`HTTP 200 OK\n{\n  "contacts": [...]\n}`);
    } else {
      setApiResult(`HTTP 403 Forbidden\n{\n  "error": "Insufficient permissions"\n}`);
    }
  };

  // Bug1: Tenant isolation broken — tenant B sees tenant A contacts
  const visibleContacts = (page === 'contacts' && tenant === 'B')
    ? [...tenantData.B, ...tenantData.A] // Bug: should only show B
    : tenantData[tenant];

  const firstContactLoad = tenant === 'B' && page === 'contacts';
  if (firstContactLoad && !foundBugIds.has('bug1')) {
    setTimeout(() => {
      onBugFound('bug1');
    }, 500);
  }

  return (
    <div style={{ display: 'flex', height: 600, fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 100,
          padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: notification.type === 'bug' ? '#dc2626' : notification.type === 'error' ? '#b91c1c' : '#16a34a',
          color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', maxWidth: 360,
        }}>{notification.msg}</div>
      )}

      {/* Sidebar */}
      <div style={{ width: 200, background: '#1e293b', color: '#e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>☁️ CloudDesk</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>CRM Platform</div>
        </div>

        {/* Role & Tenant Switcher (Test tool) */}
        <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>🧪 Test Controls</div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Role</div>
            <select value={role} onChange={e => setRole(e.target.value as Role)} style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '4px 6px', color: '#e2e8f0', fontSize: 12 }}>
              <option value="viewer">Viewer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Tenant</div>
            <select value={tenant} onChange={e => { setTenant(e.target.value as Tenant); setPage('contacts'); }} style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '4px 6px', color: '#e2e8f0', fontSize: 12 }}>
              <option value="A">Tenant A (Acme Corp)</option>
              <option value="B">Tenant B (Globex)</option>
            </select>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 8px', flex: 1 }}>
          {[
            { key: 'contacts', label: '👥 Contacts', onClick: () => setPage('contacts') },
            { key: 'settings', label: '⚙️ Settings', onClick: () => setPage('settings') },
            { key: 'billing', label: '💳 Billing', onClick: handleBillingAccess },
            { key: 'audit', label: '📋 Audit Log', onClick: () => setPage('audit') },
          ].map(item => (
            <button key={item.key} onClick={item.onClick} style={{
              width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 2,
              background: page === item.key ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: `1px solid ${page === item.key ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
              borderRadius: 6, color: page === item.key ? '#a5b4fc' : '#94a3b8',
              fontSize: 12, cursor: 'pointer',
            }}>{item.label}</button>
          ))}

          <button onClick={() => setShowApiPanel(!showApiPanel)} style={{
            width: '100%', textAlign: 'left', padding: '8px 10px', marginTop: 8,
            background: showApiPanel ? 'rgba(239,68,68,0.2)' : 'transparent',
            border: `1px solid ${showApiPanel ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 6, color: showApiPanel ? '#ef4444' : '#64748b',
            fontSize: 12, cursor: 'pointer',
          }}>🔌 API Test Panel</button>
        </nav>

        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#334155' }}>
          Logged in as: <span style={{ color: role === 'admin' ? '#10b981' : role === 'manager' ? '#f59e0b' : '#94a3b8' }}>{role}</span>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* API Test Panel */}
        {showApiPanel && (
          <div style={{ padding: 16, background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>🔌 API Test Panel</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <button onClick={() => handleApiCall('GET', '/api/records/1', true)} style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, color: '#a5b4fc', fontSize: 11, cursor: 'pointer' }}>
                GET /api/records/1 (Viewer token)
              </button>
              <button onClick={() => handleApiCall('DELETE', '/api/records/1', true)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>
                DELETE /api/records/1 (Viewer token)
              </button>
              <button onClick={() => handleApiCall('DELETE', '/api/records/1', false)} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6, color: '#10b981', fontSize: 11, cursor: 'pointer' }}>
                DELETE /api/records/1 (Admin token)
              </button>
            </div>
            {apiResult && (
              <pre style={{ background: '#1e293b', padding: '10px 14px', borderRadius: 8, color: '#94a3b8', fontSize: 11, margin: 0, whiteSpace: 'pre-wrap' }}>{apiResult}</pre>
            )}
          </div>
        )}

        {/* Contacts page */}
        {page === 'contacts' && (
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#1e293b' }}>Contacts — Tenant {tenant}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {tenant === 'B' && (
                  <div style={{ padding: '4px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, color: '#dc2626' }}>
                    ⚠️ Showing {visibleContacts.length} contacts (expected {tenantData.B.length})
                  </div>
                )}
                <button onClick={handleExport} style={{ padding: '6px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#475569' }}>
                  Export CSV
                </button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Name', 'Email', 'Company', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleContacts.filter(c => !deletedIds.includes(c.id)).map((contact, i) => (
                  <tr key={contact.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>#{contact.id}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{contact.name}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{contact.email}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{contact.company}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {/* Bug6: Edit visible for Viewer */}
                        <button onClick={() => handleEdit(contact.id)} style={{ padding: '4px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, fontSize: 11, cursor: 'pointer', color: '#1d4ed8' }}>Edit</button>
                        {(role === 'admin') && (
                          <button onClick={() => handleDelete(contact.id)} style={{ padding: '4px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, fontSize: 11, cursor: 'pointer', color: '#dc2626' }}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings page */}
        {page === 'settings' && (
          <div style={{ padding: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#1e293b' }}>Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Display Name', value: `Tenant ${tenant} Workspace` }, { label: 'Timezone', value: 'UTC+0' }, { label: 'Language', value: 'English (US)' }].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: '#334155' }}>{s.label}</span>
                  <input defaultValue={s.value} disabled={role === 'viewer'} style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', color: '#1e293b', background: role === 'viewer' ? '#f8fafc' : '#fff' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing page */}
        {page === 'billing' && (
          <div style={{ padding: 20 }}>
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
              ⚠️ This page should only be accessible to Admin role
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#1e293b' }}>Billing Settings</h2>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Current Plan: <strong style={{ color: '#1e293b' }}>Pro — $299/mo</strong></div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Payment Method: <strong>Visa ending in 4242</strong></div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Next billing date: August 1, 2025</div>
            </div>
          </div>
        )}

        {/* Audit log page */}
        {page === 'audit' && (
          <div style={{ padding: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#1e293b' }}>Audit Log</h2>
            {log.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div>No audit events recorded yet</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Try exporting contacts as Manager — check if it appears here</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {log.map((entry, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', gap: 16, fontSize: 12 }}>
                    <span style={{ color: '#64748b', flexShrink: 0 }}>{entry.time}</span>
                    <span style={{ color: '#6366f1', flexShrink: 0 }}>{entry.user}</span>
                    <span style={{ color: '#1e293b' }}>{entry.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
