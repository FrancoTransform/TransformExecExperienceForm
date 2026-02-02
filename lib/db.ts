import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set')
}

export const sql = neon(databaseUrl || '')

