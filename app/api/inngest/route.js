import { serve } from "inngest/next";
import { inngest } from "../../../config/inngest/functions";
import {
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
} from "../../../config/inngest/functions";

// Serve the functions with Inngest
export const { GET, POST } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
  // Add middleware to handle CORS and other headers
  middleware: {
    cors: true,
  },
});