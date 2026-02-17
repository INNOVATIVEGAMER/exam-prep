import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load env — run with: npx tsx seed/seed.ts [--dry-run] [--subject IT301]
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY required')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const subjectFilter = args.includes('--subject') ? args[args.indexOf('--subject') + 1] : null

async function seedSubject(subjectFile: string) {
  const subjectPath = path.join(__dirname, 'subjects', subjectFile)
  const subjectData = JSON.parse(fs.readFileSync(subjectPath, 'utf-8'))

  console.log(`\n[Subject] ${subjectData.code} — ${subjectData.name}`)

  if (isDryRun) {
    console.log('  [DRY RUN] Would upsert subject:', subjectData.code)
    return subjectData.code
  }

  const { data, error } = await supabase
    .from('subjects')
    .upsert(subjectData, { onConflict: 'code' })
    .select('id, code')
    .single()

  if (error) {
    console.error('  Error seeding subject:', error.message)
    return null
  }

  console.log('  Seeded subject:', data.code, '→', data.id)
  return data.code
}

async function seedPapersForSubject(subjectCode: string) {
  // Get subject ID
  const { data: subject, error: subjectError } = await supabase
    .from('subjects')
    .select('id')
    .eq('code', subjectCode)
    .single()

  if (subjectError || !subject) {
    console.error(`  Subject ${subjectCode} not found in DB`)
    return
  }

  const papersDir = path.join(__dirname, 'papers', subjectCode)
  if (!fs.existsSync(papersDir)) {
    console.log(`  No papers directory for ${subjectCode}`)
    return
  }

  const paperFiles = fs.readdirSync(papersDir).filter(f => f.endsWith('.json'))

  for (const paperFile of paperFiles) {
    const paperPath = path.join(papersDir, paperFile)
    const paperData = JSON.parse(fs.readFileSync(paperPath, 'utf-8'))

    const { subject_code, ...paperInsert } = paperData
    const payload = { ...paperInsert, subject_id: subject.id }

    console.log(`\n  [Paper] ${paperData.title}`)

    if (isDryRun) {
      console.log('    [DRY RUN] Would upsert paper:', paperData.title)
      continue
    }

    const { error } = await supabase
      .from('papers')
      .upsert(payload, { onConflict: 'subject_id,title' })

    if (error) {
      console.error('    Error seeding paper:', error.message)
    } else {
      console.log('    Seeded paper:', paperData.title)
    }
  }
}

async function main() {
  console.log(`\nExamPrep Seed Script ${isDryRun ? '[DRY RUN]' : ''}`)
  console.log('='.repeat(40))

  const subjectsDir = path.join(__dirname, 'subjects')
  const allSubjectFiles = fs.readdirSync(subjectsDir).filter(f => f.endsWith('.json'))

  const filesToProcess = subjectFilter
    ? allSubjectFiles.filter(f => f.startsWith(subjectFilter))
    : allSubjectFiles

  if (filesToProcess.length === 0) {
    console.error(`No subject files found${subjectFilter ? ` for ${subjectFilter}` : ''}`)
    process.exit(1)
  }

  for (const subjectFile of filesToProcess) {
    const code = await seedSubject(subjectFile)
    if (code && !isDryRun) {
      await seedPapersForSubject(code)
    }
  }

  console.log('\nDone.')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
