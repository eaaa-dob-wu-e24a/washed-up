<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model {
    protected $table = 'machines';
    protected $fillable = [
        'type',
        'location_id',
        'status',
    ];

    public function location() {
        return $this->belongsTo(Location::class);
    }

    public function qrCode() {
        return $this->hasOne(QRCode::class);
    }

    public function schedules() {
        return $this->hasMany(Schedule::class);
    }
}
