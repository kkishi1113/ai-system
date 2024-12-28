"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ListTodo } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div className="flex space-x-2 bg-background border rounded-full p-2 shadow-lg">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/todo">
            <ListTodo className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
