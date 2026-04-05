const stats = [
  { value: "2+", label: "Años entrenando" },
  { value: "50+", label: "Alumnos activos" },
  { value: "100%", label: "Personalizado" },
  { value: "24/7", label: "Soporte WhatsApp" },
];

export default function StatsStrip() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
        >
          <p className="text-3xl font-bold text-white">{stat.value}</p>
          <p className="mt-1 text-sm text-white/50">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
