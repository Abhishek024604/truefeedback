import {z} from 'zod'; // zod is used for validation purposes

export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean()
})