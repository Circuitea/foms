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
        Schema::create('task_reports', function (Blueprint $table) {
            $table->id();

            $table->string('file_name');

            $table->timestamps();
        });

        Schema::table('personnel_task', function (Blueprint $table) {
            $table->foreignId('task_report_id')
                ->nullable()
                ->constrained(table: 'task_reports');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel_task', function (Blueprint $table) {
            $table->dropForeign(['task_report_id']);
            $table->dropColumn('task_report_id');
        });
        Schema::dropIfExists('task_reports');
    }
};
