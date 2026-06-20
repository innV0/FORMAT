export interface ColorPalette {
  bg: string;
  text: string;
  border: string;
}

export const getColorClasses = (colorName: string | null | undefined): ColorPalette => {
  const colors: Record<string, ColorPalette> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    red: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' }
  };
  return colors[(colorName || '').toLowerCase()] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
};
