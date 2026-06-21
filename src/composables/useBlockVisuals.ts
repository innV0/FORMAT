import { computed } from 'vue';
import type { MaybeRef, ComputedRef, Component } from 'vue';
import { toValue } from 'vue';
import { useMetamodelStore } from '../stores/metamodel';
import { getColorClasses } from '../utils/colors';
import { getConceptTypeIcon } from '../utils/conceptVisuals';
import type { BlockKind, ConceptType } from '../utils/conceptVisuals';
import type { ColorPalette } from '../utils/colors';

export interface BlockVisualsOptions {
  kind: MaybeRef<BlockKind>;
  conceptType?: MaybeRef<string | undefined>;
  color?: MaybeRef<string | undefined>;
  emoji?: MaybeRef<string | undefined>;
  typeName?: MaybeRef<ConceptType | undefined>;
}

export interface BlockVisuals {
  resolvedColor: ComputedRef<string>;
  resolvedEmoji: ComputedRef<string>;
  resolvedType: ComputedRef<ConceptType>;
  typeIcon: ComputedRef<Component>;
  palette: ComputedRef<ColorPalette>;
  iconToShow: ComputedRef<'type' | 'emoji'>;
  containerClasses: ComputedRef<string[]>;
}

export function useBlockVisuals(opts: BlockVisualsOptions): BlockVisuals {
  const metamodelStore = useMetamodelStore();

  const resolvedColor = computed<string>(() => {
    const color = toValue(opts.color);
    if (color) return color;
    const ct = toValue(opts.conceptType);
    if (ct) return metamodelStore.getConceptByName(ct)?.color || '';
    return '';
  });

  const resolvedEmoji = computed<string>(() => {
    const emoji = toValue(opts.emoji);
    if (emoji !== undefined) return emoji;
    const ct = toValue(opts.conceptType);
    if (ct) return metamodelStore.getConceptByName(ct)?.emoji || '';
    return '';
  });

  const resolvedType = computed<ConceptType>(() => {
    const tn = toValue(opts.typeName);
    if (tn) return tn;
    const ct = toValue(opts.conceptType);
    if (ct) return metamodelStore.getConceptByName(ct)?.type || null;
    return null;
  });

  const typeIcon = computed<Component>(() => getConceptTypeIcon(resolvedType.value));

  const palette = computed<ColorPalette>(() => getColorClasses(resolvedColor.value));

  const iconToShow = computed<'type' | 'emoji'>(() =>
    toValue(opts.kind) === 'concept' ? 'type' : 'emoji'
  );

  const containerClasses = computed<string[]>(() => {
    const p = palette.value;
    if (toValue(opts.kind) === 'concept') {
      return ['bg-white', 'border-dashed', p.text, p.border];
    }
    return [p.bg, p.text, p.border];
  });

  return { resolvedColor, resolvedEmoji, resolvedType, typeIcon, palette, iconToShow, containerClasses };
}
