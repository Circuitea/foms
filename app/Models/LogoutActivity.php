<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogoutActivity extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'device_name',
    ];
}
