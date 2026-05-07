import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm text-cyan-300">ThreatLens AI</p>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-400">{description}</p>
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}