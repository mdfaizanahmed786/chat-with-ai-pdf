"use client";
import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStripePortal } from "@/actions/createStripePortal";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { useUser } from "@clerk/nextjs";
import { UserDetails } from "@/app/dashboard/upgrade/page";
import getStripe from "@/lib/stripe-js";


function UpgradeButton() {
  const { loading, hasActiveMembership } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router=useRouter();
  const {user}=useUser();  

  if (!user) return;
    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };
  const handleUpgrade = () => {
    startTransition(async () => {
        const stripe=await getStripe();
        if (hasActiveMembership) {
            // Create stripe portal
            // What is portal? It is a way to manage subscription
            const stripeURL = await createStripePortal();
            return router.push(stripeURL);
        }
        const sessionId = await createCheckoutSession(userDetails);
        await stripe?.redirectToCheckout({
            sessionId,
        });
    });
  };
  if (loading || isPending)
    return (
      <Button variant="outline" disabled>
        <p className="animate-spin h-5 w-5 rounded-lg ring-3 ring-indigo-600"></p>
      </Button>
    );
  return (
    <Button onClick={handleUpgrade} variant="outline">
      {hasActiveMembership ? "PRO Account" : "Upgrade"}
    </Button>
  );
}
export default UpgradeButton;
