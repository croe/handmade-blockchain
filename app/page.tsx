'use client'

import Link from 'next/link'
import {Card, CardContent} from '@/components/ui/card'
import CreateWalletView from '@/components/CreateWalletView'
import UsersViewer from '@/components/UsersViewer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 py-8">
      <Card>
        <CreateWalletView/>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <UsersViewer />
        </CardContent>
      </Card>
      <p><Link href={`/tx/create`}>CREATE TX</Link></p>
    </main>
  )
}
