import { format } from 'date-fns';

export function Logger(
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
        const constructorName = Object.getPrototypeOf(this).constructor.name;

        console.log(
            `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 開始`,
        );
        try {
            const result: unknown = await originalMethod.apply(this, args);
            console.log(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 終了`,
            );
            return result;
        } catch (error) {
            console.error(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] エラー`,
                error,
            );
            throw error;
        }
    };
}

// cdkで保存したENVがproductionの場合、console.errorをオーバーライドする
if (process.env.IS_DEBUG === 'false') {
    console.debug = (): void => {
        // Debugging is disabled in production
    };
}
