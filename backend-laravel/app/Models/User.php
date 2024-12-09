<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use YieldStudio\LaravelExpoNotifier\Models\ExpoToken;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'location_id',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    public function credits()
    {
        return $this->hasOne(Credits::class);
    }
    public function creditPurchases()
    {
        return $this->hasMany(CreditPurchase::class);
    }

    public function creditUsages()
    {
        return $this->hasMany(CreditUsage::class);
    }

    public function expoTokens()
    {
        return $this->hasMany(ExpoToken::class, "owner_id");
    }
}
