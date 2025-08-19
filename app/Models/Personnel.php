<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Inventory\Transaction;
use App\Models\Task\Task;
use App\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use YieldStudio\LaravelExpoNotifier\Models\ExpoToken;

class Personnel extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\PersonnelFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $table = 'personnel';
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'surname',
        'name_extension',
        'email',
        'mobile_number',
        'password',
        'profile_picture_filename',
        'first_time_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'first_time_login' => 'boolean',
            'status' => Status::class,
        ];
    }

    // public function roles(): BelongsToMany
    // {
    //     return $this->belongsToMany(Role::class, 'personnel_role');
    // }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'personnel_sections');
    }

    public function location(): HasOne
    {
        return $this->hasOne(PersonnelLocation::class, 'id');
    }

    public function meetingsOrganized(): HasMany
    {
        return $this->hasMany(Meeting::class, 'organizer_id');
    }

    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'personnel_id');
    }

    public function assignedTasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'personnel_task');
    }

    public function expoTokens(): MorphMany
    {
        return $this->morphMany(ExpoToken::class, 'owner');
    }
}
