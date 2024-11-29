<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name', 'code', 'address', "latitude", "longitude"];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
