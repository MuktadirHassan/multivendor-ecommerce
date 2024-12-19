import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginRequest } from "~/types/user";

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!
        console.log("credentials:", credentials);
        const data = await login(credentials);
        console.log("login data", data);
        if (!data) {
          return null;
        }
        return data.user;
      },
    }),
  ],
});

const login = async (credentials: LoginRequest) => {
  const baseUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    console.log("response", data, credentials);

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
