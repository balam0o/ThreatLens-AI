type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-slate-500">
      {message}
    </div>
  );
}