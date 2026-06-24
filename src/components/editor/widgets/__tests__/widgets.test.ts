import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDocumentStore } from '../../../../stores/document';
import { useMetamodelStore } from '../../../../stores/metamodel';

describe('resolveWidget', () => {
  it('should return the correct component for each type', async () => {
    const { resolveWidget } = await import('../index');
    const { default: FieldString } = await import('../FieldString.vue');
    const { default: FieldBoolean } = await import('../FieldBoolean.vue');
    const { default: FieldNumber } = await import('../FieldNumber.vue');
    const { default: FieldSelect } = await import('../FieldSelect.vue');
    const { default: FieldReference } = await import('../FieldReference.vue');

    expect(resolveWidget('string')).toBe(FieldString);
    expect(resolveWidget('boolean')).toBe(FieldBoolean);
    expect(resolveWidget('number')).toBe(FieldNumber);
    expect(resolveWidget('select')).toBe(FieldSelect);
    expect(resolveWidget('reference')).toBe(FieldReference);
  });

  it('should fall back to string for unknown types', async () => {
    const { resolveWidget } = await import('../index');
    const { default: FieldString } = await import('../FieldString.vue');

    expect(resolveWidget('unknown')).toBe(FieldString);
    expect(resolveWidget('')).toBe(FieldString);
  });
});

describe('Document Store — renameBlock reference field scanning', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should update reference field values matching the old name', () => {
    const store = useDocumentStore();
    const metamodel = useMetamodelStore();

    metamodel.concepts = [
      {
        name: 'Stakeholders',
        icon: '',
        type: 'list',
        description: '',
        fields: [
          { name: 'owner', type: 'reference', target_concepts: ['Stakeholders'] },
        ],
      },
    ];

    store.modelTree = [
      {
        id: '1',
        name: 'Task A',
        type: 'Stakeholders',
        description: '',
        fields: { owner: 'Alice' },
        children: [],
      },
    ];

    store.renameBlock('Alice', 'Alicia', 'tree-node');

    expect(store.modelTree[0].fields!.owner).toBe('Alicia');
  });

  it('should not update non-matching field values', () => {
    const store = useDocumentStore();
    const metamodel = useMetamodelStore();

    metamodel.concepts = [
      {
        name: 'Stakeholders',
        icon: '',
        type: 'list',
        description: '',
        fields: [
          { name: 'owner', type: 'reference', target_concepts: ['Stakeholders'] },
        ],
      },
    ];

    store.modelTree = [
      {
        id: '1',
        name: 'Task A',
        type: 'Stakeholders',
        description: '',
        fields: { owner: 'Bob' },
        children: [],
      },
    ];

    store.renameBlock('Alice', 'Alicia', 'tree-node');

    expect(store.modelTree[0].fields!.owner).toBe('Bob');
  });

  it('should handle multiple nodes with reference fields', () => {
    const store = useDocumentStore();
    const metamodel = useMetamodelStore();

    metamodel.concepts = [
      {
        name: 'Stakeholders',
        icon: '',
        type: 'list',
        description: '',
        fields: [
          { name: 'owner', type: 'reference', target_concepts: ['Stakeholders'] },
        ],
      },
    ];

    store.modelTree = [
      {
        id: '1',
        name: 'Task A',
        type: 'Stakeholders',
        description: '',
        fields: { owner: 'Alice' },
        children: [
          {
            id: '2',
            name: 'Subtask',
            type: 'Stakeholders',
            description: '',
            fields: { owner: 'Alice' },
            children: [],
          },
        ],
      },
      {
        id: '3',
        name: 'Task B',
        type: 'Stakeholders',
        description: '',
        fields: { owner: 'Bob' },
        children: [],
      },
    ];

    store.renameBlock('Alice', 'Alicia', 'tree-node');

    expect(store.modelTree[0].fields!.owner).toBe('Alicia');
    expect(store.modelTree[0].children[0].fields!.owner).toBe('Alicia');
    expect(store.modelTree[1].fields!.owner).toBe('Bob');
  });
});
