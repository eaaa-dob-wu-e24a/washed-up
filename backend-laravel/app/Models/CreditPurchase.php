<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditPurchase extends Model
{
    protected $fillable = [
        'user_id',
        'credits_bought',
        'balance_after',
        'price',
        'currency',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
