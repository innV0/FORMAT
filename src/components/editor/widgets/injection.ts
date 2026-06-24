import type { InjectionKey } from 'vue';

export const UpdateFieldKey: InjectionKey<(fieldName: string, value: any) => void> =
  Symbol('updateField');
