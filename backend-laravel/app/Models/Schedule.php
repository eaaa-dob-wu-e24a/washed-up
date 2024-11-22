<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model {
    protected $fillable = [
        'user_id',
        'machine_id',
        'start_time',
        'end_time',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function machine() {
        return $this->belongsTo(Machine::class);
    }
}
