

import { format } from 'date-fns';


export function Logger(
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
        const constructorName = Object.getPrototypeOf(this).constructor.name;
        const startTime = Date.now();
        console.log(
            `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 開始`,
        );
        try {
            const result: unknown = await originalMethod.apply(this, args);
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            console.log(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 終了`,
                `(${elapsed} ms)`,
            );
            return result;
        } catch (error) {
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            console.error(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] エラー (${elapsed} ms)`,
                error,
            );
            throw error;
        }
    };
}


if (process.env.IS_DEBUG === 'false') {
    console.debug = (): void => {
        
    };
}
