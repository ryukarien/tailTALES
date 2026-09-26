import { auth } from '../firebase'

const API_BASE = import.meta.env.VITE_API_BASE || '' // e.g. https://tailtales-api.onrender.com

async function authFetch(path, options = {}) {
  const token = await auth.currentUser?.getIdToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`)
  return res.status === 204 ? null : res.json()
}

// My Pets — private, scoped server-side to whoever is signed in
export const fetchMyPets = () => authFetch('/api/pets/mine')
export const addPet = (pet) => authFetch('/api/pets', { method: 'POST', body: JSON.stringify(pet) })
export const updatePet = (id, pet) => authFetch(`/api/pets/${id}`, { method: 'PUT', body: JSON.stringify(pet) })
export const deletePet = (id) => authFetch(`/api/pets/${id}`, { method: 'DELETE' })
export const setRehoming = (id, payload) => authFetch(`/api/pets/${id}/rehoming`, { method: 'PATCH', body: JSON.stringify(payload) })
export async function publishRehomingPet(pet, details) {
  const createdPet = await addPet({
    name: pet.name,
    breed: pet.breed,
    birthday: pet.birthday,
    photoUrl: pet.photo,
  })
  await setRehoming(createdPet.id, {
    isRehoming: true,
    description: details.description,
    contact: details.contact,
  })
  return fetchRehomingPets()
}

// Diary & vet records — always nested under a pet, ownership checked server-side
export const fetchDiary = (petId) => authFetch(`/api/pets/${petId}/diary`)
export const addDiaryEntry = (petId, entry) => authFetch(`/api/pets/${petId}/diary`, { method: 'POST', body: JSON.stringify(entry) })
export const fetchVetRecords = (petId) => authFetch(`/api/pets/${petId}/vet`)
export const addVetRecord = (petId, record) => authFetch(`/api/pets/${petId}/vet`, { method: 'POST', body: JSON.stringify(record) })

// Rehoming board — public, no token needed, never returns diary/vet data
export const fetchRehomingPets = () => fetch(`${API_BASE}/api/pets/rehoming`).then((r) => r.json())