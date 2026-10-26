export default function PullQuote({ children }: { children: string }) {
  return (
    <figure className="border-l-4 border-border pl-4">
      <blockquote className="text-lg italic">&ldquo;{children}&rdquo;</blockquote>
      <figcaption className="mt-1 text-sm text-muted-foreground">
        Danny Harris, quoted by Tommy R. Atkinson, Charleston Gazette-Mail, February 14, 2001
      </figcaption>
    </figure>
  );
}
