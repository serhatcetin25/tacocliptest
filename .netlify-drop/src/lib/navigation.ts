import {
  LayoutDashboard,
  Newspaper,
  Building2,
  Inbox,
  Settings,
  DatabaseBackup,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Itens de navegação da sidebar do TacoClip. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clipagens", href: "/clipagens", icon: Newspaper },
  { label: "Clientes", href: "/clientes", icon: Building2 },
  { label: "Fila de Revisão", href: "/fila-revisao", icon: Inbox },
  { label: "Cadastros", href: "/cadastros", icon: Settings },
  { label: "Backup", href: "/backup", icon: DatabaseBackup },
];
