<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model {
    protected $table = 'machines';
    protected $fillable = [
        'model',
        'location',
        'status',
    ];

    public function qrCode() {
        return $this->hasOne(QRCode::class);
    }

    public function schedules() {
        return $this->hasMany(Schedule::class);
    }

    public function rentals() {
        return $this->hasMany(Rental::class);
    }
}
