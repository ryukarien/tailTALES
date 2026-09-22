import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { listDogBreeds, randomDogImage } from './api/dogApi'

const seed = {
  pets: [
    { id: 'pet-1', name: 'Biscuit', breed: 'golden retriever', birthday: '2021-04-12', photo: 'https://images.dog.ceo/breeds/retriever-golden/GoldenRetriever.jpg' },
    { id: 'pet-2', name: 'Mochi', breed: 'pomeranian', birthday: '2022-09-03', photo: 'https://images.dog.ceo/breeds/pomeranian/n02112018_101.jpg' },
    { id: 'pet-3', name: 'Nala', breed: 'beagle', birthday: '2020-11-28', photo: 'https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg' },
  ],
  diary: [
    { id: 'memory-1', petId: 'pet-1', date: '2026-06-21', caption: 'Biscuit discovered the best sunny spot in the garden.', photo: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg' },
    { id: 'memory-2', petId: 'pet-1', date: '2026-05-14', caption: 'A very serious walk, followed by a very unserious nap.', photo: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg' },
  ],
  vet: [{ id: 'vet-1', petId: 'pet-1', date: '2026-04-08', vaccine: 'Annual booster', notes: 'Healthy and happy. Next check-up in one year.' }],
  posts: [
    { id: 'post-1', petId: 'pet-2', name: 'Mochi', birthday: '2022-09-03', photo: 'https://images.dog.ceo/breeds/pomeranian/n02112018_101.jpg', description: 'A gentle little companion looking for a patient, loving home.', contact: 'hello@tailtales.example', ownerUid: 'demo' },
    { id: 'post-2', petId: 'pet-3', name: 'Nala', birthday: '2020-11-28', photo: 'https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg', description: 'Curious, cuddly, and always ready for a new adventure.', contact: 'hello@tailtales.example', ownerUid: 'demo' },
  ],
}

function useStore() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('tailtales-data')
    return saved ? JSON.parse(saved) : seed
  })
  useEffect(() => localStorage.setItem('tailtales-data', JSON.stringify(data)), [data])
  return [data, setData]
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function asset(name) {
  return `${import.meta.env.BASE_URL}assets/${name}`
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function Logo() {
  return <a className="logo" href="/" onClick={(event) => { event.preventDefault(); history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}><img src={asset('tailtales_logo.png')} alt="tailTALES" /></a>
}

function Nav({ path, user, onLogin }) {
  const go = (event, href) => { event.preventDefault(); history.pushState({}, '', href); window.dispatchEvent(new PopStateEvent('popstate')) }
  return <header className="topbar"><Logo /><nav><a className={path === '/' ? 'active' : ''} href="/" onClick={(event) => go(event, '/')}> <img src={asset('paw_pet.png')} alt="" /> <span>My pets</span></a><a className={path === '/rehoming' ? 'active' : ''} href="/rehoming" onClick={(event) => go(event, '/rehoming')}> <img src={asset('rehome_logo.png')} alt="" /> <span>Rehoming</span></a></nav>{user ? <button className="signout" onClick={() => signOut(auth)}>Sign out</button> : <button className="signout" onClick={onLogin}>Sign in</button>}</header>
}

function Login({ onLogin, error }) {
  return <main className="login"><div className="brand-lockup"><img src={asset('tailtales_logo.png')} alt="tailTALES" /><p>Your pet's memories, care, and stories in one place.</p></div><button className="google-button" onClick={onLogin}><img src={asset('google_logo.png')} alt="" /> Sign in with Google</button>{error && <p className="login-error">{error}</p>}</main>
}

function PetCard({ pet, onOpen }) {
  return <button className="pet-card" onClick={() => onOpen(pet.id)}><img src={pet.photo} alt="" /><div className="pet-card-copy"><h2>{pet.name}</h2><em>{pet.breed}</em><p>Birthday: <strong>{formatDate(pet.birthday)}</strong></p></div></button>
}

function AddPet({ breeds, onAdd }) {
  const [form, setForm] = useState({ name: '', breed: '', birthday: '', photo: '' })
  const update = (key, value) => setForm({ ...form, [key]: value })
  async function choosePhoto(event) { const file = event.target.files?.[0]; if (file) update('photo', await fileToDataUrl(file)) }
  async function submit(event) { event.preventDefault(); if (!form.name || !form.breed) return; const photo = form.photo || await randomDogImage(form.breed); onAdd({ ...form, photo, id: crypto.randomUUID() }); setForm({ name: '', breed: '', birthday: '', photo: '' }) }
  return <form className="surface add-pet" onSubmit={submit}><h2>Add a pet</h2><div className="form-grid"><label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label><label>Breed<select value={form.breed} onChange={(e) => update('breed', e.target.value)} required><option value="">Choose a breed</option>{breeds.map((breed) => <option key={breed}>{breed}</option>)}</select></label><label>Birthday<input type="date" value={form.birthday} onChange={(e) => update('birthday', e.target.value)} /></label><label>Upload photo <span className="optional">(optional)</span><input type="file" accept="image/*" onChange={choosePhoto} /></label></div><button className="primary" type="submit">Save pet</button></form>
}

function Pets({ data, setData, breeds, openPet }) {
  const addPet = (pet) => setData({ ...data, pets: [...data.pets, pet] })
  return <><section className="intro"><p className="eyebrow">YOUR PRIVATE PET DIARY</p><h1>My pets</h1><p>Every memory and vet visit, together in one place. Pick a pet to open their diary.</p></section><div className="pet-grid">{data.pets.map((pet) => <PetCard key={pet.id} pet={pet} onOpen={openPet} />)}</div>{data.pets.length === 0 && <div className="empty">No pets yet. Add your first companion below.</div>}<AddPet breeds={breeds} onAdd={addPet} /></>
}

function Diary({ data, setData, pet, goRehome }) {
  const [tab, setTab] = useState('diary'); const [form, setForm] = useState({ date: '', caption: '', photo: '', vaccine: '', notes: '' })
  const update = (key, value) => setForm({ ...form, [key]: value })
  function submit(event) { event.preventDefault(); if (tab === 'diary') setData({ ...data, diary: [{ ...form, id: crypto.randomUUID(), petId: pet.id }, ...data.diary] }); else setData({ ...data, vet: [{ ...form, id: crypto.randomUUID(), petId: pet.id }, ...data.vet] }); setForm({ date: '', caption: '', photo: '', vaccine: '', notes: '' }) }
  const entries = tab === 'diary' ? data.diary.filter((item) => item.petId === pet.id) : data.vet.filter((item) => item.petId === pet.id)
  async function choosePhoto(event) { const file = event.target.files?.[0]; if (file) update('photo', await fileToDataUrl(file)) }
  return <><button className="back-link" onClick={() => window.history.back()}>← All pets</button><section className="pet-hero"><img src={pet.photo} alt="" /><div><h1>{pet.name}</h1><em>{pet.breed}</em><p>Birthday: <strong>{formatDate(pet.birthday)}</strong></p></div><div className="hero-actions"><button className="outline">Edit</button><button className="outline danger">Delete</button><button className="primary" onClick={goRehome}>Rehome this pet</button></div></section><div className="tabs"><button className={tab === 'diary' ? 'selected' : ''} onClick={() => setTab('diary')}>Diary</button><button className={tab === 'vet' ? 'selected' : ''} onClick={() => setTab('vet')}>Vet records</button></div><div className="diary-layout"><form className="surface entry-form" onSubmit={submit}><h2>{tab === 'diary' ? 'New memory' : 'New vet record'}</h2>{tab === 'diary' ? <><label>Upload photo <span className="optional">(optional)</span><input type="file" accept="image/*" onChange={choosePhoto} /></label><label>Caption<textarea value={form.caption} onChange={(e) => update('caption', e.target.value)} rows="3" /></label></> : <><label>Vaccine<input value={form.vaccine} onChange={(e) => update('vaccine', e.target.value)} required /></label><label>Notes<textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows="3" /></label></>}<label>Date<input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required /></label><button className="primary" type="submit">{tab === 'diary' ? 'Add to diary' : 'Add record'}</button></form><div className="entries">{entries.length === 0 ? <div className="empty">Nothing here yet. Add the first {tab === 'diary' ? 'memory' : 'record'}.</div> : entries.map((entry) => tab === 'diary' ? <article className="memory" key={entry.id}>{entry.photo && <img src={entry.photo} alt="" />}<div><strong>{entry.caption || 'A new memory'}</strong><em>{formatDate(entry.date)}</em><p>{entry.caption}</p></div></article> : <article className="vet-record" key={entry.id}><div className="record-icon">✚</div><div><strong>{entry.vaccine}</strong><em>{formatDate(entry.date)}</em><p>{entry.notes}</p></div></article>)}</div></div></>
}

function Rehoming({ data, setData, user }) {
  const [form, setForm] = useState({ petId: '', description: '', contact: '' })
  function submit(event) { event.preventDefault(); const pet = data.pets.find((item) => item.id === form.petId); if (!pet) return; setData({ ...data, posts: [{ ...pet, ...form, id: crypto.randomUUID(), ownerUid: user.uid }, ...data.posts] }); setForm({ petId: '', description: '', contact: '' }) }
  function remove(id) { if (window.confirm('Remove this rehoming post?')) setData({ ...data, posts: data.posts.filter((post) => post.id !== id) }) }
  return <><section className="intro"><p className="eyebrow">A NEW CHAPTER</p><h1>Rehoming</h1><p>Contact details in a post are visible to everyone.</p></section>{user ? <form className="surface rehome-form" onSubmit={submit}><h2>Post a pet for rehoming</h2><div className="form-grid"><select value={form.petId} onChange={(e) => setForm({ ...form, petId: e.target.value })} required><option value="">Which pet will you rehome?</option>{data.pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select><input placeholder="Description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /><input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required /><button className="primary" type="submit">Publish post</button></div></form> : <p className="public-note">Browse freely. Sign in to publish a rehoming post.</p>}<div className="post-grid">{data.posts.map((post) => <article className="post-card" key={post.id}><img src={post.photo} alt="" />{user && post.ownerUid === user.uid && <button className="remove" aria-label="Remove post" onClick={() => remove(post.id)}><img src={asset('x.png')} alt="" /></button>}<p>Birthday: {formatDate(post.birthday)}</p><h2>Hello, I’m {post.name}</h2><a href={`mailto:${post.contact}`}>Contact: {post.contact}</a><span>{post.description}</span></article>)}</div></>
}

export default function App() {
  const [user, setUser] = useState(undefined); const [loginError, setLoginError] = useState(''); const [path, setPath] = useState(window.location.pathname); const [data, setData] = useStore(); const [breeds, setBreeds] = useState([])
  useEffect(() => onAuthStateChanged(auth, setUser), [])
  useEffect(() => { listDogBreeds().then(setBreeds).catch(() => setBreeds(['golden retriever', 'beagle', 'pomeranian', 'labrador'])); const update = () => setPath(window.location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update) }, [])
  async function login() { try { setLoginError(''); await signInWithPopup(auth, googleProvider) } catch (error) { setLoginError(error.message.includes('api-key') ? 'Add your Firebase VITE_ values to client/.env.local to enable Google sign-in.' : 'Google sign-in was cancelled or unavailable.') } }
  if (user === undefined) return <div className="loading">Loading tailTALES...</div>
  if (!user && path !== '/rehoming') return <Login onLogin={login} error={loginError} />
  const petId = path.match(/^\/pets\/(.+)$/)?.[1]; const pet = data.pets.find((item) => item.id === petId)
  return <><Nav path={path} user={user} onLogin={login} /><main className="page">{path === '/' && <Pets data={data} setData={setData} breeds={breeds} openPet={(id) => { history.pushState({}, '', `/pets/${id}`); setPath(`/pets/${id}`) }} />}{pet && <Diary data={data} setData={setData} pet={pet} goRehome={() => { history.pushState({}, '', '/rehoming'); setPath('/rehoming') }} />}{path === '/rehoming' && <Rehoming data={data} setData={setData} user={user} />}</main></>
}

