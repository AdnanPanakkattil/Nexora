<?php

use Illuminate\Support\Facades\Route;
use Modules\ProductManagement\Http\Controllers\ProductManagementController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('productmanagements', ProductManagementController::class)->names('productmanagement');
});
