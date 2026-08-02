<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ഈ migration run ചെയ്യുമ്പോൾ 'units' table database-ൽ create ആകും.
     * Columns:
     *   - id          : Auto increment primary key
     *   - name_en     : Unit-ന്റെ English name (e.g., Kilogram, Piece)
     *   - name_ar     : Unit-ന്റെ Arabic name
     *   - short_name  : Short abbreviation (e.g., kg, pcs) — optional
     *   - status      : 1 = Active, 0 = Inactive (default 0)
     *   - sort_order  : Display order number (default 0)
     *   - is_deleted  : Soft delete flag — 1 = Deleted, 0 = Not Deleted (default 0)
     *   - timestamps  : created_at, updated_at
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');                         // English name
            $table->string('name_ar');                         // Arabic name
            $table->string('short_name')->nullable();          // Short form (kg, pcs, ltr, etc.)
            $table->boolean('status')->default(0);             // 1 = Active / 0 = Inactive
            $table->integer('sort_order')->default(0);         // Sort position
            $table->boolean('is_deleted')->default(0);         // 1 = Deleted / 0 = Not Deleted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * ഈ migration rollback ചെയ്യുമ്പോൾ 'units' table drop ആകും.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
