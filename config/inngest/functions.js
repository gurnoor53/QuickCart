import { Inngest } from "inngest";
import User from "../../models/user";
import connectDB from "../db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-creation',
    },
    {
        event: 'clerk/user.created',
    },
    async ({ event }) => {
        try {
            const { id, emailAddresses, firstName, lastName, image_url } = event.data;
            
            if (!id || !emailAddresses?.[0]?.emailAddress) {
                throw new Error('Missing required user data');
            }

            const userData = {
                _id: id,
                email: emailAddresses[0].emailAddress,
                name: `${firstName || ''} ${lastName || ''}`.trim() || 'Anonymous',
                imageUrl: image_url || '',
            }

            await connectDB();
            await User.create(userData);
        } catch (error) {
            console.error('Error in syncUserCreation:', error);
            throw error;
        }
    }
)

// inngest function to update user data to database
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-update',
    },
    {
        event: 'clerk/user.updated',
    },
    async ({ event }) => {
        try {
            const { id, emailAddresses, firstName, lastName, image_url } = event.data;
            
            if (!id) {
                throw new Error('Missing user ID');
            }

            const userData = {
                email: emailAddresses?.[0]?.emailAddress,
                name: `${firstName || ''} ${lastName || ''}`.trim() || 'Anonymous',
                imageUrl: image_url || '',
            }

            await connectDB();
            await User.findByIdAndUpdate(id, userData, { new: true });
        } catch (error) {
            console.error('Error in syncUserUpdate:', error);
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
            const { id } = event.data;
            
            if (!id) {
                throw new Error('Missing user ID');
            }

            await connectDB();
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error in syncUserDeletion:', error);
            throw error;
        }
    }
) 