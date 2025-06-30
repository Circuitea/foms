<?php

namespace App\Policies;

use App\Models\Personnel;
use App\PermissionsEnum;
use Illuminate\Auth\Access\Response;

class PersonnelPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(Personnel $personnel): bool
    {
        return $personnel->can(PermissionsEnum::PERSONNEL_READ);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Personnel $personnelUser, Personnel $personnelToView): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(Personnel $personnel): bool
    {
        return $personnel->can(PermissionsEnum::PERSONNEL_CREATE);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(Personnel $personnelUser, Personnel $personnelToUpdate): bool
    {
        return $personnelUser->can(PermissionsEnum::PERSONNEL_UPDATE);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Personnel $personnelUser, Personnel $personnelToDelete): bool
    {
        return $personnelUser->can(PermissionsEnum::PERSONNEL_DELETE);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Personnel $personnelUser, Personnel $personnelToRestore): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Personnel $personnelUser, Personnel $personnelToDelete): bool
    {
        return false;
    }
}
