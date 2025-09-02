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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('manager_id')->constrained(table: 'personnel');
        });

        Schema::create('departments_personnel', function (Blueprint $table) {
            $table->foreignId('department_id')->constrained(table: 'departments');
            $table->foreignId('personnel_id')->constrained(table: 'personnel');
            $table->primary(['department_id', 'personnel_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments_personnel');
        Schema::dropIfExists('departments');
    }
};
