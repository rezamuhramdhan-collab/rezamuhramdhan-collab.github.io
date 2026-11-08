import Image from "next/image";
import type { ImageRef, ImageLayout } from "@/content/types";

export function CaseImage({ image, hero, priority }: { image: ImageRef; hero?: boolean; priority?: boolean }) {
  const placeholder = image.src === "placeholder" || !image.src;
  return (
    <figure className={`case-image ${hero ? "hero-image" : "body-image"}`}>
      {placeholder ? <div className="img-placeholder"><span>Project image not added</span>{image.alt && <span>{image.alt}</span>}</div> : image.width && image.height ? (
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height}
          sizes={hero ? "(max-width: 680px) 100vw, 1200px" : "(max-width: 860px) 100vw, 800px"} priority={priority} style={{ width: "100%", height: "auto" }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} width={hero ? 1200 : 800} height={hero ? 750 : 500}
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
      )}
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

export function ImageGroup({ images, layout }: { images?: ImageRef[]; layout?: ImageLayout }) {
  if (!images?.length) return null;
  const grid = layout === "grid" || layout === "grid3";
  return <div className={grid ? `img-grid${layout === "grid3" ? " cols-3" : ""}` : "img-stack"}>
    {images.map((image, index) => <CaseImage key={index} image={image} />)}
  </div>;
}

export function WithImages({ images, layout, children }: { images?: ImageRef[]; layout?: ImageLayout; children: React.ReactNode }) {
  return <>{children}<ImageGroup images={images} layout={layout} /></>;
}
