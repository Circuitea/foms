<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property int $manager_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Personnel> $personnel
 * @property-read int|null $personnel_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Section newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Section newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Section query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Section whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Section whereManagerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Section whereName($value)
 * @mixin \Eloquent
 */
class Section extends Model
{
    public $timestamps = false;
    protected $fillable = ['name', 'manager_id'];

    public function personnel(): BelongsToMany
    {
        return $this->belongsToMany(Personnel::class, 'departments_personnel');
    }
}
