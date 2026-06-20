import {
  Home,
  Landmark,
  CreditCard,
  Lightbulb,
  Droplet,
  Flame,
  Smartphone,
  Wifi,
  Tv,
  Music,
  Gamepad2,
  ShoppingCart,
  Utensils,
  Coffee,
  Car,
  Fuel,
  Bus,
  Plane,
  Pill,
  HeartPulse,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Dog,
  Gift,
  Briefcase,
  Receipt,
  Wallet,
  Beer,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react'

/** conjunto curado de ícones Lucide pros itens (guardamos só o nome) */
export const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  landmark: Landmark,
  'credit-card': CreditCard,
  lightbulb: Lightbulb,
  droplet: Droplet,
  flame: Flame,
  smartphone: Smartphone,
  wifi: Wifi,
  tv: Tv,
  music: Music,
  gamepad: Gamepad2,
  cart: ShoppingCart,
  food: Utensils,
  coffee: Coffee,
  car: Car,
  fuel: Fuel,
  bus: Bus,
  plane: Plane,
  pill: Pill,
  health: HeartPulse,
  gym: Dumbbell,
  book: BookOpen,
  education: GraduationCap,
  pet: Dog,
  gift: Gift,
  work: Briefcase,
  receipt: Receipt,
  wallet: Wallet,
  beer: Beer,
  savings: PiggyBank,
}

export const ICON_NAMES = Object.keys(ICON_MAP)

type IconProps = { name?: string; size?: number; className?: string; strokeWidth?: number }

/** renderiza um ícone Lucide pelo nome do conjunto curado (ou nada se desconhecido) */
export function Icon({ name, size = 18, className, strokeWidth = 2 }: IconProps) {
  const Cmp = name ? ICON_MAP[name] : undefined
  if (!Cmp) return null
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} />
}
