<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function listAll(Request $request) {
        return $request->user()->notifications;
    }

    public function listUnread(Request $request) {
        return $request->user()->unreadNotifications;
    }

    public function markAsRead(Request $request, string $id) {
        $notification = $request->user()->notifications()->find($id);
        $notification->markAsRead();

        return response()->json(['notification' => $notification]);
    }

    public function markAsUnread(Request $request, string $id) {
        $notification = $request->user()->notifications()->find($id);
        $notification->read_at = null;
        $notification->save();

        return response()->json(['notification' => $notification]);
    }
}
