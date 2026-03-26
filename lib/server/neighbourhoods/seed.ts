import { getDbClient } from '@/lib/server/db/client'

import { createNeighbourhoodRecord } from './repository'
import { seededNeighbourhoods } from './seed-data'

export async function seedNeighbourhoodsIfNeeded() {
  const db = getDbClient()
  const result = await db.execute(`SELECT COUNT(*) AS count FROM neighbourhoods`)
  const count = Number(result.rows[0]?.count || 0)
  if (count > 0) {
    return
  }

  for (const neighbourhood of seededNeighbourhoods) {
    await createNeighbourhoodRecord(neighbourhood)
  }
}
