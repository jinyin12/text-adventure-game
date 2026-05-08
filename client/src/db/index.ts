import { openDB, type IDBPDatabase } from 'idb'
import type { SaveSlot, Settings } from '../types'

const DB_NAME = 'text-adventure-game'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('saves')) {
          db.createObjectStore('saves', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

// Relaxed durability for faster writes on mobile
const TX_OPTS: IDBTransactionOptions = { durability: 'relaxed' }

// --- Saves ---

export async function getAllSaves(): Promise<SaveSlot[]> {
  const db = await getDB()
  return db.getAll('saves')
}

export async function getSave(id: string): Promise<SaveSlot | undefined> {
  const db = await getDB()
  return db.get('saves', id)
}

export async function putSave(save: SaveSlot): Promise<void> {
  const db = await getDB()
  save.updatedAt = Date.now()
  const tx = db.transaction('saves', 'readwrite', TX_OPTS)
  await tx.store.put(save)
  await tx.done
}

export async function deleteSave(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('saves', id)
}

// --- Settings ---

export async function getSettings(): Promise<Settings | undefined> {
  const db = await getDB()
  return db.get('settings', 'global')
}

export async function putSettings(settings: Settings): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('settings', 'readwrite', TX_OPTS)
  await tx.store.put({ ...settings, id: 'global' })
  await tx.done
}
