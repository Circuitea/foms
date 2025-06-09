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
        Schema::rename('departments', 'sections');
        Schema::rename('departments_personnel', 'personnel_sections');
        Schema::table('personnel_sections', function (Blueprint $table) {
            $table->renameColumn('department_id', 'section_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel_sections', function (Blueprint $table) {
            $table->renameColumn('section_id', 'department_id');
        });
        Schema::rename('personnel_sections', 'departments_personnel');
        Schema::rename('sections', 'departments');
    }
};
