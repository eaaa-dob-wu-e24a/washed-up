<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QRCode extends Model {
    protected $fillable = [
        'machine_id',
        'code',
    ];

    public function machine() {
        return $this->belongsTo(Machine::class);
    }
}
