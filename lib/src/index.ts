import 'reflect-metadata';
import '../container'; 

import serverlessExpress from '@codegenie/serverless-express';
import type { Application } from 'express';
import express from 'express';
import { container } from 'tsyringe';

import { PublicGamblingController } from './controller/publicGamblingController';


const app: Application = express();


const publicGamblingController = container.resolve(PublicGamblingController);


app.use(express.json());


app.use('/api/races/all', publicGamblingController.router);


app.get('/health', (_, res) => {
    res.send('ok health check');
});


export const handler = serverlessExpress({ app });


const PORT = process.env.PORT ?? '3000';
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
