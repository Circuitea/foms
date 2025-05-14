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
        Schema::rename('users', 'personnel');

        Schema::table('personnel', function (Blueprint $table) {
            $table->renameColumn('name', 'first_name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('surname')->after('middle_name');
            $table->string('name_extension')->nullable()->after('surname');
            $table->string('mobile_number')->nullable()->after('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            $table->renameColumn('first_name', 'name');
            $table->dropColumn('middle_name');
            $table->dropColumn('surname');
            $table->dropColumn('name_extension');
            $table->dropColumn('mobile_number');
        });

        Schema::rename('personnel', 'users');
    }
};
