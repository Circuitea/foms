<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Section extends Model
{
    public $timestamps = false;
    protected $fillable = ['name'];

    public function personnel(): BelongsToMany
    {
        return $this->belongsToMany(Personnel::class, 'departments_personnel');
    }
}
