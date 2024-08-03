"use server";

import { adminDb } from "@/firebaseAdmin";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createStripePortal() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await adminDb.collection("users").doc(userId).get();

  const stripeCustomerId = user.data()?.stripeCustomerId;
  if (!stripeCustomerId) {
    throw new Error("Stripe customer not found");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.VERCEL_URL}/dashboard`,
  });

  return portalSession.url;
}