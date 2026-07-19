<?php

use Illuminate\Support\Facades\Route;
use Modules\ProductManagement\Http\Controllers\CategoriesController;
use Modules\ProductManagement\Http\Controllers\ProductManagementController;



Route::middleware(['auth', 'verified'])->group(function () {

    //product
    Route::get('/product-list', [ProductManagementController::class, 'index'])->name('product');
    Route::get('/product-add', [ProductManagementController::class, 'create'])->name('product-add');

    // Categories
    Route::get('/Categories-list', [CategoriesController::class , 'index'])->name('Categories-list');

});
