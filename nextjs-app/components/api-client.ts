// API Client for VibeLocal
// Works with both local dev (proxy) and production

// Use relative URL to leverage Next.js proxy in dev
const API_BASE = ''

export interface EmergencyInput {
  user_input: string
  location?: string
  lat?: number
  lng?: number
}

export interface Place {
  name: string
  type: string
  distance: string
  action: string
  contact: string
  note: string
  place_id?: string
  lat?: number
  lng?: number
  address?: string
  maps_url?: string
  directions_url?: string
}

export interface EmergencyResponse {
  emergency_id: string
  category: string
  urgency_level: string
  summary: string
  recommended_places: Place[]
  emergency_action: {
    suggested_step: string
    call_to_action: string
    share_location_message: string
  }
  timestamp: string
  location?: {
    lat: number
    lng: number
    address?: string
  }
  google_maps_enabled?: boolean
}

export async function analyzeEmergency(input: EmergencyInput): Promise<EmergencyResponse> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error('Failed to analyze emergency')
  }

  return response.json()
}

export async function updateLocation(emergencyId: string, lat: number, lng: number) {
  const response = await fetch(`${API_BASE}/api/location/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emergency_id: emergencyId,
      lat,
      lng,
    }),
  })

  return response.json()
}

export async function sendChatMessage(emergencyId: string, message: string, sender: string = 'user') {
  const response = await fetch(`${API_BASE}/api/emergency/${emergencyId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emergency_id: emergencyId,
      sender,
      message,
    }),
  })

  return response.json()
}

export function createWebSocket(clientId: string): WebSocket {
  const wsUrl = `${API_BASE.replace('http', 'ws')}/ws/${clientId}`
  return new WebSocket(wsUrl)
}

// Dashboard API
export async function getDashboardStats() {
  const response = await fetch(`${API_BASE}/api/dashboard/stats`)
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  return response.json()
}

export async function getAllLocations() {
  const response = await fetch(`${API_BASE}/api/dashboard/locations`)
  if (!response.ok) {
    throw new Error('Failed to fetch locations')
  }
  return response.json()
}
