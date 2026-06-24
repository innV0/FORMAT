// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, provide, ref } from 'vue';
import { UpdateFieldKey } from '../injection';
import FieldString from '../FieldString.vue';
import FieldBoolean from '../FieldBoolean.vue';
import FieldNumber from '../FieldNumber.vue';
import FieldSelect from '../FieldSelect.vue';
import type { FieldDefinition } from '../../../../types';

function mountWithProvider(component: any, fieldDef: FieldDefinition, value: any, updateFn = vi.fn()) {
  const wrapper = component;
  const Wrapper = defineComponent({
    setup() {
      provide(UpdateFieldKey, updateFn);
      return () => h(wrapper, { field: fieldDef, value, readonly: false });
    },
  });
  return mount(Wrapper);
}

describe('FieldString', () => {
  it('renders a text input with correct value', () => {
    const field: FieldDefinition = { name: 'owner', type: 'string' };
    const wrapper = mountWithProvider(FieldString, field, 'Alice');
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.type).toBe('text');
    expect((input.element as HTMLInputElement).value).toBe('Alice');
  });

  it('emits updateField on input', async () => {
    const updateFn = vi.fn();
    const field: FieldDefinition = { name: 'owner', type: 'string' };
    const wrapper = mountWithProvider(FieldString, field, 'Alice', updateFn);
    await wrapper.find('input').setValue('Bob');
    expect(updateFn).toHaveBeenCalledWith('owner', 'Bob');
  });
});

describe('FieldBoolean', () => {
  it('renders a checkbox', () => {
    const field: FieldDefinition = { name: 'active', type: 'boolean' };
    const wrapper = mountWithProvider(FieldBoolean, field, true);
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
  });

  it('emits updateField on change', async () => {
    const updateFn = vi.fn();
    const field: FieldDefinition = { name: 'active', type: 'boolean' };
    const wrapper = mountWithProvider(FieldBoolean, field, false, updateFn);
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(updateFn).toHaveBeenCalledWith('active', true);
  });
});

describe('FieldNumber', () => {
  it('renders a number input with correct value', () => {
    const field: FieldDefinition = { name: 'count', type: 'number' };
    const wrapper = mountWithProvider(FieldNumber, field, 5);
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.type).toBe('number');
    expect((input.element as HTMLInputElement).value).toBe('5');
  });

  it('emits updateField with number on input', async () => {
    const updateFn = vi.fn();
    const field: FieldDefinition = { name: 'count', type: 'number' };
    const wrapper = mountWithProvider(FieldNumber, field, 0, updateFn);
    await wrapper.find('input').setValue('10');
    expect(updateFn).toHaveBeenCalledWith('count', 10);
  });
});

describe('FieldSelect', () => {
  it('renders a select with options', () => {
    const field: FieldDefinition = { name: 'priority', type: 'select', options: ['Low', 'Medium', 'High'] };
    const wrapper = mountWithProvider(FieldSelect, field, 'Medium');
    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);
    const options = select.findAll('option');
    expect(options.length).toBe(4); // placeholder + 3 options
  });

  it('emits updateField on change', async () => {
    const updateFn = vi.fn();
    const field: FieldDefinition = { name: 'priority', type: 'select', options: ['Low', 'High'] };
    const wrapper = mountWithProvider(FieldSelect, field, '', updateFn);
    await wrapper.find('select').setValue('High');
    expect(updateFn).toHaveBeenCalledWith('priority', 'High');
  });
});
