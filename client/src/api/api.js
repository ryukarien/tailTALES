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

function apiDate(value) {
  return value ? String(value).slice(0, 10) : ''
}

function fromPet(pet) {
  return { ...pet, species: pet.species || 'Dogs', birthday: apiDate(pet.birthday), photo: pet.photo_url || '' }
}

function toPet(pet) {
  return { name: pet.name, species: pet.species, breed: pet.breed, birthday: pet.birthday || null, photoUrl: pet.photo || '' }
}

function fromDiaryEntry(entry) {
  return { id: entry.id, date: apiDate(entry.entry_date), title: entry.caption || '', story: entry.story || '', photo: entry.photo_url || '' }
}

function fromVetRecord(record) {
  return { id: record.id, date: apiDate(record.entry_date), title: record.vaccine, notes: record.notes || '' }
}

// My Pets — private, scoped server-side to whoever is signed in
export const fetchMyPets = async () => (await authFetch('/api/pets/mine')).map(fromPet)
export const addPet = async (pet) => fromPet(await authFetch('/api/pets', { method: 'POST', body: JSON.stringify(toPet(pet)) }))
export const updatePet = async (id, pet) => fromPet(await authFetch(`/api/pets/${id}`, { method: 'PUT', body: JSON.stringify(toPet(pet)) }))
export const deletePet = (id) => authFetch(`/api/pets/${id}`, { method: 'DELETE' })
export const setRehoming = (id, payload) => authFetch(`/api/pets/${id}/rehoming`, { method: 'PATCH', body: JSON.stringify(payload) })
export async function publishRehomingPet(pet, details) {
  await setRehoming(pet.id, {
    isRehoming: true,
    description: details.description,
    contact: details.contact,
  })
  return fetchRehomingPets()
}

// Diary & vet records — always nested under a pet, ownership checked server-side
export const fetchDiary = async (petId) => (await authFetch(`/api/pets/${petId}/diary`)).map(fromDiaryEntry)
export const addDiaryEntry = async (petId, entry) => fromDiaryEntry(await authFetch(`/api/pets/${petId}/diary`, {
  method: 'POST',
  body: JSON.stringify({ entryDate: entry.date, caption: entry.title, story: entry.story, photoUrl: entry.photo }),
}))
export const updateDiaryEntry = async (petId, entryId, entry) => fromDiaryEntry(await authFetch(`/api/pets/${petId}/diary/${entryId}`, {
  method: 'PUT',
  body: JSON.stringify({ entryDate: entry.date, caption: entry.title, story: entry.story, photoUrl: entry.photo }),
}))
export const deleteDiaryEntry = (petId, entryId) => authFetch(`/api/pets/${petId}/diary/${entryId}`, { method: 'DELETE' })
export const fetchVetRecords = async (petId) => (await authFetch(`/api/pets/${petId}/vet`)).map(fromVetRecord)
export const addVetRecord = async (petId, record) => fromVetRecord(await authFetch(`/api/pets/${petId}/vet`, {
  method: 'POST',
  body: JSON.stringify({ entryDate: record.date, vaccine: record.title, notes: record.notes }),
}))
export const updateVetRecord = async (petId, recordId, record) => fromVetRecord(await authFetch(`/api/pets/${petId}/vet/${recordId}`, {
  method: 'PUT',
  body: JSON.stringify({ entryDate: record.date, vaccine: record.title, notes: record.notes }),
}))
export const deleteVetRecord = (petId, recordId) => authFetch(`/api/pets/${petId}/vet/${recordId}`, { method: 'DELETE' })

// Rehoming board — public, no token needed, never returns diary/vet data
export const fetchRehomingPets = () => fetch(`${API_BASE}/api/pets/rehoming`).then((r) => r.json())