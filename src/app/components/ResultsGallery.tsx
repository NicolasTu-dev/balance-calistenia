import { publicStorageUrl } from "@/app/lib/storage/publicUrl";

type Item = {
  id: string;
  kind: "photo" | "video";
  title: string | null;
  caption: string | null;
  storage_path: string;
};

export function ResultsGallery({ items }: { items: Item[] }) {
  if (!items.length) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        Todavía no hay resultados cargados. Próximo: fotos y video de progreso real.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map((it) => {
        const url = publicStorageUrl("results", it.storage_path);

        return (
          <div key={it.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="aspect-video bg-black/20">
              {it.kind === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={it.title ?? "Resultado"} className="h-full w-full object-cover" />
              ) : (
                <video src={url} controls className="h-full w-full object-cover" />
              )}
            </div>

            {(it.title || it.caption) && (
              <div className="p-4">
                {it.title && <div className="text-sm font-semibold">{it.title}</div>}
                {it.caption && <div className="mt-1 text-xs text-white/70">{it.caption}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
