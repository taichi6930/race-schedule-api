import express from 'express';

import apiRouter from './router/apiRouter';

const app = express();
app.use(express.json());
app.use(apiRouter);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
    console.log(`Scraping API server running on port ${PORT}`);
});
