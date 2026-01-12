import 'reflect-metadata';

import { container } from 'tsyringe';

import { R2Gateway } from './gateway/implement/r2Gateway';
import type { IR2Gateway } from './gateway/interface/IR2Gateway';
import { PlaceHtmlR2Repository } from './repository/implement/placeHtmlRepository';
import type { IPlaceHtmlRepository } from './repository/interface/IPlaceHtmlRepository';

container.register<IR2Gateway>('R2Gateway', {
    useClass: R2Gateway,
});

// PlaceHtmlR2RepositoryのDI登録
container.register<IPlaceHtmlRepository>('PlaceHtmlRepository', {
    useClass: PlaceHtmlR2Repository,
});
