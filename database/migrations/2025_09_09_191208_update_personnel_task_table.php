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
            $table->dropForeign(['task_report_id']);
            $table->dropColumn('task_report_id');

            $table->text('additional_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel_task', function (Blueprint $table) {
            $table->dropColumn('additional_notes');
            $table->foreignId('task_report_id')
                ->nullable()
                ->constrained(table: 'task_reports');
        });
    }
};
