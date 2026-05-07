type SeverityBadgeProps = {
  severity: "low" | "medium" | "high" | "critical" | string;
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  function getSeverityStyles() {
    if (severity === "critical") {
      return "border-red-500 bg-red-500/10 text-red-300";
    }

    if (severity === "high") {
      return "border-orange-500 bg-orange-500/10 text-orange-300";
    }

    if (severity === "medium") {
      return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
    }

    return "border-green-500 bg-green-500/10 text-green-300";
  }

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${getSeverityStyles()}`}
    >
      {severity}
    </span>
  );
}