<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Books;

class BooksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
        for ($i = 0; $i < 10; $i++) {
            Books::create([
                'title' => $faker->sentence,
                'author' => $faker->name,
                'description' => $faker->paragraph,
            ]);
        }
    }
}
