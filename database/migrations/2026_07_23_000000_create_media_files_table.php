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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->string('static_key', 50);  // e.g., 'category_image', 'category_banner'
            $table->string('file_path');       // e.g., 'categories/filename.jpg'
            $table->string('file_name')->nullable(); // Original file name
            $table->string('mime_type', 50)->nullable(); // e.g., 'image/png'
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('model_type', 100)->nullable(); // Model class e.g., Category
            $table->unsignedBigInteger('model_id')->nullable(); // Record ID
            $table->timestamps();

            $table->index(['model_type', 'model_id', 'static_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
