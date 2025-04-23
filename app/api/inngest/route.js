import { serve } from "inngest/next";
import { inngest } from "../../../config/inngest";
import {
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
} from "../../../config/inngest/functions";

// Serve the functions with Inngest
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
  middleware: {
    onError: (error) => {
      console.error("Inngest error:", error);
      return {
        status: 500,
        body: { error: "Internal server error" }
      };
    }
  }
});