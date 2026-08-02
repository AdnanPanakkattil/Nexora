<?php

namespace Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Unit Model
 *
 * Database table: units
 *
 * ഈ model 'units' table-നെ represent ചെയ്യുന്നു.
 * Product-ൽ unit assign ചെയ്യാൻ ഉപയോഗിക്കും (e.g., KG, Piece, Litre, Box).
 *
 * Mass Assignable Fields ($fillable):
 *   - name_en    : English name (required)
 *   - name_ar    : Arabic name (required)
 *   - short_name : Abbreviation — optional (kg, pcs, ltr)
 *   - status     : 1 = Active, 0 = Inactive
 *   - sort_order : Display order
 *   - is_deleted : Soft delete flag
 */
class Unit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * ഈ fields form-ൽ നിന്ന് directly save ചെയ്യാൻ allow ചെയ്യും.
     */
    protected $fillable = [
        'name_en',
        'name_ar',
        'short_name',
        'status',
        'sort_order',
        'is_deleted',
    ];
}
