import 'reflect-metadata';

import { registerApplication } from './di/application';
import { registerInfrastructure } from './di/infrastructure';

/**
 * DIコンテナの初期化
 */
export const initializeDI = (): void => {
    registerInfrastructure();
    registerApplication();
};

// 自動初期化
initializeDI();
