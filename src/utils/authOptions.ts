
import NextAuth, { NextAuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: any) {
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
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      // ...add more providers here
    ],
    callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account | null }):Promise<string | boolean> {
        if (account?.provider == "credentials") {
            return true;
        }
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