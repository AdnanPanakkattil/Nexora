<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // Name
            $table->string('first_name_en')->nullable()->after('name');
            $table->string('first_name_ar')->nullable()->after('first_name_en');

            $table->string('second_name_en')->nullable()->after('first_name_ar');
            $table->string('second_name_ar')->nullable()->after('second_name_en');

            // Username
            $table->string('username')->unique()->nullable()->after('email');

            // Gender
            $table->enum('gender', [
                'male',
                'female',
            ])->nullable()->after('username');

            // Nationality
            $table->unsignedBigInteger('nationalityid')->nullable()->after('gender');

            // Joining Date
            $table->date('join_date')->nullable()->after('nationalityid');

            // Mobile Number
            $table->string('mobileno')->nullable()->after('join_date');

            // User Role
            $table->enum('role', [
                'super_admin',
                'admin',
                'vendor_manager',
                'product_manager',
                'order_manager',
                'inventory_manager',
                'customer_support',
                'finance',
                'marketing',
                'content_manager',
                'report_manager',
                'vendor',
                'vendor_staff',
            ])->nullable()->after('mobileno');

            // Active / Inactive
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropUnique(['username']);

            $table->dropColumn([
                'first_name_en',
                'first_name_ar',
                'second_name_en',
                'second_name_ar',
                'username',
                'gender',
                'nationalityid',
                'join_date',
                'mobileno',
                'role',
                'is_active',
            ]);
        });
    }
};
