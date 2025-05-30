import mongoose from 'mongoose';


type ConnectionObject = {
    isConnected?: number  //we get connection strings or number when connected to db
}

const connection:ConnectionObject = {} //initially empty

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log('already connected to db');
        return
    }

    try{
        const db=await mongoose.connect(process.env.MONGODB_URI as string, )

        connection.isConnected=db.connections[0].readyState 

        console.log('connected to db');
    } catch(error){
        console.log('error connecting to db',error);
        
        // Graceful exit in case of a connection error
        // process.exit(1);
    }
}

export default dbConnect;