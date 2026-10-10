export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#f7f6f2]">
      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">Last updated {updated}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-8 space-y-6 text-[15px] leading-7 text-[#33403b] [&_a]:text-[#d65540] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#18211f] [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </div>
  )
}
