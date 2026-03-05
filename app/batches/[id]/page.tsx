import fs from "fs"
import path from "path"
import Gallery from "@/components/gallery"

export default function Page({ params }: { params: { id: string } }) {
  const dataPath = path.join(process.cwd(), "data", "batches.json")
  let batches = []
  try {
    const raw = fs.readFileSync(dataPath, "utf8")
    batches = JSON.parse(raw)
  } catch (e) {
    // no data
  }

  const batch = batches.find((b: any) => b.id === params.id)
  if (!batch) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">Batch not found.</div>
      </main>
    )
  }

  const images = (batch.images || []).map((src: string) => ({ src, caption: batch.title }))

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{batch.title}</h1>
      <p className="text-sm text-foreground/70 mb-6">{batch.dates} — Attendance: {batch.attendance}</p>

      <section className="mb-8">
        <h3 className="font-semibold mb-2">Syllabus</h3>
        <ul className="list-disc ml-6 text-foreground/80">
          {batch.syllabus.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="font-semibold mb-2">Outcomes</h3>
        <ul className="list-disc ml-6 text-foreground/80">
          {batch.outcomes.map((o: string, i: number) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-4">Photos</h3>
        <Gallery images={images} />
      </section>
    </main>
  )
}
