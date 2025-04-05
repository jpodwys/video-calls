<?php

// use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Agence104\LiveKit\AccessToken;
use Agence104\LiveKit\AccessTokenOptions;
use Agence104\LiveKit\VideoGrant;

Route::middleware(['auth'/*, 'verified'*/])->group(function () {
    Route::get('/', function () {
        // return Inertia::render('dashboard', [
        //     'users' => User::all()->except(Auth::id()),
        // ]);

        /**
         * STOP ISSUING TOKENS FROM HERE.
         * INSTEAD, ISSUE TOKENS FROM A NEW ENDPOINT CALLED WHEN
         * CLICKING THE ONLY BUTTON TO JOIN THE ROOM.
         */

        $roomName = 'fam-call-app-room';
        $userName = Auth::user()->name;
        $random = rand();

        // Define the token options.
        $tokenOptions = (new AccessTokenOptions())
            ->setIdentity("$userName-$random")
            ->setTtl(1);

        // Define the video grants.
        $videoGrant = (new VideoGrant())
            ->setRoomJoin()
            ->setRoomName($roomName);

        // Initialize and fetch the JWT Token.
        $token = (new AccessToken(Config('services.livekit.api_key'), Config('services.livekit.api_secret')))
            ->init($tokenOptions)
            ->setGrant($videoGrant)
            ->toJwt();

        return Inertia::render('call/call', [
            'url' => Config('services.livekit.url'),
            'token' => $token,
        ]);
    })->name('home');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
