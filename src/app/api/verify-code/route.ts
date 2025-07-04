import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    try{
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await userModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                {
                    status: 500
                }
            )
        }
        const isCodeValid = user.verifyCode === code   
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date() 

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: 'User verified successfully',
                },
                {
                    status: 200
                }
            )
        } else if(!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: 'expired code. sign up again to get a new code',
                },
                {
                    status: 400
                }
            )
        } else{
            return Response.json({
                success: false,
                message: 'Invalid code',
            },
             {
                status: 400
             }
           )
        }


    } catch(error){
        console.error("error verifying user",error)
        return Response.json(
            {
                success: false,
                message: 'Error in verifying user',
            },
            {
                status: 500
            }
        )
    }
}