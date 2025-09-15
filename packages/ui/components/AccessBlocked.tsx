"use client";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";

export function AccessBlocked() {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-xl w-full">
        <CardBody className="space-y-4">
          <h2 className="text-2xl font-semibold">Subscription required</h2>
          <p className="text-foreground-500">
            Your free trial has ended or your subscription is inactive. To continue
            using CasaBoard, choose a plan.
          </p>
          <div className="flex gap-3">
            <Button as={Link} href="/billing" color="primary">
              View plans
            </Button>
            <Button as={Link} href="/api/billing/portal" variant="flat">
              Manage subscription
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


