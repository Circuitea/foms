<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Inventory\Transaction;
use App\Models\Task\PersonnelTask;
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

/**
 * @property int $id
 * @property string $first_name
 * @property string|null $middle_name
 * @property string $surname
 * @property string|null $name_extension
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $mobile_number
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $first_time_login
 * @property Status|null $status
 * @property string|null $profile_picture_filename
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Task> $assignedTasks
 * @property-read int|null $assigned_tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ExpoToken> $expoTokens
 * @property-read int|null $expo_tokens_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaction> $inventoryTransactions
 * @property-read int|null $inventory_transactions_count
 * @property-read \App\Models\PersonnelLocation|null $location
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meeting> $meetingsOrganized
 * @property-read int|null $meetings_organized_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Section> $sections
 * @property-read int|null $sections_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\PersonnelFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereFirstTimeLogin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereMiddleName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereMobileNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereNameExtension($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereProfilePictureFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereSurname($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Personnel withoutRole($roles, $guard = null)
 * @mixin \Eloquent
 */
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
        'position',
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
        return $this->belongsToMany(Task::class, 'personnel_task')
            ->using(PersonnelTask::class)
            ->withPivot(['started_at', 'finished_at', 'additional_notes']);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(ActivityDetail::class, 'personnel_id');
    }

    public function locationHistory(): HasMany
    {
        return $this->hasMany(LocationHistory::class, 'personnel_id');
    }
}
