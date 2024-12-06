<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditUsage extends Model
{
    protected $fillable = [
        'user_id',
        'machine_id',
        'machine_type',
        'duration_minutes',
        'cost_credits',
        'balance_after',
        'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
