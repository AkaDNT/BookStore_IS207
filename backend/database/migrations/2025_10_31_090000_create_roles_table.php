<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->bigIncrements('id');                 // bigserial
            $table->string('name', 255)->unique();       // tên vai trò
            $table->timestamps();                        // created_at, updated_at (without time zone)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
