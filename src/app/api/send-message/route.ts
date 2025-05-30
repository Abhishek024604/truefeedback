import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) { // post request to send a message to a user
    await dbConnect(); 
    const {username, content} = await request.json(); // get the username and content from the request body
    try{
        const user = await userModel.findOne({username}); // find the user in the database
        if(!user) {
            return Response.json({
                success:false,
                message: "User not found"
            },{
                status: 404
            })
        }

        if(!user.isAcceptingMessage) {
            return Response.json({
                success:false,
                message: "User is not accepting messages"
            },{
                status: 403
            })
        }

        const newMessage = {
            content, createdAt: new Date()
        }
        user.messages.push(newMessage as Message); // push the new message to the user's messages array // asserting newMessage as Message to avoid type error
        await user.save(); // save the user to the database
        return Response.json({
            success:true,
            message: "Message sent successfully",
            
        },
    {
        status: 200
    })

    } catch(error){
        console.log("failed to send message",error);
        return Response.json({
            success: false,
            message: 'Failed to send message',
        },
        {
            status: 500
        })
    }
}