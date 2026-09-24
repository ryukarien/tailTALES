import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../authMiddleware.js'

export const petsRouter = Router()

// "My Pets" — always scoped to the signed-in uid. There is no endpoint that
// returns all pets, so there's nothing for a client to even mis-call.
petsRouter.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `select * from pets where owner_uid = $1 order by created_at desc`,
    [req.uid]
  )
  res.json(rows)
})

petsRouter.post('/', requireAuth, async (req, res) => {
  const { name, breed, birthday, photoUrl } = req.body
  if (!name || !breed) return res.status(400).json({ error: 'name and breed are required' })
  const { rows } = await pool.query(
    `insert into pets (owner_uid, name, breed, birthday, photo_url)
     values ($1, $2, $3, $4, $5) returning *`,
    [req.uid, name, breed, birthday || null, photoUrl || null]
  )
  res.status(201).json(rows[0])
})

// Ownership check lives in the WHERE clause, not in a separate "is this
// theirs?" query — that way there's no gap where someone could race the two
// checks. If the row doesn't match, we can't tell the caller "wrong owner"
// vs "doesn't exist" without leaking which IDs are real, so both are 404.
petsRouter.put('/:id', requireAuth, async (req, res) => {
  const { name, breed, birthday, photoUrl } = req.body
  const { rows } = await pool.query(
    `update pets set name = $1, breed = $2, birthday = $3, photo_url = $4
     where id = $5 and owner_uid = $6 returning *`,
    [name, breed, birthday || null, photoUrl || null, req.params.id, req.uid]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Pet not found' })
  res.json(rows[0])
})

petsRouter.delete('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `delete from pets where id = $1 and owner_uid = $2 returning id`,
    [req.params.id, req.uid]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Pet not found' })
  res.status(204).end()
})

// Marking a pet for rehoming is still an owner-only action.
petsRouter.patch('/:id/rehoming', requireAuth, async (req, res) => {
  const { isRehoming, description, contact } = req.body
  const { rows } = await pool.query(
    `update pets set is_rehoming = $1, rehoming_description = $2, rehoming_contact = $3
     where id = $4 and owner_uid = $5 returning *`,
    [!!isRehoming, description || null, contact || null, req.params.id, req.uid]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Pet not found' })
  res.json(rows[0])
})

// Public. No auth required, and the query only ever touches pets marked
// is_rehoming — diary_entries and vet_records are never joined in here, so
// there's no way for this endpoint to leak them even by accident.
petsRouter.get('/rehoming', async (_req, res) => {
  const { rows } = await pool.query(
    `select id, owner_uid, name, breed, birthday, photo_url,
            rehoming_description, rehoming_contact
     from pets where is_rehoming = true order by created_at desc`
  )
  // owner_uid is included so the client can show a delete button to the
  // owner — the DELETE route above re-checks ownership regardless, so
  // exposing this id isn't a security hole, just a UI convenience.
  res.json(rows)
})