import Image from "next/image";
import type { ImageRef, ImageLayout } from "@/content/types";
import { PhotoIcon } from "../icons";

// Case-study images. Single images render full content-width with a 16px
// radius; galleries stack or grid. No uploaded media → a neutral placeholder
// that still reserves layout space (the mockups' aspect-ratio frame).

export function CaseImage({
  image,
  hero,
  priority,
}: {
  image: ImageRef;
  hero?: boolean;
  priority?: boolean;
}) {
  const placeholder = image.src === "placeholder" || !image.src;
  return (
    <figure className={`case-image ${hero ? "hero-image" : "body-image"}`} role="img" aria-label={image.alt}>
      {placeholder ? (
        <div className="img-placeholder">
          <PhotoIcon />
        </div>
      ) : image.width && image.height ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 1200px) 100vw, 1104px"
          priority={priority}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
    </figure>
  );
}

// A section's images: stacked full-width, or a 2-/3-up grid.
export function ImageGroup({ images, layout }: { images?: ImageRef[]; layout?: ImageLayout }) {
  if (!images?.length) return null;
  if (layout === "grid" || layout === "grid3") {
    return (
      <div className={`img-grid${layout === "grid3" ? " cols-3" : ""}`}>
        {images.map((image, i) => (
          <CaseImage key={i} image={image} />
        ))}
      </div>
    );
  }
  return (
    <div className="img-stack">
      {images.map((image, i) => (
        <CaseImage key={i} image={image} />
      ))}
    </div>
  );
}

// A block's text followed by its images (v2 keeps images full-width below the
// text rather than beside it, so left/right collapse to a stack).
export function WithImages({
  images,
  layout,
  children,
}: {
  images?: ImageRef[];
  layout?: ImageLayout;
  children: React.ReactNode;
}) {
  const gallery: ImageLayout = layout === "grid" ? "grid" : "full";
  return (
    <>
      {children}
      {images?.length ? <ImageGroup images={images} layout={gallery} /> : null}
    </>
  );
}
