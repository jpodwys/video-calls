<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

// use Agence104\LiveKit\RoomServiceClient;
// use Agence104\LiveKit\RoomCreateOptions;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('home', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Create service
        // $svc = new RoomServiceClient(
        //     Config('services.livekit.url'),
        //     Config('services.livekit.api_key'),
        //     Config('services.livekit.api_secret'),
        // );

        // List rooms.
        // $rooms = $svc->listRooms();

        // Create a new room.
        // $opts = (new RoomCreateOptions())
        //     ->setName('myroom')
        //     ->setEmptyTimeout(10)
        //     ->setMaxParticipants(20);
        // $room = $svc->createRoom($opts);

        // Delete a room. - Does not work because my server isn't using SSL
        // $svc->deleteRoom('myroom');
        // $svc->removeParticipant('fam-call-app-room', 'test-10');

        return redirect('/login');
    }
}
