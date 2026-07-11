<?php

use Illuminate\Support\Facades\Route;
use Modules\ProductManagement\Http\Controllers\ProductManagementController;

Route::get('/item-master', [ProductManagementController::class, 'index'])
    ->name('item-master');

Route::get('/item-master-add', [ProductManagementController::class, 'create'])
    ->name('item-master-add');
// Route::middleware(['auth', 'verified'])->group(function () {

//     Route::resource('productmanagements', ProductManagementController::class)
//         ->names('productmanagement')
//         ->except(['index']);
// });
