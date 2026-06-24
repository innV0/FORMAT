import type { Component } from 'vue';
import type { FieldType } from '../../../types';
import FieldString from './FieldString.vue';
import FieldBoolean from './FieldBoolean.vue';
import FieldNumber from './FieldNumber.vue';
import FieldSelect from './FieldSelect.vue';
import FieldReference from './FieldReference.vue';

export const WIDGET_REGISTRY: Record<FieldType, Component> = {
  string: FieldString,
  boolean: FieldBoolean,
  number: FieldNumber,
  select: FieldSelect,
  reference: FieldReference,
};

export function resolveWidget(type: string): Component {
  return WIDGET_REGISTRY[type as FieldType] ?? WIDGET_REGISTRY.string;
}
