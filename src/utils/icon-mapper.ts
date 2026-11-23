import {
  Award,
  Banknote,
  Briefcase,
  Building2,
  Coins,
  CreditCard,
  FileText,
  Folder,
  Handshake,
  Landmark,
  Layers,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon | undefined> = {
  "piggy-bank": PiggyBank,
  piggybank: PiggyBank,
  simpanan: PiggyBank,
  savings: PiggyBank,
  wallet: Wallet,
  pinjaman: Handshake,
  loan: Banknote,
  credit: CreditCard,
  "credit-card": CreditCard,
  banknote: Banknote,
  coins: Coins,
  landmark: Landmark,
  bank: Landmark,
  folder: Layers,
  layers: Layers,
  briefcase: Briefcase,
  building: Building2,
  "building-2": Building2,
  shield: ShieldCheck,
  "shield-check": ShieldCheck,
  trending: TrendingUp,
  "trending-up": TrendingUp,
  users: Users,
  award: Award,
  file: FileText,
  "file-text": FileText,
  truck: Truck,
  wrench: Wrench,
  default_folder: Folder,
};

export function resolveDynamicIcon(
  iconName?: string | null,
  fallback: LucideIcon = Landmark
): LucideIcon {
  if (!iconName) {
    return fallback;
  }

  const normalized = iconName.trim().toLowerCase();
  return ICON_MAP[normalized] ?? fallback;
}
