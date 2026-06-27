<?php

use Illuminate\Support\Facades\Route;
use Modules\AuthUser\Http\Controllers\AuthUserController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('authusers', AuthUserController::class)->names('authuser');
});
