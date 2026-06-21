export interface ColorPalette {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
}

export const getColorClasses = (colorName: string | null | undefined): ColorPalette => {
  const colors: Record<string, ColorPalette> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hoverBg: 'hover:bg-blue-50',
      hoverText: 'hover:text-blue-700',
      hoverBorder: 'hover:border-blue-200'
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      hoverBg: 'hover:bg-emerald-50',
      hoverText: 'hover:text-emerald-700',
      hoverBorder: 'hover:border-emerald-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      hoverBg: 'hover:bg-indigo-50',
      hoverText: 'hover:text-indigo-700',
      hoverBorder: 'hover:border-indigo-200'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      hoverBg: 'hover:bg-orange-50',
      hoverText: 'hover:text-orange-700',
      hoverBorder: 'hover:border-orange-200'
    },
    red: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      hoverBg: 'hover:bg-rose-50',
      hoverText: 'hover:text-rose-700',
      hoverBorder: 'hover:border-rose-200'
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      hoverBg: 'hover:bg-violet-50',
      hoverText: 'hover:text-violet-700',
      hoverBorder: 'hover:border-violet-200'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      hoverBg: 'hover:bg-amber-50',
      hoverText: 'hover:text-amber-700',
      hoverBorder: 'hover:border-amber-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      hoverBg: 'hover:bg-yellow-50',
      hoverText: 'hover:text-yellow-700',
      hoverBorder: 'hover:border-yellow-200'
    }
  };
  return colors[(colorName || '').toLowerCase()] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    hoverBg: 'hover:bg-slate-50',
    hoverText: 'hover:text-slate-700',
    hoverBorder: 'hover:border-slate-200'
  };
};
