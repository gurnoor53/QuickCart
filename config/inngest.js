import { Inngest } from "inngest";
import User from "../models/user";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


// inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
    },
    {
        event: 'clerk/user.created',
    },
    async ({ event }) => {
        const { id, emailAddresses, firstName, lastName, image_url } = event.data;
        const userData = {
            _id: id,
            email: emailAddresses[0].emailAddress,
            name: firstName + " " + lastName,
            imageUrl: image_url,
        }

         await connectDB();
        await User.create(userData);
    }
)

// inngest function to update user data to database
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
    },
    {
        event: 'clerk/user.updated',
    },
    async ({ event }) => {
        const { id, emailAddresses, firstName, lastName, image_url } = event.data;
        const userData = {
            email: emailAddresses[0].emailAddress,
            name: firstName + " " + lastName,
            imageUrl: image_url,
        }

        await connectDB();
        await User.findByIdAndUpdate(id, userData, )
    }
)

// inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk',
    },
    {
        event: 'clerk/user.deleted',
    },
    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)