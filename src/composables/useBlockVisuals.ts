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
  icon?: MaybeRef<string | undefined>;
  typeName?: MaybeRef<ConceptType | undefined>;
}

export interface BlockVisuals {
  resolvedColor: ComputedRef<string>;
  resolvedIcon: ComputedRef<string>;
  resolvedType: ComputedRef<ConceptType>;
  typeIcon: ComputedRef<Component>;
  palette: ComputedRef<ColorPalette>;
  iconToShow: ComputedRef<'type' | 'icon'>;
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

  const resolvedIcon = computed<string>(() => {
    const icon = toValue(opts.icon);
    if (icon !== undefined) return icon;
    const ct = toValue(opts.conceptType);
    if (ct) return metamodelStore.getConceptByName(ct)?.icon || '';
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

  // Both concepts and instances show the concept's own icon. The abstract
  // type icon is only a fallback (handled by consumers when no own icon exists).
  const iconToShow = computed<'type' | 'icon'>(() => 'icon');

  const containerClasses = computed<string[]>(() => {
    const p = palette.value;
    if (toValue(opts.kind) === 'concept') {
      return [p.bg, 'border-solid', p.text, p.border];
    }
    return [p.bg, 'border-dashed', p.text, p.border];
  });

  return { resolvedColor, resolvedIcon, resolvedType, typeIcon, palette, iconToShow, containerClasses };
}
