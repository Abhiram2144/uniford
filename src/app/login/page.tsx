"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
const Login = () => {

  // getting the router object for navigation purposes
  const router = useRouter();

  // setting the error message to an empty string
  const [error, setError] = useState("");

  // getting the session object from the useSession hook
  const { data: session, status: sessionStatus } = useSession();

  // setting the email and password to an empty string by using a state hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  useEffect(() => {
    // if the session status is authenticated, we are redirecting the user to the dashboard page
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    // checking if the email is valid or not using regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    const templateParams = {
      to_name : email,
      message : "Welcome to our app!",
      from_name: "abhiram.sathiraju@gmail.com"
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }
    // sending the email and password to the server for authentication
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    // if the response contains an error, we are showing an error message to the user
    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) 
      {
        router.replace("/dashboard");
      }
    } else {
      setError("");
      emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",process.env.NEXT_PUBLIC_EMAILJS_LOGIN_TEMPLATE_ID || "",templateParams,process.env.NEXT_PUBLIC_EMAILJS_USER_ID).catch((err: any) => {
        console.log("Error sending email",err);
      });
    }
    
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {" "}
              Sign In
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            onClick={() => {
              signIn("google");
            }}
          >
            Sign In with Google
          </button>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/register"
          >
            Register Here
          </Link>
        </div>
      </div>
    )
  );
};

export default Login;
