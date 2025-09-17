"use client";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiLockAlertOutline } from "@mdi/js";

export function AccessBlocked() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl border-none shadow-large">
        <CardBody className="p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Icon path={mdiLockAlertOutline} className="w-7 h-7 text-warning" />
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-semibold">Subscription required</h1>
              <p className="text-foreground-500">
                Your free trial has ended or your subscription is inactive. To continue using CasaBoard, please choose a plan or manage your subscription.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button as={Link} href="/auth/profile/billing" color="primary" className="sm:min-w-[160px]">
                  View plans
                </Button>
                <Button as={Link} href="/api/billing/portal" variant="flat" className="sm:min-w-[200px]">
                  Manage subscription
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


