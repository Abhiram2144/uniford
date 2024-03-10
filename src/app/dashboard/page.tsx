import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen  p-24">
      <h1>Welcome to the Protected Route</h1>
    </div>
  );
};

export default Dashboard;
