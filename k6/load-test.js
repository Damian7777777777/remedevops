import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:3000';
export default function () {
  // Test health
  const health = http.get(`${BASE_URL}/health`);
  check(health, {
    'health status 200': (r) => r.status === 200,
  });

  // Test register
  const register = http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify({ username: `user_${Math.random()}`, password: '123456' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(register, {
    'register status 200': (r) => r.status === 200,
  });

  sleep(1);
}
