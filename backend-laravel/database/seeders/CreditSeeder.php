<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Credits;
use App\Models\CreditPurchase;

class CreditSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Give each user some initial credits
            Credits::create([
                'user_id' => $user->id,
                'amount' => rand(100, 1000)
            ]);

            // Create purchase history
            $startDate = now()->subYear();
            $endDate = now();

            // Create 5-15 purchases per user over the year
            $numPurchases = rand(5, 15);

            for ($i = 0; $i < $numPurchases; $i++) {
                $creditsBought = rand(50, 200);
                CreditPurchase::create([
                    'user_id' => $user->id,
                    'credits_bought' => $creditsBought,
                    'balance_after' => $creditsBought,
                    'price' => $creditsBought * 10,
                    'currency' => 'DKK',
                    'payment_method' => rand(0, 1) ? 'credit_card' : 'mobile_pay',
                    'created_at' => fake()->dateTimeBetween($startDate, $endDate)
                ]);
            }
        }
    }
}
