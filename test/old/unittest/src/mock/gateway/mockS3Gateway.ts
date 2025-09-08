import type { IS3Gateway } from '../../../../../../lib/src/gateway/interface/iS3Gateway';

export const mockS3Gateway = (): jest.Mocked<IS3Gateway> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};
