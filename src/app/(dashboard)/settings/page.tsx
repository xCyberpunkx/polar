import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/ui'
import { MedicationsManager } from './MedicationsManager'
import { CaregiverManager } from './CaregiverManager'

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } })

  const [user, medications] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.medication.findMany({ where: { userId, active: true }, orderBy: { createdAt: 'asc' } }),
  ])

  return (
    <div style={{ maxWidth: '640px' }}>
      <PageHeader title="Settings" description="Manage your medications, trusted contacts, and account." />

      {/* Medications */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Medications
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>
          Your current psychiatric medications. Used to track adherence.
        </div>
        <MedicationsManager initialMeds={medications} />
      </section>

      {/* Caregiver */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Caregiver Access
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>
          Share a read-only dashboard with a trusted person — family, partner, or psychiatrist.
        </div>
        <CaregiverManager token={user?.caregiverToken ?? null} />
      </section>
    </div>
  )
}
