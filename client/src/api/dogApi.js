const DOG_API = 'https://dog.ceo/api'

export async function listDogBreeds() {
  const response = await fetch(`${DOG_API}/breeds/list/all`)
  if (!response.ok) throw new Error('Dog breeds could not be loaded')
  const data = await response.json()
  return Object.entries(data.message).flatMap(([breed, varieties]) =>
    varieties.length ? varieties.map((variety) => `${variety} ${breed}`) : [breed],
  )
}

export async function randomDogImage(breed) {
  const slug = breed.toLowerCase().split(' ').reverse().join('/')
  const response = await fetch(`${DOG_API}/breed/${slug}/images/random`)
  if (!response.ok) return ''
  const data = await response.json()
  return data.message
}