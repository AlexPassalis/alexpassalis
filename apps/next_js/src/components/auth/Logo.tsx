import { ROUTE_HOME } from '@/data/routes'
import { GalleryVerticalEnd } from 'lucide-react'

export default function Logo() {
  return (
    <a
      href={ROUTE_HOME}
      className="flex items-center gap-2 self-center font-medium"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
      alexpassalis.com
    </a>
  )
}
