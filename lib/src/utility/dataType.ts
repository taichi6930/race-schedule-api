


export const DataLocation = {
    Storage: 'storage',
    Web: 'web',
} as const;


export type DataLocationType = (typeof DataLocation)[keyof typeof DataLocation];
