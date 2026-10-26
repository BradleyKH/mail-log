/** Terminal and printer output as printed: columns kept, never wrapped. */
export default function TextBlock({ code }: { code: string }) {
  return (
    <pre
      tabIndex={0}
      data-slot="text-block"
      className="overflow-x-auto rounded-md border bg-card px-3 py-2 font-mono text-[13px] leading-6 whitespace-pre"
    >
      {code}
    </pre>
  );
}
