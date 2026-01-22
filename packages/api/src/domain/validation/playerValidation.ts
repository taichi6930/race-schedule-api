import { z } from 'zod';

export class ValidationError extends Error {
    public readonly status: number;

    public constructor(message: string, status = 400) {
        super(message);
        this.name = 'ValidationError';
        this.status = status;
    }
}

const playerUpsertSchema = z
    .object({
        race_type: z.string().min(1, 'race_type is required'),
        player_no: z
            .union([z.string(), z.number()])
            .transform((value) => value.toString())
            .refine((value) => value.length > 0, 'player_no is required'),
        player_name: z.string().min(1, 'player_name is required'),
        priority: z.coerce.number().int('priority must be an integer'),
    })
    .strict();

export type PlayerUpsertSchema = z.infer<typeof playerUpsertSchema>;

const playerUpsertPayloadSchema = z.union([
    playerUpsertSchema,
    z.array(playerUpsertSchema),
]);

export const parsePlayerUpsertPayload = (
    body: unknown,
): PlayerUpsertSchema[] => {
    const result = playerUpsertPayloadSchema.safeParse(body);
    if (!result.success) {
        const issueMessages = result.error.issues.map((issue) => issue.message);
        const message =
            issueMessages.length > 0
                ? `Invalid request body: ${issueMessages.join(', ')}`
                : 'Invalid request body';
        throw new ValidationError(message);
    }

    return Array.isArray(result.data) ? result.data : [result.data];
};
