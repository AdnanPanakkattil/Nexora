<?php

namespace Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\ProductManagement\Database\Factories\BrandFactory;

class Brand extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name_en',
        'name_ar',
        'slug',
        'image',
        'status',
        'is_deleted',
    ];

    // protected static function newFactory(): BrandFactory
    // {
    //     // return BrandFactory::new();
    // }
}
