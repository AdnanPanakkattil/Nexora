<?php

use Illuminate\Support\Facades\Route;
use Modules\ProductManagement\Http\Controllers\CategoriesController;
use Modules\ProductManagement\Http\Controllers\ProductManagementController;



Route::middleware(['auth', 'verified'])->group(function () {

    //product
    Route::get('/product-list', [ProductManagementController::class, 'index'])->name('product');
    Route::get('/product-add', [ProductManagementController::class, 'create'])->name('product-add');

    // Categories
    Route::get('/Categories-list', [CategoriesController::class, 'index'])->name('Categories-list');
    Route::get('/Categories-add', [CategoriesController::class, 'create'])->name('Categories');

    // Categories AJAX API Routes
    Route::get('/product-management/categories', [CategoriesController::class, 'getData'])->name('categories.data');
    Route::post('/product-management/categories/store', [CategoriesController::class, 'store'])->name('categories.store');
    Route::get('/product-management/categories/edit/{id}', [CategoriesController::class, 'edit'])->name('categories.edit');
    Route::delete('/product-management/categories/delete/{id}', [CategoriesController::class, 'destroy'])->name('categories.delete');
    Route::post('/product-management/categories/status/{id}', [CategoriesController::class, 'toggleStatus'])->name('categories.status');
    Route::post('/product-management/categories/reorder/{id}', [CategoriesController::class, 'reorder'])->name('categories.reorder');
});

