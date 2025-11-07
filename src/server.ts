//inicializar o servidor
import { app } from "./app";

(async () => {
  const port = process.env.PORT || 3000;
  try {
    await app.start(port);
    app.logger.info(` app is running! ${port}`);
  } catch (error) {
    app.logger.info(`app is not running! :c ${error} `);
  }
})();
