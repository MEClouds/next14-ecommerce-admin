"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export const BillboardCilent = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title="Billboard(0)"
          description="Mange billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeid}/billboards/new`)}
        >
          <Plus className="me-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
    </>
  );
};
