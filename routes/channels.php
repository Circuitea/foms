<?php

use App\Models\Personnel;
use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('.ModeAppls.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });


Broadcast::channel('location', function (Personnel $user) {
    return true;
});

Broadcast::channel('notifications.{userID}', function (Personnel $user, int $userID) {
    return $user->id === $userID;
});

