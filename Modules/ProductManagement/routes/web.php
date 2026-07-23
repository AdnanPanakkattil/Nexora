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
    Route::get('/categories/data', [CategoriesController::class, 'listData'])->name('categories.data');
    Route::get('/Categories-add', [CategoriesController::class, 'create'])->name('Categories');
    Route::post('/categories/store', [CategoriesController::class, 'store'])->name('categories.store');
    Route::get('/categories/edit/{id}', [CategoriesController::class, 'edit'])->name('categories.edit');
    Route::post('/categories/update/{id}', [CategoriesController::class, 'update'])->name('categories.update');
    Route::delete('/categories/delete/{id}', [CategoriesController::class, 'destroy'])->name('categories.delete');


});

