<?php

use Illuminate\Support\Facades\Route;
use Modules\AuthUser\Http\Controllers\AuthUserController;

// Route::middleware(['auth', 'verified'])->group(function () {

// });
Route::get('super-admin', [AuthUserController::class, 'superAdmin'])->name('authuser.super-admin');
Route::resource('Users', AuthUserController::class)->names('authuser');
