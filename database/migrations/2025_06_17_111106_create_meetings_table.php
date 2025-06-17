<?php

use App\MeetingPriority;
use App\MeetingType;
use App\Status;
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

        Schema::create('meeting_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('type_id')->constrained(table: 'meeting_types');
            $table->foreignId('section_id')->constrained(table: 'sections');
            $table->enum('priority', array_map(fn ($priority) => $priority->value, MeetingPriority::cases()));
            $table->text('description');
            $table->dateTime('schedule');
            $table->integer('duration');

            $table->string('format_type');
            $table->bigInteger('format_id');

            $table->timestamps();
        });
        
        Schema::create('meeting_agendas', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('order');
            $table->string('agenda');
            $table->foreignId('meeting_id')->constrained(table: 'meetings');
        });

        Schema::create('in_person_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('meeting_location');
        });

        Schema::create('zoom_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('meeting_link');
            $table->string('meeting_id');
            $table->string('meeting_passcode')->nullable();
        });

        Schema::create('google_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('meeting_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('google_meetings');
        Schema::dropIfExists('zoom_meetings');
        Schema::dropIfExists('in_person_meetings');
        Schema::dropIfExists('meeting_agendas');
        Schema::dropIfExists('meetings');
        Schema::dropIfExists('meeting_types');
    }
};
