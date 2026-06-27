<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Modules\Backend\Http\Controllers\BackendController;

// Route::prefix('admin')->group(function () {

    Route::get('/', [HomeController::class, 'index'])
        ->name('dashboard');

// });