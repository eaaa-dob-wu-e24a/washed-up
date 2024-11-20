<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Machine;
use App\Models\QRCode;

class QRCodeSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // Ensure there are some machines to associate with QR codes
        $machines = Machine::all();

        if ($machines->isEmpty()) {
            $machines = Machine::factory()->count(10)->create();
        }

        foreach ($machines as $machine) {
            QRCode::create([
                'machine_id' => $machine->id,
                'code' => 'QR-' . strtoupper(uniqid()),
            ]);
        }
    }
}
