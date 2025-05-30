import {z} from 'zod'; // zod is used for validation purposes

export const usernameValidation= z
.string()
.min(3,"Username must be at least 3 characters long")
.max(20,"Username must be at most 20 characters long")
.regex(/^[a-zA-Z0-9_]*$/,"Username can only contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),  // if email is not valid send message
    password: z.string().min(8,"Password must be at least 8 characters long")
})