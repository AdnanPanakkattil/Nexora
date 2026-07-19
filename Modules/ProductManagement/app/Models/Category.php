<?php

namespace Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\ProductManagement\Database\Factories\CategoryFactory;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    use SoftDeletes;

    protected $table = 'Categories';

    protected $fillable = [
        'name_en',
        'name_ar',
        'slug',
        'description',
        'image',
        'status',
        'is_featured',
        'sort_order',
        'show_in_menu',
        'created_by',
        'updated_by'
    ];
    // protected static function newFactory(): CategoryFactory
    // {
    //     // return CategoryFactory::new();
    // }
}
