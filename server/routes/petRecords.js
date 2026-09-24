import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../authMiddleware.js'

export const petRecordsRouter = Router({ mergeParams: true })

// Every route here is mounted under /api/pets/:petId/... . Before touching
// diary_entries or vet_records we confirm the pet itself belongs to the
// caller — this single check is what was missing before and let anyone see
// anyone's diary just by knowing (or guessing) a petId.
async function assertOwnsPet(petId, uid) {
  const { rows } = await pool.query(`select id from pets where id = $1 and owner_uid = $2`, [petId, uid])
  return rows.length > 0
}

petRecordsRouter.get('/diary', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) return res.status(404).json({ error: 'Pet not found' })
  const { rows } = await pool.query(
    `select * from diary_entries where pet_id = $1 order by entry_date desc`,
    [req.params.petId]
  )
  res.json(rows)
})

petRecordsRouter.post('/diary', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) return res.status(404).json({ error: 'Pet not found' })
  const { entryDate, caption, photoUrl } = req.body
  const { rows } = await pool.query(
    `insert into diary_entries (pet_id, entry_date, caption, photo_url)
     values ($1, $2, $3, $4) returning *`,
    [req.params.petId, entryDate, caption || null, photoUrl || null]
  )
  res.status(201).json(rows[0])
})

petRecordsRouter.get('/vet', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) return res.status(404).json({ error: 'Pet not found' })
  const { rows } = await pool.query(
    `select * from vet_records where pet_id = $1 order by entry_date desc`,
    [req.params.petId]
  )
  res.json(rows)
})

petRecordsRouter.post('/vet', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) return res.status(404).json({ error: 'Pet not found' })
  const { entryDate, vaccine, notes } = req.body
  if (!vaccine) return res.status(400).json({ error: 'vaccine is required' })
  const { rows } = await pool.query(
    `insert into vet_records (pet_id, entry_date, vaccine, notes)
     values ($1, $2, $3, $4) returning *`,
    [req.params.petId, entryDate, vaccine, notes || null]
  )
  res.status(201).json(rows[0])
})