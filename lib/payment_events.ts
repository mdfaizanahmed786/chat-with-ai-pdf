// @ts-ignore
switch (event?.type) {
    case 'checkout.session.completed':
        // @ts-ignore
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'customer.subscription.deleted':
        // @ts-ignore
      const customerSubscriptionDeleted = event.data.object;
      // Then define and call a function to handle the event customer.subscription.deleted
      break;
    case 'payment_intent.succeeded':
        // @ts-ignore
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case 'subscription_schedule.canceled':
        // @ts-ignore
      const subscriptionScheduleCanceled = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.canceled
      break;
    // ... handle other event types
    default:
        // @ts-ignore
      console.log(`Unhandled event type ${event.type}`);
  }