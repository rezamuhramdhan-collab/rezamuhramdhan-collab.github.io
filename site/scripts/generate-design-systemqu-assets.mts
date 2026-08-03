import path from "node:path";
import sharp from "sharp";

const sourceDir = process.argv[2] ?? "/private/tmp";
const outputDir = path.resolve(process.cwd(), "public/work/design-systemqu");

const palette = {
  canvas: "#f5f7fb",
  ink: "#111827",
  muted: "#64748b",
  blue: "#2257f2",
  line: "#dbe3ef",
};

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function headingSvg(width: number, title: string, note: string) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="116">
      <text x="52" y="49" font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="${palette.ink}">${escapeXml(title)}</text>
      <text x="52" y="79" font-family="Arial, sans-serif" font-size="15" fill="${palette.muted}">${escapeXml(note)}</text>
      <rect x="52" y="96" width="48" height="4" rx="2" fill="${palette.blue}"/>
    </svg>
  `);
}

async function cleanedSource(sourceName: string) {
  const { data, info } = await sharp(path.join(sourceDir, sourceName))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const isCanvasBlack = red <= 3 && green <= 3 && blue <= 3;
    const isFigmaOutline = red >= 100 && red <= 180 && green <= 100 && blue >= 180;
    if (isCanvasBlack || isFigmaOutline) data[i + 3] = 0;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toBuffer();
}

async function panel(
  sourceName: string,
  outputName: string,
  title: string,
  note: string,
  options: { width?: number; height?: number; inset?: number } = {},
) {
  const width = options.width ?? 1104;
  const height = options.height ?? 690;
  const inset = options.inset ?? 52;
  const contentTop = 128;
  const source = await cleanedSource(sourceName);
  const image = await sharp(source)
    .resize({
      width: width - inset * 2,
      height: height - contentTop - 54,
      fit: "contain",
      withoutEnlargement: true,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const meta = await sharp(image).metadata();
  const imageLeft = Math.round((width - (meta.width ?? 0)) / 2);
  const imageTop = contentTop + Math.round((height - contentTop - 42 - (meta.height ?? 0)) / 2);

  await sharp({ create: { width, height, channels: 4, background: palette.canvas } })
    .composite([
      { input: headingSvg(width, title, note), left: 0, top: 0 },
      { input: image, left: imageLeft, top: imageTop },
    ])
    .png()
    .toFile(path.join(outputDir, outputName));
}

await Promise.all([
  panel("button.png", "button.png", "Button", "Hierarchy and size variants"),
  panel("textfield.png", "textfield.png", "Textfield", "Content, validation, size, and disabled states"),
  panel("search.png", "search.png", "Search", "Default, focused, filled, and disabled states", { inset: 40 }),
  panel("checkbox.png", "checkbox.png", "Checkbox", "Selected, indeterminate, and disabled states"),
  panel("bottomsheet.png", "bottomsheet.png", "Bottom sheet", "Default, scrolled, and full-size configurations"),
]);

const buttonHero = await sharp(await cleanedSource("button.png"))
  .resize({ width: 760, height: 430, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const textfieldHero = await sharp(await cleanedSource("textfield.png"))
  .resize({ width: 1960, height: 520, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const heroTitle = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="2208" height="1104">
    <text x="104" y="116" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="${palette.blue}">DESIGN SYSTEMQU</text>
    <text x="104" y="182" font-family="Arial, sans-serif" font-size="50" font-weight="700" fill="${palette.ink}">Foundations that scale with the product</text>
    <text x="104" y="224" font-family="Arial, sans-serif" font-size="21" fill="${palette.muted}">Tokens, mobile components, accessibility, and governance</text>
    <rect x="104" y="262" width="2000" height="1" fill="${palette.line}"/>
  </svg>
`);

await sharp({ create: { width: 2208, height: 1104, channels: 4, background: palette.canvas } })
  .composite([
    { input: heroTitle, left: 0, top: 0 },
    { input: buttonHero, left: 724, top: 280 },
    { input: textfieldHero, left: 124, top: 580 },
  ])
  .png()
  .toFile(path.join(outputDir, "hero.png"));

console.log(`Generated Design SystemQu assets in ${outputDir}`);
