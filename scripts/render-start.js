import { startServer } from '../apps/payment-api/src/index.js';
import { startCheckoutServer } from '../apps/checkout-portal/src/index.js';

process.env.NODE_ENV = 'production';
process.env.YOUPI_MODE = 'production';
process.env.SQLITE_DB_PATH ||= process.env.RENDER ? '/var/data/youpi_pg.sqlite' : './data/render-test.sqlite';

const publicPort = Number(process.env.PORT || 10000);
const apiPort = 6100;

let api;
let checkout;

async function shutdown() {
  try {
    if (checkout) await checkout.close();
    if (api) await api.close();
  } finally {
    process.exit(0);
  }
}

try {
  // Start the API on loopback; only the checkout portal is public.
  process.env.YOUPI_BIND_HOST = '127.0.0.1';
  process.env.PAYMENT_API_PORT = String(apiPort);
  api = await startServer(apiPort);

  // Expose checkout on Render's public port.
  process.env.YOUPI_BIND_HOST = '0.0.0.0';
  process.env.BASE_PAYMENT_API_URL = `http://127.0.0.1:${apiPort}`;
  checkout = await startCheckoutServer(publicPort, {
    apiBaseUrl: `http://127.0.0.1:${apiPort}`
  });

  console.log(`Render checkout listening on port ${publicPort}`);
} catch (error) {
  console.error('Render startup failed:', error);
  await shutdown();
  process.exit(1);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

