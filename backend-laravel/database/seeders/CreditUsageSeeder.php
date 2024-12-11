<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CreditUsage;
use App\Models\User;
use App\Models\Machine;
use Carbon\Carbon;

class CreditUsageSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $machines = Machine::all();
        $startDate = Carbon::parse('2023-12-10');
        $endDate = Carbon::parse('2024-12-10');

        while ($startDate->lte($endDate)) {
            // Create 10-30 transactions per day
            $dailyTransactions = rand(10, 30);

            for ($i = 0; $i < $dailyTransactions; $i++) {
                $user = $users->random();
                $machine = $machines->random();
                $isRefund = rand(1, 100) <= 5; // 5% chance of refund

                CreditUsage::create([
                    'user_id' => $user->id,
                    'machine_id' => $machine->id,
                    'machine_type' => $machine->type,
                    'duration_minutes' => $machine->type === 'wash' ? 60 : 45,
                    'cost_credits' => $machine->type === 'wash' ? 20 : 15,
                    'balance_after' => rand(50, 500),
                    'type' => $isRefund ? 'refund' : 'purchase',
                    'created_at' => $startDate->copy()->addHours(rand(7, 22))->addMinutes(rand(0, 59))
                ]);
            }

            $startDate->addDay();
        }
    }
}
