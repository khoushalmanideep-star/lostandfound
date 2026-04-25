import type { ReactNode } from "react";
import { Card, CardHeader } from "@/components/ui/card";

type PageShellProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <Card className="w-full p-6 shadow-sm md:p-8">
      <CardHeader title={title} description={description} />
      {children}
    </Card>
  );
}
