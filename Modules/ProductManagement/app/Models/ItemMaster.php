<?php

namespace Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemMaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_code',
        'item_name',
        'category',
        'brand',
        'unit',
        'purchase_price',
        'selling_price',
        'tax_percentage',
        'stock_quantity',
        'barcode',
        'description',
        'status',
    ];

    /**
     * Scope a query to only include active items.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
