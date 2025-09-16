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
        Schema::drop('inventory_transaction_entries');
        Schema::drop('inventory_transactions');
        Schema::drop('inventory_item_conditions');
        Schema::drop('inventory_items');
        Schema::drop('inventory_item_types');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('inventory_item_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon');
        });
        
        Schema::create('inventory_item_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('image_path')->nullable();
            $table->foreignId('type_id')->constrained(table: 'inventory_item_types');
            $table->string('location');
        });

        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('personnel_id')->constrained(table: 'personnel');
            $table->timestamps();
        });

        Schema::create('inventory_transaction_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained(table: 'inventory_transactions');
            $table->foreignId('item_id')->constrained(table: 'inventory_items');
            $table->foreignId('condition_id')->constrained(table: 'inventory_item_conditions');
            $table->integer('amount');
            $table->foreignId('task_id')->nullable()->constrained(table: 'tasks', indexName: 'entries_task_id');
        });
    }
};
