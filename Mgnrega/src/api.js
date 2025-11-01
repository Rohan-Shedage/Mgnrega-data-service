// Simple API abstraction. Configure VITE_API_BASE_URL in Vercel or .env
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchDistricts() {
  try {
    return await fetchJSON(`${BASE}/districts`);
  } catch (e) {
    // fallback: return a small UP district list (same as built-in sample)
    return [
      { id: 'lucknow', name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
      { id: 'kanpur', name: 'Kanpur Nagar', lat: 26.4499, lng: 80.3319 },
      { id: 'agra', name: 'Agra', lat: 27.1767, lng: 78.0081 },
      { id: 'varanasi', name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
      { id: 'prayagraj', name: 'Prayagraj', lat: 25.4358, lng: 81.8463 }
    ];
  }
}

export async function fetchDistrictData(districtId) {
  try {
    return await fetchJSON(`${BASE}/districts/${encodeURIComponent(districtId)}`);
  } catch (e) {
    // fallback: generate mock data similar to original component
    const base = districtId.charCodeAt(0) * 1000;
    return {
      current: {
        month: 'October 2025',
        households: base + 45000,
        personDays: (base + 45000) * 15,
        activeWorks: Math.floor((base + 45000) / 500),
        completedWorks: Math.floor((base + 45000) / 300),
        expenditure: ((base + 45000) * 15 * 250) / 10000000,
        avgWage: 245 + (base % 50),
        womenParticipation: 48 + (base % 15),
        performanceScore: 75 + (base % 20),
        lastUpdated: 'Oct 28, 2025'
      },
      historical: [
        { month: 'May', households: base + 52000, score: 82 },
        { month: 'Jun', households: base + 48000, score: 78 },
        { month: 'Jul', households: base + 50000, score: 80 },
        { month: 'Aug', households: base + 46000, score: 76 },
        { month: 'Sep', households: base + 44000, score: 74 },
        { month: 'Oct', households: base + 45000, score: 75 }
      ]
    };
  }
}
