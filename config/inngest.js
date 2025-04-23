import { Inngest } from "inngest";
import User from "../models/user";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: process.env.INNGEST_ID || "quickcart-next",
  signingKey: process.env.INNGEST_SIGNING_KEY
});

// Ensure database connection is established before processing events
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
    },
    {
        event: 'clerk/user.created',
    },
    async ({ event }) => {
        try {
            await ensureDBConnection();
            const { id, emailAddresses, firstName, lastName, image_url } = event.data;
            const userData = {
                _id: id,
                email: emailAddresses[0].emailAddress,
                name: firstName + " " + lastName,
                imageUrl: image_url,
            }
            await User.create(userData);
        } catch (error) {
            console.error("Error in syncUserCreation:", error);
            throw error;
        }
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
        try {
            await ensureDBConnection();
            const { id, emailAddresses, firstName, lastName, image_url } = event.data;
            const userData = {
                email: emailAddresses[0].emailAddress,
                name: firstName + " " + lastName,
                imageUrl: image_url,
            }
            await User.findByIdAndUpdate(id, userData, { new: true });
        } catch (error) {
            console.error("Error in syncUserUpdate:", error);
            throw error;
        }
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
        try {
            await ensureDBConnection();
            const { id } = event.data;
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error in syncUserDeletion:", error);
            throw error;
        }
    }
)