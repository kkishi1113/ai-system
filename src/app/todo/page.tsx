"use client";

import ToDo from "@/components/todo/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TodoPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>TODOリスト</CardTitle>
        </CardHeader>
        <CardContent>
          <ToDo />
        </CardContent>
      </Card>
    </div>
  );
}
