import { PageShell } from "@/components/page-shell";

type Props = {
  title: string;
  summary: string;
};

export const StandardPage = ({ title, summary }: Props) => (
  <PageShell title={title} description={summary}>
    <p className="text-sm text-slate-300">
      This sprint-based module is wired for tRPC-powered data loading, SignalCore scoring, and production monitoring.
    </p>
  </PageShell>
);
