import {loadStripe, Stripe} from '@stripe/stripe-js';


let stripePromise: Promise<Stripe | null>;

if(!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY){
    throw new Error("Stripe public key not found")
}

const getStripe=():Promise<Stripe | null>=>{
// checking if its already loaded
    if(!stripePromise){
        stripePromise=loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
    }
    return stripePromise;

}

export default getStripe;