import Image from "next/image";
import type { ImageRef, ImageLayout } from "@/content/types";

// Image layout system for case-study sections: single images (uploaded or
// placeholder), grids/stacks, and text-beside-media splits.

export function Placeholder({
  image,
  tall,
  className,
  priority,
}: {
  image: ImageRef;
  tall?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (image.src === "placeholder") {
    return (
      <div className={className}>
        <div className={`case-img${tall ? " tall" : ""}`} role="img" aria-label={image.alt}>
          <div className="device" />
        </div>
        {image.caption && <p className="img-caption">{image.caption}</p>}
      </div>
    );
  }
  return (
    <div className={className}>
      {image.width && image.height ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 1160px) 100vw, 1080px"
          priority={priority}
          style={{ borderRadius: 20, width: "100%", height: "auto" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} style={{ borderRadius: 20, width: "100%" }} />
      )}
      {image.caption && <p className="img-caption">{image.caption}</p>}
    </div>
  );
}

// Renders a section's images in the chosen layout (full stack or grid).
export function ImageGroup({ images, layout }: { images?: ImageRef[]; layout?: ImageLayout }) {
  if (!images?.length) return null;
  if (layout === "grid" || layout === "grid3") {
    return (
      <div className={`img-grid${layout === "grid3" ? " cols-3" : ""}`}>
        {images.map((image, i) => (
          <Placeholder key={i} image={image} />
        ))}
      </div>
    );
  }
  return (
    <div className="img-stack">
      {images.map((image, i) => (
        <Placeholder key={i} image={image} />
      ))}
    </div>
  );
}

// Wraps a block's text content with its images per the chosen layout:
// left/right put images beside the text; everything else stacks them after.
export function WithImages({
  images,
  layout,
  children,
}: {
  images?: ImageRef[];
  layout?: ImageLayout;
  children: React.ReactNode;
}) {
  if (!images?.length) return <>{children}</>;
  if (layout === "left" || layout === "right") {
    return (
      <div className={`media-split${layout === "right" ? " flip" : ""}`}>
        <div className="split-media">
          <ImageGroup images={images} layout="full" />
        </div>
        <div className="split-body">{children}</div>
      </div>
    );
  }
  return (
    <>
      {children}
      <ImageGroup images={images} layout={layout} />
    </>
  );
}
