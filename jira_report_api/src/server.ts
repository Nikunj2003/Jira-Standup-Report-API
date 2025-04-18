import { createApp } from '@/app';
import logger from '@/utils/logger';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});