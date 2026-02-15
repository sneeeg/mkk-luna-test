import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import type { Note } from '~/shared/types/notes'

const dataDir = join(process.cwd(), '.data')
const filePath = join(dataDir, 'notes.json')

async function ensureFile() {
    await fs.mkdir(dataDir, { recursive: true })
    try {
        await fs.access(filePath)
    } catch {
        await fs.writeFile(filePath, JSON.stringify({ notes: [] as Note[] }, null, 2), 'utf-8')
    }
}

export async function readNotes(): Promise<Note[]> {
    await ensureFile()
    const raw = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as { notes: Note[] }
    return Array.isArray(parsed.notes) ? parsed.notes : []
}

export async function writeNotes(notes: Note[]) {
    await ensureFile()
    await fs.writeFile(filePath, JSON.stringify({ notes }, null, 2), 'utf-8')
}

export function uid(prefix = '') {
    return prefix + Math.random().toString(16).slice(2) + Date.now().toString(16)
}
