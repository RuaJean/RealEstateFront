import { api } from '@/services/api';
import AxiosMockAdapter from 'axios-mock-adapter';
import { listProperties, getPropertyById, createProperty, updateProperty, updatePropertyPrice, deleteProperty } from '@/services/property.service';

const mock = new AxiosMockAdapter(api);

beforeEach(() => mock.reset());

test('listProperties normaliza array simple', async () => {
  mock.onGet('/api/properties').reply(200, [{ id: '1', name: 'A' }]);
  const res = await listProperties();
  expect(res.items.length).toBe(1);
  expect(res.total).toBe(1);
});

test('getPropertyById', async () => {
  mock.onGet('/api/properties/1').reply(200, { id: '1', name: 'A' });
  const p = await getPropertyById('1');
  expect(p.id).toBe('1');
});

test('create/update/price/delete', async () => {
  mock.onPost('/api/properties').reply(200, { id: '2' });
  const created = await createProperty({} as any);
  expect(created.id).toBe('2');

  mock.onPut('/api/properties/2').reply(200);
  await updateProperty('2', {} as any);

  mock.onPatch('/api/properties/2/price').reply(200);
  await updatePropertyPrice('2', { amount: 10, currency: 'USD' } as any);

  mock.onDelete('/api/properties/2').reply(200);
  await deleteProperty('2');
});
