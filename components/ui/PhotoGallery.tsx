interface PhotoGalleryProps {
  urls: string[]
}

export function PhotoGallery({ urls }: PhotoGalleryProps) {
  if (urls.length === 0) {
    return <p className="text-ink-muted text-sm">Fără poze</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {urls.map((url, idx) => (
        <a
          key={`${url}-${idx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            loading="lazy"
            alt="Poză pagubă"
            className="rounded-[10px] object-cover aspect-square w-full"
          />
        </a>
      ))}
    </div>
  )
}
