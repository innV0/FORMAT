<template>
  <component :is="resolvedIcon" v-if="isLucide" :class="customClass" />
  <span v-else class="select-none leading-none inline-flex items-center justify-center font-normal" :class="customClass">
    {{ icon }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  FileText,
  Folder,
  HelpCircle,
  UserCheck,
  UserMinus,
  Scissors,
  LineChart,
  Award,
  GraduationCap,
  Frown,
  Gem,
  Megaphone,
  Mic,
  Handshake,
  Eye,
  Meh,
  Cpu,
  Plane,
  Pill,
  Briefcase,
  Puzzle,
  Star,
  ShoppingBag,
  Brain,
  Target,
  Settings,
  Shirt,
  User,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Contact,
  Calendar,
  Flag,
  Ruler,
  Coins,
  Banknote,
  DollarSign,
  Compass,
  AlertTriangle,
  Key,
  FlaskConical,
  Plus,
  Check,
  Building,
  HardHat,
  Info,
  Scale,
  GitCommit,
  ListChecks
} from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  icon?: string | null;
  fallback?: string;
  customClass?: string;
}>(), {
  icon: '',
  fallback: 'file-text',
  customClass: 'w-4 h-4 text-current'
});

// Emojis mapping to Lucide Icons
const emojiMap: Record<string, any> = {
  '📄': FileText,
  '📂': Folder,
  '🤔': HelpCircle,
  '🙋': UserCheck,
  '🙎': UserMinus,
  '✂️': Scissors,
  '✂': Scissors,
  '📈': LineChart,
  '🏅': Award,
  '🎩': GraduationCap,
  '😟': Frown,
  '💎': Gem,
  '📣': Megaphone,
  '🎙️': Mic,
  '🎙': Mic,
  '🤝': Handshake,
  '👁️': Eye,
  '👁': Eye,
  '😐': Meh,
  '🦾': Cpu,
  '✈️': Plane,
  '✈': Plane,
  '💊': Pill,
  '💼': Briefcase,
  '🧩': Puzzle,
  '🌟': Star,
  '🛍️': ShoppingBag,
  '🛍': ShoppingBag,
  '🧠': Brain,
  '🎯': Target,
  '⚙️': Settings,
  '⚙': Settings,
  '👔': Shirt,
  '⭐': Star,
  '👤': User,
  '🔧': Wrench,
  '➡️': ArrowRight,
  '⬅️': ArrowLeft,
  '⬅': ArrowLeft,
  '🪪': Contact,
  '🗓️': Calendar,
  '🗓': Calendar,
  '🏁': Flag,
  '📐': Ruler,
  '💰': Coins,
  '💸': Banknote,
  '💵': DollarSign,
  '🔮': Compass,
  '🚨': AlertTriangle,
  '🔑': Key,
  '🧪': FlaskConical,
  '➕': Plus,
  '✔️': Check,
  '✔': Check,
  '🏢': Building,
  '👷‍♂️': HardHat,
  '👷': HardHat,
  '❓': HelpCircle,
  '🚩': Flag,
  'ℹ️': Info,
  'ℹ': Info,
  '⚖️': Scale,
  '⚖': Scale
};

// Lucide icon name mapping (normalized to lowercase, alphanumeric only)
const nameMap: Record<string, any> = {
  filetext: FileText,
  folder: Folder,
  helpcircle: HelpCircle,
  usercheck: UserCheck,
  userminus: UserMinus,
  scissors: Scissors,
  linechart: LineChart,
  award: Award,
  graduationcap: GraduationCap,
  frown: Frown,
  gem: Gem,
  megaphone: Megaphone,
  mic: Mic,
  handshake: Handshake,
  eye: Eye,
  meh: Meh,
  cpu: Cpu,
  plane: Plane,
  pill: Pill,
  briefcase: Briefcase,
  puzzle: Puzzle,
  star: Star,
  shoppingbag: ShoppingBag,
  brain: Brain,
  target: Target,
  settings: Settings,
  shirt: Shirt,
  user: User,
  wrench: Wrench,
  arrowright: ArrowRight,
  arrowleft: ArrowLeft,
  contact: Contact,
  calendar: Calendar,
  flag: Flag,
  ruler: Ruler,
  coins: Coins,
  banknote: Banknote,
  dollarsign: DollarSign,
  compass: Compass,
  alerttriangle: AlertTriangle,
  key: Key,
  flaskconical: FlaskConical,
  plus: Plus,
  check: Check,
  building: Building,
  hardhat: HardHat,
  info: Info,
  scale: Scale,
  gitcommit: GitCommit,
  listchecks: ListChecks
};

const normalize = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const resolvedIcon = computed(() => {
  if (!props.icon) {
    return nameMap[normalize(props.fallback)] || FileText;
  }
  const trimmed = props.icon.trim();
  if (emojiMap[trimmed]) {
    return emojiMap[trimmed];
  }
  const normalized = normalize(trimmed);
  if (nameMap[normalized]) {
    return nameMap[normalized];
  }
  // If not mapped, we return null to let template render as text/emoji
  return null;
});

const isLucide = computed(() => resolvedIcon.value !== null);
</script>
