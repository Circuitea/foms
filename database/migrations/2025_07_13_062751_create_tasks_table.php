<?php

use App\TaskPriorityEnum;
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
        Schema::create('task_priorities', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('name');
        });

        Schema::create('task_types', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('name');
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->string('location');

            $table->unsignedTinyInteger('priority_id');
            $table->unsignedTinyInteger('type_id');
            
            $table->foreignId('creator_id')->constrained(table: 'personnel', indexName: 'tasks_personnel_id');
            $table->foreignId('section_id')->constrained(table: 'sections', indexName: 'tasks_section_id');

            $table->dateTime('due_date');
            $table->integer('duration'); // Minutes

            $table->timestamps();

            $table->foreign('priority_id')->references('id')->on('task_priorities');
            $table->foreign('type_id')->references('id')->on('task_types');
        });

        Schema::create('personnel_task', function (Blueprint $table) {
            $table->foreignId('personnel_id')->constrained(table: 'personnel', indexName: 'personnel_task_personnel_id');
            $table->foreignId('task_id')->constrained(table: 'tasks', indexName: 'personnel_task_task_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_task');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('task_types');
        Schema::dropIfExists('task_priorities');
    }
};
