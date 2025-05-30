'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react" // Importing Loader2 from lucide-react

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false) // a state to check if the username is being checked initially false
  const [isSubmitting, setIsSubmitting] = useState(false) // a state to check if the form is being submitted initially false
  const debounced = useDebounceCallback(setUsername, 300) // hook to debounce the username input after 300ms
  const router = useRouter()

  //zod implementation to validate the form inputs
const form = useForm<z.infer<typeof signUpSchema>>({
  resolver:zodResolver(signUpSchema),
  defaultValues:{
    username:'',
    email:'',
    password:''
  }
})

useEffect(() => {
   const checkUsernameUnique = async () =>{
    if(username){
      setIsCheckingUsername(true)
      setUsernameMessage('')
      try{
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        setUsernameMessage(response.data.message)
      } catch(error){
         const axiosError = error as AxiosError<ApiResponse>
         setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
      } finally{
        setIsCheckingUsername(false)
      }
    }
   }
    checkUsernameUnique()
},[username]) // useEffect to check if the username is available or not. it sends request to backend to check avialbility of username

const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  setIsSubmitting(true)
  try{
    const response = await axios.post<ApiResponse>('/api/sign-up', data)
    toast.success(response.data.message)
    router.replace(`/verify/${username}`)
    setIsSubmitting(false)
  } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message 
      console.log(errorMessage)
      toast.error(errorMessage || 'Error signing up') 
      setIsSubmitting(false) 
  }
}

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Join Mystery Message
      </h1>
      <p className="mb-4">Sign up to start your anonymous adventure
      </p>
    </div>

    
    <Form {...form}> 
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
                
              </FormControl>
              {
                isCheckingUsername && <Loader2 className="animate-spin"/>
              }
              <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500': 'text-red-500'}`}>
                test {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
         {
           isSubmitting ? (
            <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please wait...
            </>
           ) : ('Signup')
         }
        </Button>
    </form>
    </Form>
    <p>
      Already a member?{' '}
      <Link href="/sign-in"   className="text-blue-600 hover:text-blue-800">
        Sign in
      </Link>
    </p>
  </div>
</div>
  )
}

export default page