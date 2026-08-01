<?php

use Illuminate\Support\Facades\Route;
use Modules\ProductManagement\Http\Controllers\CategoriesController;
use Modules\ProductManagement\Http\Controllers\ChildCategoriesController;
use Modules\ProductManagement\Http\Controllers\ProductManagementController;
use Modules\ProductManagement\Http\Controllers\SubCatogeryController;

Route::middleware(['auth', 'verified'])->group(function () {


    // ==================== product ======================================================================================================= 

    Route::get('/product-list', [ProductManagementController::class, 'index'])->name('product');
    Route::get('/product-add', [ProductManagementController::class, 'create'])->name('product-add');

    //======================================================================================================================================

    // ===================== Categories =====================================================================================================

    Route::get('/Categories-list', [CategoriesController::class, 'index'])->name('Categories-list');
    Route::get('/product-management/categories', [CategoriesController::class, 'getData'])->name('categories.data');
    Route::post('/product-management/categories/store', [CategoriesController::class, 'store'])->name('categories.store');
    Route::get('/product-management/categories/edit/{id}', [CategoriesController::class, 'edit'])->name('categories.edit');
    Route::delete('/product-management/categories/delete/{id}', [CategoriesController::class, 'destroy'])->name('categories.delete');
    Route::post('/product-management/categories/status/{id}', [CategoriesController::class, 'toggleStatus'])->name('categories.status');
    Route::post('/product-management/categories/reorder/{id}', [CategoriesController::class, 'reorder'])->name('categories.reorder');

    //=========================================================================================================================================


    // ========================= sub Categories ===============================================================================================

    Route::get('/Sub-catogery', [SubCatogeryController::class, 'index'])->name('Sub-catogery');
    Route::get('/product-management/sub-categories', [SubCatogeryController::class, 'getData'])->name('sub-categories.data');
    Route::post('/product-management/sub-categories/store', [SubCatogeryController::class, 'store'])->name('sub-categories.store');
    Route::get('/product-management/sub-categories/edit/{id}', [SubCatogeryController::class, 'edit'])->name('sub-categories.edit');
    Route::delete('/product-management/sub-categories/delete/{id}', [SubCatogeryController::class, 'destroy'])->name('sub-categories.delete');
    Route::post('/product-management/sub-categories/status/{id}', [SubCatogeryController::class, 'toggleStatus'])->name('sub-categories.status');
    Route::post('/product-management/sub-categories/reorder/{id}', [SubCatogeryController::class, 'reorder'])->name('sub-categories.reorder');

    //==========================================================================================================================================


    // ========================= Child Categories ===============================================================================================

    Route::get('/child-categories', [ChildCategoriesController::class, 'index'])->name('child-categories');

    //===========================================================================================================================================

});
