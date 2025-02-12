<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Exercise;
use Illuminate\Auth\Access\Response;

class ExercisePolicy
{
    /**
     * Create a new policy instance.
     */
    public function delete(User $user, Exercise $exercise): Response
    {
        return $user->id === $exercise->user_id
            ?Response::allow()
            :Response::deny('You do not own this exercise');
    }
}
