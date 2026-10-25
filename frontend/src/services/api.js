// GovVerify Client API Service Layer
// Communicates with the backend REST API via the Vite proxy (/api).

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const error = new Error(errData.message || `API error ${res.status}`);
    error.status = res.status;
    error.code = errData.code;
    throw error;
  }

  return await res.json();
}

export const api = {
  // Health
  checkHealth: async () => {
    return await request('/health');
  },

  // Synthetic demo session. This is not production authentication.
  createDemoSession: async ({ role, region } = {}) => {
    const res = await request('/auth/demo-session', {
      method: 'POST',
      body: JSON.stringify({ role, region })
    });
    return res.data;
  },

  getDemoSession: async () => {
    const res = await request('/auth/demo-session');
    return res.data;
  },

  // Applications
  getApplications: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const url = `/applications${qs ? `?${qs}` : ''}`;
    const res = await request(url);
    return res.data;
  },

  getApplication: async (id) => {
    if (!id) throw new Error('Application ID is required.');
    const res = await request(`/applications/${encodeURIComponent(id)}`);
    return res.data;
  },

  advanceApplication: async (id, { remarks, actor } = {}) => {
    const res = await request(`/applications/${id}/advance`, {
      method: 'POST',
      body: JSON.stringify({ remarks, actor })
    });
    return res ? res.data : null;
  },

  revertDeficiency: async (id, { clause, description, daysToCure, actor } = {}) => {
    const res = await request(`/applications/${id}/revert`, {
      method: 'POST',
      body: JSON.stringify({ clause, description, daysToCure, actor })
    });
    return res ? res.data : null;
  },

  submitDeficiencyRemedy: async (id, defId, { responseText, fileName, actor } = {}) => {
    const res = await request(`/applications/${id}/deficiency/${defId}/remedy`, {
      method: 'POST',
      body: JSON.stringify({ responseText, fileName, actor })
    });
    return res ? res.data : null;
  },

  // Undertakings
  getUndertakings: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const url = `/undertakings${qs ? `?${qs}` : ''}`;
    const res = await request(url);
    return res ? res.data : null;
  },

  submitUndertakingEvidence: async (id, { fileName, remarks, actor } = {}) => {
    const res = await request(`/undertakings/${id}/evidence`, {
      method: 'POST',
      body: JSON.stringify({ fileName, remarks, actor })
    });
    return res ? res.data : null;
  },

  verifyUndertaking: async (id, { approved, remarks, actor } = {}) => {
    const res = await request(`/undertakings/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ approved, remarks, actor })
    });
    return res ? res.data : null;
  },

  // Leases
  getLeases: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const url = `/leases${qs ? `?${qs}` : ''}`;
    const res = await request(url);
    return res ? res.data : null;
  },

  renewLease: async (docNo, { newExpiryDate, fileName, actor } = {}) => {
    const res = await request(`/leases/${encodeURIComponent(docNo)}/renew`, {
      method: 'POST',
      body: JSON.stringify({ newExpiryDate, fileName, actor })
    });
    return res ? res.data : null;
  },

  // EVC
  getExperts: async () => {
    const res = await request('/evc/experts');
    return res ? res.data : null;
  },

  scheduleEVC: async ({ applicationId, expertIds, visitDate, actor } = {}) => {
    const res = await request('/evc/schedule', {
      method: 'POST',
      body: JSON.stringify({ applicationId, expertIds, visitDate, actor })
    });
    return res ? res.data : null;
  },

  uploadEVCReport: async (appId, { outcome, fileName, remarks, actor } = {}) => {
    const res = await request(`/evc/${appId}/report`, {
      method: 'POST',
      body: JSON.stringify({ outcome, fileName, remarks, actor })
    });
    return res ? res.data : null;
  },

  // Escalations
  getEscalations: async () => {
    const res = await request('/escalations');
    return res ? res.data : null;
  },

  // Regional Analytics
  getRegions: async () => {
    const res = await request('/regions');
    return res ? res.data : null;
  },

  // Integrations
  getIntegrations: async () => {
    const res = await request('/integrations');
    return res ? res.data : null;
  },

  syncIntegration: async (id) => {
    const res = await request(`/integrations/${id}/sync`, { method: 'POST' });
    return res ? res.data : null;
  },

  // Reports
  getNationalSummary: async () => {
    const res = await request('/reports/summary');
    return res ? res.data : null;
  },

  // Auth / Roles
  getRoles: async () => {
    const res = await request('/auth/roles');
    return res ? res.data : null;
  }
};
