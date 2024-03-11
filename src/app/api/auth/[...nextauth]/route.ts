import NextAuth, { NextAuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // credentials provider for email and password authentication
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // authorize function to check the credentials and return the user object if the credentials are correct
      async authorize(credentials: any) {
        // connecting to the database
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    // google provider for google authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
  // callbacks for the signIn function
  callbacks: {
  async signIn({ user, account }: { user: AuthUser; account: Account | null }):Promise<string | boolean> {
    // if the provider is credentials, we are checking the user credentials and returning the user object if the credentials are correct  
    if (account?.provider == "credentials") {
          return true;
      }
      // if the provider is google, we are connecting to the database and checking if the user is already registered or not
      if (account?.provider == "google") {
          await connect();
          try {
              const existingUser = await User.findOne({ email: user.email });
              if (!existingUser) {
                  const newUser = new User({
                      email: user.email,
                  });

                  await newUser.save();
                  return true;
              }

              return true;
          } catch (err) {
              console.log("Error saving user", err);
              return false;
          }
      }
      return "error";
  }
  },
};

// exporting the handler to be used in the main index file
export const handler = NextAuth(authOptions) as never;
export { handler as GET, handler as POST };