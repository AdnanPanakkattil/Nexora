<?php

namespace Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\ProductManagement\Database\Factories\CategoryFactory;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'Categories';

    protected $fillable = [
        'name_en',
        'name_ar',
        'description',
        'slug',
        'image',
        'banner_image',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'sort_order',
        'status',
        'is_featured',
        'show_in_menu',
        'deleted',
        'created_by',
        'updated_by'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (auth()->check() && !$model->created_by) {
                $model->created_by = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check() && !$model->updated_by) {
                $model->updated_by = auth()->id();
            }
        });
    }
}

