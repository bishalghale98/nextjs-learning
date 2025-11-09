"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <p className="text-lg mb-4">
        Signed in as <strong>{session?.user?.email}</strong>
      </p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
};

export default DashboardPage;
