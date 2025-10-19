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
        Schema::table('personnel_task', function (Blueprint $table) {
            $table->index(['personnel_id', 'task_id'], 'personnel_task_personnel_id_task_id_index');
        });

        Schema::create('task_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('personnel_id');
            $table->unsignedBigInteger('task_id');
            $table->string('file_path');
            $table->string('file_name');

            $table->foreign(['personnel_id', 'task_id'], 'task_attachments_personnel_task_foreign')->references(['personnel_id', 'task_id'])->on('personnel_task');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_attachments');
        
        Schema::table('personnel_task', function (Blueprint $table) {
            $table->dropIndex('personnel_task_personnel_id_task_id_index');
        });
    }
};
