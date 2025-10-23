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
        Schema::table('equipment_items', function (Blueprint $table) {
            $table->integer('use_before_maintenance')->nullable();
            $table->integer('use_before_disposal')->nullable();
            $table->integer('years_life_expectancy')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipment_items', function (Blueprint $table) {
            $table->dropColumn(['use_before_maintenance', 'use_before_disposal', 'years_life_expectancy']);
        });
    }
};
