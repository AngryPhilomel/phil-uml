import { CanvasView } from '@/components/canvas-view/canvas-view'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
     <main>
      <CanvasView/>
     </main>
    </>
  )
}
