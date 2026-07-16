import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  description: string;
}>;

export const PageShell = ({ title, description, children }: Props) => (
  <section className="mx-auto w-full max-w-5xl space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-slate-300">{description}</p>
    {children}
  </section>
);
