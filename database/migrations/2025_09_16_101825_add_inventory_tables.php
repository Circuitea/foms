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
    Schema::create('item_types', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('icon');
    });
    
    Schema::create('consumable_items', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description');
      $table->string('location');
      $table->string('image_path')->nullable();
      $table->foreignId('type_id')->constrained('item_types');
    });
    
    Schema::create('equipment_groups', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->foreignId('type_id')->constrained('item_types');
    });
    
    Schema::create('equipment_items', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description');
      $table->string('location');
      $table->string('image_path')->nullable();
      $table->foreignId('group_id')->constrained('equipment_groups');
    });

    Schema::create('transactions', function (Blueprint $table) {
      $table->id();
      $table->string('title');
      $table->text('description');
      $table->foreignId('personnel_id')->constrained('personnel');
      $table->foreignId('task_id')->nullable()->constrained(table: 'tasks');
      $table->timestamps();
    });

    Schema::create('consumable_transaction_entries', function (Blueprint $table) {
      $table->id();
      $table->integer('quantity');
      $table->foreignId('transaction_id')->constrained('transactions');
      $table->foreignId('item_id')->constrained('consumable_items');
    });
    
    Schema::create('equipment_transaction_entries', function (Blueprint $table) {
      $table->id();
      $table->foreignId('transaction_id')->constrained('transactions');
      $table->foreignId('item_id')->constrained('equipment_items');
    });
    
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('equipment_transaction_entries');
    Schema::dropIfExists('consumable_transaction_entries');
    Schema::dropIfExists('transactions');
    Schema::dropIfExists('equipment_items');
    Schema::dropIfExists('equipment_groups');
    Schema::dropIfExists('consumable_items');
    Schema::dropIfExists('item_types');
  }
};
