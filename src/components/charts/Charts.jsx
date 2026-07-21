import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { capitalize } from '../../utils/helpers';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#14b8a6',
  '#f97316',
  '#6366f1',
];

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--bg-solid)',
  color: 'var(--text)',
  fontSize: 12,
};

export function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`glass h-full rounded-xl px-[1.2rem] pt-[1.15rem] pb-[0.85rem] ${className}`}>
      <div className="mb-2">
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          {subtitle && <p className="mt-[0.15rem] text-[0.8rem] text-fg-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="min-h-[280px] w-full">{children}</div>
    </div>
  );
}

export function InventoryBarChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    name: capitalize(d.name),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={formatted} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="stock" fill="var(--chart-1)" radius={[8, 8, 0, 0]} name="Total Stock" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    name: capitalize(d.name),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={formatted}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
        >
          {formatted.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PriceLineChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--chart-2)"
          strokeWidth={3}
          dot={{ r: 4, fill: 'var(--chart-2)' }}
          name="Products"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
