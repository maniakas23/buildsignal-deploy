import { createRouter, publicQuery } from "./middleware";
export const authRouter = createRouter({ me: publicQuery.query(() => ({ id: 1, email: "user@example.com" })) });
