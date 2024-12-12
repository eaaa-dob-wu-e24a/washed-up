<?php

namespace App\Console\Commands;

use App\Models\Location;
use Illuminate\Console\Command;

class CreateLocation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'location:create {address}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new location with geocoding support using OpenStreetMap';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $address = $this->argument('address');
        $code = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6));

        try {
            // Geocode the address using OpenStreetMap
            $coordinates = $this->getCoordinates($address);

            $location = Location::create([
                'code' => $code,
                'address' => $address,
                'latitude' => $coordinates['lat'],
                'longitude' => $coordinates['lng'],
            ]);

            $this->info("Location created successfully!");
            $this->table(
                ['Code', 'Address', 'Latitude', 'Longitude'],
                [[$location->code, $location->address, $location->latitude, $location->longitude]]
            );
        } catch (\Exception $e) {
            $this->error("Error creating location: " . $e->getMessage());
        }
    }

    private function getCoordinates($address)
    {
        $address = urlencode($address);
        $url = "https://nominatim.openstreetmap.org/search?format=json&q={$address}&limit=1";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'YourAppName/1.0'); // Required by Nominatim's terms of use

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            throw new \Exception(curl_error($ch));
        }

        curl_close($ch);

        $data = json_decode($response, true);

        if (empty($data)) {
            throw new \Exception("Could not geocode address");
        }

        return [
            'lat' => $data[0]['lat'],
            'lng' => $data[0]['lon']
        ];
    }
}
