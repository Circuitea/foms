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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained(table: 'barangays');
            $table->tinyInteger('type_id')->unsigned();
            $table->smallInteger('year');
            $table->tinyInteger('month');

            $table->foreign('type_id')->references('id')->on('task_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
