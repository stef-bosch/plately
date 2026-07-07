import { createServer } from './api/server';
import { InMemoryRepository } from './data/inMemoryRepository';

const repo = new InMemoryRepository();
const app = createServer(repo);
const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Nutrition backend listening on http://localhost:${port} (in-memory seed data)`);
});
