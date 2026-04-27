"use client";
import { Card, CardBody, Spinner } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiRocketLaunch } from "@mdi/js";

interface TrialSetupLoaderProps {
  message?: string;
}

export default function TrialSetupLoader({ 
  message = "Creating your subscription..." 
}: TrialSetupLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardBody className="p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <Icon path={mdiRocketLaunch} className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Setting up your account
            </h1>
            <p className="text-foreground-600">
              We're setting up your account. This will just take a moment...
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="lg" color="primary" />
            <p className="text-sm text-foreground-500">
              {message}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
