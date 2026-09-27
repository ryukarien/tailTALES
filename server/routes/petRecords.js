import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../authMiddleware.js'

export const petRecordsRouter = Router({ mergeParams: true })

// Make sure the pet belongs to the logged-in user before
// accessing its diary or veterinary records.
async function assertOwnsPet(petId, uid) {
  const { rows } = await pool.query(
    `select id from pets where id = $1 and owner_uid = $2`,
    [petId, uid]
  )

  return rows.length > 0
}

petRecordsRouter.get('/diary', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  const { rows } = await pool.query(
    `select * from diary_entries where pet_id = $1 order by entry_date desc`,
    [req.params.petId]
  )

  res.json(rows)
})

petRecordsRouter.post('/diary', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  const { entryDate, caption, story, photoUrl } = req.body

  if (!entryDate || !caption) {
    return res.status(400).json({ error: 'entryDate and caption are required' })
  }

  const { rows } = await pool.query(
    `insert into diary_entries (pet_id, entry_date, caption, story, photo_url)
     values ($1, $2, $3, $4, $5) returning *`,
    [
      req.params.petId,
      entryDate,
      caption || null,
      story || null,
      photoUrl || null
    ]
  )

  res.status(201).json(rows[0])
})

petRecordsRouter.put('/diary/:entryId', requireAuth, async (req, res) => {
  const { entryDate, caption, story, photoUrl } = req.body

  if (!entryDate || !caption) {
    return res.status(400).json({ error: 'entryDate and caption are required' })
  }

  const { rows } = await pool.query(
    `update diary_entries as diary_entry
     set entry_date = $1, caption = $2, story = $3, photo_url = $4
     where diary_entry.id = $5 and diary_entry.pet_id = $6
       and exists (select 1 from pets as pet where pet.id = diary_entry.pet_id and pet.owner_uid = $7)
     returning diary_entry.*`,
    [entryDate, caption, story || null, photoUrl || null, req.params.entryId, req.params.petId, req.uid]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Diary entry not found' })
  }

  res.json(rows[0])
})

petRecordsRouter.delete('/diary/:entryId', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `delete from diary_entries as diary_entry
     where diary_entry.id = $1 and diary_entry.pet_id = $2
       and exists (select 1 from pets as pet where pet.id = diary_entry.pet_id and pet.owner_uid = $3)
     returning diary_entry.id`,
    [req.params.entryId, req.params.petId, req.uid]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Diary entry not found' })
  }

  res.status(204).end()
})

petRecordsRouter.get('/vet', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  const { rows } = await pool.query(
    `select * from vet_records where pet_id = $1 order by entry_date desc`,
    [req.params.petId]
  )

  res.json(rows)
})

petRecordsRouter.post('/vet', requireAuth, async (req, res) => {
  if (!(await assertOwnsPet(req.params.petId, req.uid))) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  const { entryDate, vaccine, notes } = req.body

  if (!vaccine) {
    return res.status(400).json({ error: 'vaccine is required' })
  }

  const { rows } = await pool.query(
    `insert into vet_records (pet_id, entry_date, vaccine, notes)
     values ($1, $2, $3, $4) returning *`,
    [
      req.params.petId,
      entryDate,
      vaccine,
      notes || null
    ]
  )

  res.status(201).json(rows[0])
})

petRecordsRouter.put('/vet/:recordId', requireAuth, async (req, res) => {
  const { entryDate, vaccine, notes } = req.body

  if (!entryDate || !vaccine) {
    return res.status(400).json({ error: 'entryDate and vaccine are required' })
  }

  const { rows } = await pool.query(
    `update vet_records as vet_record
     set entry_date = $1, vaccine = $2, notes = $3
     where vet_record.id = $4 and vet_record.pet_id = $5
       and exists (select 1 from pets as pet where pet.id = vet_record.pet_id and pet.owner_uid = $6)
     returning vet_record.*`,
    [entryDate, vaccine, notes || null, req.params.recordId, req.params.petId, req.uid]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Vet record not found' })
  }

  res.json(rows[0])
})

petRecordsRouter.delete('/vet/:recordId', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `delete from vet_records as vet_record
     where vet_record.id = $1 and vet_record.pet_id = $2
       and exists (select 1 from pets as pet where pet.id = vet_record.pet_id and pet.owner_uid = $3)
     returning vet_record.id`,
    [req.params.recordId, req.params.petId, req.uid]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Vet record not found' })
  }

  res.status(204).end()
})