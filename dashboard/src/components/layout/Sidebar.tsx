/**
 * Sidebar de navegação do TacoClip.
 * No MVP expõe só o Dashboard. Os demais itens são placeholders
 * para as fases seguintes (Monitoramentos, Tags, Relatórios).
 */
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bookmark,
  Tag,
  BarChart2,
  Settings,
  Radio,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  ativo?: boolean;
  placeholder?: boolean; // itens de fases futuras
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", ativo: true },
  { icon: Bookmark,        label: "Clippings",    placeholder: true },
  { icon: Radio,           label: "Monitoramentos", placeholder: true },
  { icon: Tag,             label: "Tags",          placeholder: true },
  { icon: BarChart2,       label: "Relatórios",    placeholder: true },
  { icon: Settings,        label: "Configurações", placeholder: true },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-ink-200
                      bg-white md:flex">
      <nav className="flex flex-col gap-0.5 p-3 pt-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            disabled={item.placeholder}
            title={item.placeholder ? `${item.label} — em breve` : item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              "transition-colors text-left w-full",
              item.ativo
                ? "bg-brand-50 text-brand-700"
                : "text-ink-600 hover:bg-ink-50",
              item.placeholder && "cursor-not-allowed opacity-40"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {item.placeholder && (
              <span className="ml-auto text-[10px] font-normal text-ink-400">
                em breve
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
