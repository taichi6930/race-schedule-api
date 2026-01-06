import type { PlaceMasterEntity } from '../../domain/entity/placeMasterEntity';

export interface IPlaceMasterRepository {
    fetchAll: () => Promise<PlaceMasterEntity[]>;
    upsert: (entity: PlaceMasterEntity) => Promise<void>;
}
