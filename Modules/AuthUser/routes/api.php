<?php

use Illuminate\Support\Facades\Route;
use Modules\AuthUser\Http\Controllers\AuthUserController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('authusers', AuthUserController::class)->names('authuser');
});
