<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model {
    protected $fillable = [
        'name',
        'role',
    ];

    public function reports() {
        return $this->hasMany(Report::class);
    }
}
