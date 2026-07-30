<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('Categories', function (Blueprint $table) {
            if (!Schema::hasColumn('Categories', 'image')) {
                $table->string('image')->nullable()->after('name_ar');
            }
            if (!Schema::hasColumn('Categories', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('image');
            }
            if (!Schema::hasColumn('Categories', 'created_by')) {
                $table->unsignedBigInteger('created_by')->nullable();
            }
            if (!Schema::hasColumn('Categories', 'updated_by')) {
                $table->unsignedBigInteger('updated_by')->nullable();
            }
            if (!Schema::hasColumn('Categories', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Categories', function (Blueprint $table) {
            if (Schema::hasColumn('Categories', 'image')) {
                $table->dropColumn('image');
            }
            if (Schema::hasColumn('Categories', 'sort_order')) {
                $table->dropColumn('sort_order');
            }
            if (Schema::hasColumn('Categories', 'created_by')) {
                $table->dropColumn('created_by');
            }
            if (Schema::hasColumn('Categories', 'updated_by')) {
                $table->dropColumn('updated_by');
            }
            if (Schema::hasColumn('Categories', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
