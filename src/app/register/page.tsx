"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import emailjs from "@emailjs/browser";

const Register = () => {
  // setting the error message to an empty string
  const [error, setError] = useState("");
  // getting the router object for navigation purposes
  const router = useRouter();
  // getting the session object from the useSession hook
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
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
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    try {
      // sending the email and password to the server
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      // if the status is 400, it means the email is already registered so we are showing an error message on that case
      if (res.status === 400) {
        setError("This email is already registered");
      }
      // if the status is 200, it means the email is registered successfully and we are redirecting the user to the login page
      if (res.status === 200) {
        // sending a welcome email to the user
        const templateParams = {
          to_name : email,
          message : "Welcome to our app!",
          from_name: "abhiram.sathiraju@gmail.com"
        }
        // sending the email using emailjs
        emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",process.env.NEXT_PUBLIC_EMAILJS_SIGNUP_TEMPLATE_ID || "",templateParams,process.env.NEXT_PUBLIC_EMAILJS_USER_ID).then((res: any) => {
          console.log("Email sent successfully",res);
        }
        ).catch((err: any) => {
          console.log("Error sending email",err);
        });

        setError("");
        // redirecting the user to the login page
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  // if the session is loading, we are showing a loading message on the screen
  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">Register</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {" "}
              Register
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/login"
          >
            Login with an existing account
          </Link>
        </div>
      </div>
    )
  );
};

export default Register;
