import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../authMiddleware.js'

export const petsRouter = Router()

// "My Pets" only returns pets owned by the signed-in user.
petsRouter.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `select * from pets where owner_uid = $1 order by created_at desc`,
    [req.uid]
  )

  res.json(rows)
})

petsRouter.post('/', requireAuth, async (req, res) => {
  const { name, breed, birthday, photoUrl } = req.body

  if (!name || !breed) {
    return res.status(400).json({ error: 'name and breed are required' })
  }

  const { rows } = await pool.query(
    `insert into pets (owner_uid, name, breed, birthday, photo_url)
     values ($1, $2, $3, $4, $5) returning *`,
    [
      req.uid,
      name,
      breed,
      birthday || null,
      photoUrl || null
    ]
  )

  res.status(201).json(rows[0])
})

petsRouter.put('/:id', requireAuth, async (req, res) => {
  const { name, breed, birthday, photoUrl } = req.body

  const { rows } = await pool.query(
    `update pets set name = $1, breed = $2, birthday = $3, photo_url = $4
     where id = $5 and owner_uid = $6 returning *`,
    [
      name,
      breed,
      birthday || null,
      photoUrl || null,
      req.params.id,
      req.uid
    ]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  res.json(rows[0])
})

petsRouter.delete('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `delete from pets where id = $1 and owner_uid = $2 returning id`,
    [req.params.id, req.uid]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  res.status(204).end()
})

// Only the pet owner can update the rehoming details.
petsRouter.patch('/:id/rehoming', requireAuth, async (req, res) => {
  const { isRehoming, description, contact } = req.body

  const { rows } = await pool.query(
    `update pets set is_rehoming = $1, rehoming_description = $2, rehoming_contact = $3
     where id = $4 and owner_uid = $5 returning *`,
    [
      !!isRehoming,
      description || null,
      contact || null,
      req.params.id,
      req.uid
    ]
  )

  if (rows.length === 0) {
    return res.status(404).json({ error: 'Pet not found' })
  }

  res.json(rows[0])
})

// This route is public and only returns pets that are currently being rehomed.
petsRouter.get('/rehoming', async (_req, res) => {
  const { rows } = await pool.query(
    `select id, owner_uid, name, breed, birthday, photo_url,
            rehoming_description, rehoming_contact
     from pets where is_rehoming = true order by created_at desc`
  )

  res.json(rows)
})