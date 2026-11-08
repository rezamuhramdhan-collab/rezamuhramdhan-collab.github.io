export function Chapter({ number, title }: { number: string; title: string }) {
  return <p className="chapter-label"><span>{number === "Interlude" ? number : `Chapter ${number}`}</span><span className="chapter-thread" aria-hidden="true" /><span>{title}</span></p>;
}

export function ChapterEnd({ children }: { children: React.ReactNode }) {
  return <p className="chapter-end"><span aria-hidden="true" />{children}</p>;
}
