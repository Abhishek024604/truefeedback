import {z} from 'zod'; // zod is used for validation purposes

export const signInSchema = z.object({
    identifier:z.string(),  // identifier can be anything like email
    password:z.string(),
})