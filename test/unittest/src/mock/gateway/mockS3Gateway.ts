import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { IRecord } from '../../../../../lib/src/gateway/record/iRecord';

export const mockS3Gateway = <T extends IRecord<T>>(): jest.Mocked<
    IS3Gateway<T>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};
