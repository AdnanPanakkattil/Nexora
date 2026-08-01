<?php

namespace Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChildCategory extends Model
{
    use HasFactory, SoftDeletes;

    // Database table name for Child Categories
    protected $table = 'child_categories';

    // Mass assignable fields
    protected $fillable = [
        'sub_category_id', // Foreign key referencing sub_categories table
        'name_en',         // Child Category Name in English
        'name_ar',         // Child Category Name in Arabic
        'image',           // Relative file path of the uploaded image
        'sort_order',      // Sorting order integer value
        'status',          // Status flag (1 = Active, 0 = Inactive)
        'created_by',      // User ID of the creator
        'updated_by',      // User ID of the last updater
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
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });
    }

    /**
     * Relationship: ChildCategory belongs to a SubCategory.
     */
    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }
}
