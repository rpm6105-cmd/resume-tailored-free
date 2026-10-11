import { legalConfig } from "@/lib/site"

export default function LegalPage({ title, intro, children }: { title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#f7f6f2]">
      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">Last updated {legalConfig.lastUpdated}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
        {intro && <div className="mt-4 text-[15px] leading-7 text-[#33403b]">{intro}</div>}
        <div className="mt-8 space-y-5 text-[15px] leading-7 text-[#33403b] [&_a]:text-[#d65540] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#18211f] [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-[#18211f] [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-[#dce1da] [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-[#dce1da] [&_th]:bg-white [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </div>
  )
}

/** Grievance Officer block required by the IT (SPDI) Rules, 2011 and DPDP Rules, 2025. */
export function GrievanceOfficer() {
  const { grievanceOfficer, entity, address } = legalConfig
  return (
    <div className="border border-[#dce1da] bg-white p-5 not-prose">
      <p className="font-semibold text-[#18211f]">Grievance Officer</p>
      <p className="mt-1">{grievanceOfficer.name}</p>
      <p>{entity}, {address}</p>
      <p>
        Email: <a href={`mailto:${grievanceOfficer.email}`}>{grievanceOfficer.email}</a>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        We acknowledge grievances within 72 hours and aim to resolve them within 30 days of receipt.
      </p>
    </div>
  )
}
