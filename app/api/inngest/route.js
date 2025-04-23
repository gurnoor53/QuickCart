import { serve } from "inngest/next";
import { inngest } from "../../../config/inngest";
import { syncUserCreation, syncUserUpdate, syncUserDeletion } from "../../../config/inngest";
export const { serve } = createServeHandler();
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
});
