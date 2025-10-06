<?php

namespace App\Models;

use App\Status;
use Illuminate\Database\Eloquent\Model;

class ChangeStatusActivity extends Model
{
    public $timestamps = false;

    protected $fillable = ['old_status', 'new_status'];
    
    protected function casts(): array
    {
        return [
            'old_status' => Status::class,
            'new_status' => Status::class,
        ];
    }
}
