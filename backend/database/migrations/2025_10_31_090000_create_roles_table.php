<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name', 255)->unique();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};

