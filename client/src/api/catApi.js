const CAT_API = 'https://catfact.ninja/breeds?limit=100'
const FALLBACK_CAT_BREEDS = ['Abyssinian', 'American Shorthair', 'Bengal', 'British Shorthair', 'Maine Coon', 'Persian', 'Ragdoll', 'Siamese', 'Sphynx']

export async function listCatBreeds() {
  const response = await fetch(CAT_API)
  if (!response.ok) throw new Error('Cat breeds could not be loaded')
  const data = await response.json()
  return data.data.map((breed) => breed.breed).sort((first, second) => first.localeCompare(second))
}

export { FALLBACK_CAT_BREEDS }