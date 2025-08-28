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
        Schema::create('activity_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('personnel_id')->constrained(table: 'personnel');

            $table->morphs('activity');

            $table->timestamps();
        });

        Schema::create('login_activities', function (Blueprint $table) {
            $table->id();
            $table->string('device_name');
        });
        Schema::create('logout_activities', function (Blueprint $table) {
            $table->id();
            $table->string('device_name');
        });
        Schema::create('start_task_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained(table: 'tasks');
        });
        Schema::create('finish_task_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained(table: 'tasks');
        });
        Schema::create('change_status_activities', function (Blueprint $table) {
            $table->id();
            $table->string('old_status');
            $table->string('new_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_activities');
        Schema::dropIfExists('logout_activities');
        Schema::dropIfExists('start_task_activities');
        Schema::dropIfExists('finish_task_activities');
        Schema::dropIfExists('change_status_activities');
        Schema::dropIfExists('activity_details');
    }
};
