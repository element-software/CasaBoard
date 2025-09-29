"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrialSetupLoader from "./TrialSetupLoader";

interface TrialSetupWrapperProps {
  trialCreated: boolean;

}

export default function TrialSetupWrapper({ 
  trialCreated, 
}: TrialSetupWrapperProps) {
  const [isLoading, setIsLoading] = useState(trialCreated);
  const [loadingMessage, setLoadingMessage] = useState("Creating your subscription...");
  const router = useRouter();

  useEffect(() => {
    if (!trialCreated) {
      setIsLoading(false);
      return;
    }

    // Show loading screen while Stripe processes the trial subscription
    const checkTrialStatus = async () => {
      const messages = [
        "Creating your subscription...",
        "Setting up your trial...",
        "Almost ready...",
        "Finalizing setup..."
      ];
      
      let messageIndex = 0;
      setLoadingMessage(messages[messageIndex]);
      
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, 3000);

      // Check trial status every 2 seconds
      const checkInterval = setInterval(async () => {
        try {
          const response = await fetch('/api/check-trial-status');
          const data = await response.json();
          
           if (data.isTrial) {
             clearInterval(checkInterval);
             clearInterval(messageInterval);
             setIsLoading(false);
             // Redirect to main setup page when trial is ready
             router.push('/setup');
           }
        } catch (error) {
          console.error('Error checking trial status:', error);
        }
      }, 5000);

       // Timeout after 30 seconds
       setTimeout(() => {
         clearInterval(checkInterval);
         clearInterval(messageInterval);
         setIsLoading(false);
         // Redirect to setup page even if trial check fails
         router.push('/setup');
       }, 30000);
    };

    checkTrialStatus();
  }, [trialCreated, router]);

  if (isLoading) {
    return (
      <TrialSetupLoader 
        message={loadingMessage}
      />
    );
  }

}
