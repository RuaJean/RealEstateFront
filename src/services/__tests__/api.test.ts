import { api, toApiError } from '@/services/api';
import AxiosMockAdapter from 'axios-mock-adapter';

describe('api client', () => {
  const mock = new AxiosMockAdapter(api);
  beforeEach(() => {
    mock.reset();
    // limpiar cookies/localStorage
    Object.defineProperty(window.document, 'cookie', { writable: true, value: '' });
    window.localStorage.clear();
  });

  it('agrega Authorization desde localStorage', async () => {
    localStorage.setItem('accessToken', 'abc');
    mock.onGet('/ping').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer abc');
      return [200, {}];
    });
    await api.get('/ping');
  });

  it('agrega Authorization desde cookie si no hay localStorage', async () => {
    document.cookie = 'accessToken=xyz';
    mock.onGet('/ping').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer xyz');
      return [200, {}];
    });
    await api.get('/ping');
  });

  it('convierte error axios a ApiError y maneja 401', async () => {
    mock.onGet('/secure').reply(401, { message: 'Unauthorized' });
    try {
      await api.get('/secure');
      throw new Error('should fail');
    } catch (e: any) {
      const err = e as ReturnType<typeof toApiError>;
      expect(err.status).toBe(401);
      expect(err.message).toBe('Unauthorized');
    }
  });
});
