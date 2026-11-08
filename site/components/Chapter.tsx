export function Chapter({ number, title }: { number: string; title: string }) {
  return <p className="chapter-label"><span>{number === "Interlude" ? number : `Chapter ${number}`}</span><span>{title}</span></p>;
}

export function ChapterEnd({ children }: { children: React.ReactNode }) {
  return <p className="chapter-end">{children}</p>;
}
