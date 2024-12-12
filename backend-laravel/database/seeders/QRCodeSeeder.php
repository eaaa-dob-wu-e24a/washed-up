<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Machine;
use App\Models\QRCode;

class QRCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $machines = Machine::all();

        foreach ($machines as $machine) {
            QRCode::create([
                'machine_id' => $machine->id,
                'code' => strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4)),
            ]);
        }
    }
}
