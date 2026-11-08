export default function JourneyTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-transition"><span className="transition-flare" aria-hidden="true" /><span className="chapter-arrival loading-thread" aria-hidden="true" />{children}</div>;
}
