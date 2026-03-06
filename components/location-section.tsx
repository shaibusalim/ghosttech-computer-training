import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function LocationSection() {
  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Location</h2>
        <Card className="border-primary/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="relative h-48 md:h-full">
              <Image
                src="/placeholder.jpg"
                alt="Map"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle>Tamale – Gurugu</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-foreground/70 space-y-2">
                <p>Training held at Gurugu, Tamale.</p>
                <p>10 minutes from Tamale International School.</p>
                <p>Accessible by local transport routes.</p>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
