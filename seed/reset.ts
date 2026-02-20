import { createClient } from '@supabase/supabase-js'

// Run with: npx tsx --env-file=.env.local seed/reset.ts --confirm
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SVC_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SVC_KEY required')
  process.exit(1)
}

const args = process.argv.slice(2)
const confirmed = args.includes('--confirm')

if (!confirmed) {
  console.error('\nSafety check: this will DELETE all subjects and papers.')
  console.error('Re-run with --confirm to proceed:\n')
  console.error('  yarn db:reset --confirm\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function reset() {
  console.log('\nNehaNotes DB Reset')
  console.log('='.repeat(40))

  // Order matters — delete dependents first to avoid FK violations
  const steps: { table: string; label: string }[] = [
    { table: 'papers',   label: 'Papers'   },
    { table: 'subjects', label: 'Subjects' },
  ]

  for (const { table, label } of steps) {
    const { error, count } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000') // match-all condition

    if (error) {
      console.error(`  ✗ ${label}: ${error.message}`)
      process.exit(1)
    }

    console.log(`  ✓ ${label}: ${count ?? 0} rows deleted`)
  }

  console.log('\nDone. DB is empty. Run `yarn seed` to reseed.\n')
}

reset().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
