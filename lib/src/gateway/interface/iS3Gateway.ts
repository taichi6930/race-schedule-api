
export interface IS3Gateway {
    
    uploadDataToS3: (
        data: object[],
        folderPath: string,
        fileName: string,
    ) => Promise<void>;
    
    fetchDataFromS3: (folderPath: string, fileName: string) => Promise<string>;
}
