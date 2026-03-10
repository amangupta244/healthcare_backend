import app from './src/app.js';
import config from './src/config/index.js';
import logger from './src/config/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
