<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'code' => strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6)),
                'address' => 'Nørrebrogade 157, 2200 København',
                'latitude' => 55.694784,
                'longitude' => 12.549560,
                'price_per_credit' => 12.00,
                'currency' => 'DKK'
            ],
            [
                'code' => strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6)),
                'address' => 'Banegårdspladsen 1, 8000 Aarhus',
                'latitude' => 56.150833,
                'longitude' => 10.203889,
                'price_per_credit' => 1.50,
                'currency' => 'EUR'
            ],
            [
                'code' => strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6)),
                'address' => 'Østre Stationsvej 27, 5000 Odense',
                'latitude' => 55.401700,
                'longitude' => 10.387340,
                'price_per_credit' => 6.00,
                'currency' => 'DKK'
            ],
            [
                'code' => strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6)),
                'address' => 'Vesterbro 27, 9000 Aalborg',
                'latitude' => 57.048820,
                'longitude' => 9.919370,
                'price_per_credit' => 10.00,
                'currency' => 'DKK'
            ],
            [
                'code' => strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6)),
                'address' => 'Exnersgade 22, 6700 Esbjerg',
                'latitude' => 55.467598,
                'longitude' => 8.459405,
                'price_per_credit' => 10.00,
                'currency' => 'DKK'
            ]
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
