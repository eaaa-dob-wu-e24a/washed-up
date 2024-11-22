<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['admin_id', 'date', 'earnings', 'usagestats'];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
