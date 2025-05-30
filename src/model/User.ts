import mongoose,{Schema, Document} from 'mongoose'; // document used for typescrip

export interface Message extends Document{  //document created in mongoose
    content:string;
    createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export interface User extends Document{  
    username:string;
    email: string;
    password: string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages: Message[]
}

const UserSchema:Schema<User> = new Schema({
   username:{
         type:String,
        required:[true,"Username is required"],
         trim:true,
         unique:true
   },
   email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"Please fill a valid email address"]
   },
    password:{
          type:String,
          required:[true,"Password is required"],
          
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema] // message is an array of MessageSchema
})

const userModel= (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema) // either it is first time or otherwise it is already present

export default userModel; //exporting the user model for use in other files.