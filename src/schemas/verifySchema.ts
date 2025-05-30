import {z} from 'zod'; // zod is used for validation purposes

 export const verifySchema = z.object({
    code: z.string().length(6,"Code must be at least 6 characters long")
 })