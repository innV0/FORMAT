// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, provide } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { UpdateFieldKey } from '../injection';
import FieldReference from '../FieldReference.vue';
import type { FieldDefinition } from '../../../../types';

const mockModelTree = [
  { id: '1', name: 'Alice', type: 'Stakeholders', description: '', children: [] },
  { id: '2', name: 'Bob', type: 'Stakeholders', description: '', children: [] },
  { id: '3', name: 'Marketing', type: 'Channels', description: '', children: [] },
];

vi.mock('../../../../stores/document', () => ({
  useDocumentStore: () => ({
    modelTree: mockModelTree,
  }),
}));

function mountReference(fieldDef: FieldDefinition, value: any, updateFn = vi.fn()) {
  const Wrapper = defineComponent({
    setup() {
      provide(UpdateFieldKey, updateFn);
      return () => h(FieldReference, { field: fieldDef, value, readonly: false });
    },
  });
  return mount(Wrapper);
}

describe('FieldReference', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders an input element', () => {
    const field: FieldDefinition = {
      name: 'owner',
      type: 'reference',
      target_concepts: ['Stakeholders'],
    };
    const wrapper = mountReference(field, 'Alice');
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).value).toBe('Alice');
  });

  it('shows suggestions filtered by target_concepts', async () => {
    const field: FieldDefinition = {
      name: 'owner',
      type: 'reference',
      target_concepts: ['Stakeholders'],
    };
    const wrapper = mountReference(field, '');

    const input = wrapper.find('input');
    await input.trigger('focus');
    await wrapper.vm.$nextTick();

    const items = wrapper.findAll('li');
    expect(items.length).toBe(2);
    expect(items[0].text()).toBe('Alice');
    expect(items[1].text()).toBe('Bob');
  });

  it('clears value on empty input', async () => {
    const updateFn = vi.fn();
    const field: FieldDefinition = {
      name: 'owner',
      type: 'reference',
      target_concepts: ['Stakeholders'],
    };
    const wrapper = mountReference(field, 'Alice', updateFn);

    const input = wrapper.find('input');
    await input.setValue('');

    expect(updateFn).toHaveBeenCalledWith('owner', '');
  });

  it('calls updateField when suggestion is selected', async () => {
    const updateFn = vi.fn();
    const field: FieldDefinition = {
      name: 'owner',
      type: 'reference',
      target_concepts: ['Stakeholders'],
    };
    const wrapper = mountReference(field, '', updateFn);

    const input = wrapper.find('input');
    await input.trigger('focus');
    await wrapper.vm.$nextTick();

    const items = wrapper.findAll('li');
    await items[1].trigger('mousedown');

    expect(updateFn).toHaveBeenCalledWith('owner', 'Bob');
  });
});
