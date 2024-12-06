<?php

namespace App\Http\Controllers;

use Stripe\StripeClient;

class StripeController extends Controller
{
    /**
     * Initialize payment setup for Stripe
     */
    public function initializePayment()
    {
        $stripe = new StripeClient(config('services.stripe.secret'));

        // Create a new customer
        $customer = $stripe->customers->create();

        // Create ephemeral key
        $ephemeralKey = $stripe->ephemeralKeys->create([
            'customer' => $customer->id,
        ], [
            'stripe_version' => '2024-11-20.acacia',
        ]);

        // Create payment intent
        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => 1099,
            'currency' => 'eur',
            'customer' => $customer->id,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);

        // Return response
        return response()->json([
            'paymentIntent' => $paymentIntent->client_secret,
            'ephemeralKey' => $ephemeralKey->secret,
            'customer' => $customer->id,
            'publishableKey' => config('services.stripe.key')
        ]);
    }
}
