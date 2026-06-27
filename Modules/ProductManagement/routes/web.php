<?php

use Illuminate\Support\Facades\Route;
use Modules\ProductManagement\Http\Controllers\ItemMasterController;
use Modules\ProductManagement\Http\Controllers\ProductManagementController;

Route::resource('item-master', ItemMasterController::class)->names('item-master');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('productmanagements', ProductManagementController::class)->names('productmanagement');
});
