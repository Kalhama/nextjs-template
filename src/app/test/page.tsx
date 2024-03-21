import { db } from '@/lib/db'

import { TestForm } from './form'

export default async function Page() {
  const data = await db.test.findMany()

  return (
    <div>
      <ul>
        {data.map((d) => (
          <li key={d.id}>{d.data}</li>
        ))}
      </ul>
      <TestForm />
    </div>
  )
}
