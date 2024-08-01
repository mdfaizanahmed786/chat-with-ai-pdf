
// This we are doing like in nodejs instance and there is a separate library for the client as well....
import Stripe from 'stripe';

const stripeAPIKey = process.env.STRIPE_API_KEY

if(!stripeAPIKey){
    throw new Error("Stripe API key not found")
}

const stripe=new Stripe(stripeAPIKey)

export default stripe;