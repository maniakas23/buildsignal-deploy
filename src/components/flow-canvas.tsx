const points = [
  { label: "Permit", x: "10%", y: "40%" },
  { label: "SignalCore", x: "42%", y: "20%" },
  { label: "Scoring", x: "70%", y: "50%" },
  { label: "Portfolio", x: "30%", y: "75%" },
  { label: "Alerts", x: "85%", y: "80%" },
];

export const FlowCanvas = () => (
  <div className="relative h-72 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 [perspective:1000px]">
    <div className="absolute inset-0 [transform:rotateX(20deg)_rotateY(-10deg)]">
      {points.map((point) => (
        <div
          key={point.label}
          className="absolute rounded-full border border-blue-400 bg-blue-500/20 px-3 py-1 text-xs text-blue-100"
          style={{ left: point.x, top: point.y }}
        >
          {point.label}
        </div>
      ))}
    </div>
  </div>
);
