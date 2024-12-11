<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['code', 'address', "latitude", "longitude", "price_per_credit", "currency"];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
