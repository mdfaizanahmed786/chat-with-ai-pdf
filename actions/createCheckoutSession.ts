"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const getBaseURL=()=>process.env.NODE_ENV==="development" ? "http://localhost:3000" : process.env.VERCEL_URL;

export async function createCheckoutSession(userDetails: UserDetails) {
  auth().protect();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();
  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    // Create a new customer session...
    const stripeAddress: Stripe.AddressParam = {
      line1: "Mumbai",
      line2: "Mumbai",
      city: "Mumbai",
      country: "India",
      postal_code: "400001",
      state: "Maharashtra",
    };

    // 4000003560000008: use this one
    console.log(userDetails, "DDJDJJDJ")
    const newCustomer = await stripe.customers.create({
      name: userDetails.name, 
      email: userDetails.email,
      address: stripeAddress,
      // Below we are doing to connect clerk user with stripe customer
      metadata: {
        userId,
      },
    });

    await adminDb.collection("users").doc(userId).set({
      stripeCustomerId: newCustomer.id,
    });

    stripeCustomerId = newCustomer.id;
  }
 

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    currency:"inr",
   customer: stripeCustomerId,

    
    line_items: [
      {
        price: "price_1Pis2ASDuK1WVKqU4vGXHAeZ",
        quantity: 1,
      },
    ],
    mode: "subscription",
    
    success_url: `${getBaseURL()}/dashboard?upgrade=true`,  
    cancel_url: `${getBaseURL()}/dashboard/upgrade`,
  });

  return session.id
}
