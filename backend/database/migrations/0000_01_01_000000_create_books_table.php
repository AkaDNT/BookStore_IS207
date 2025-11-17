<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Nếu đã có bảng books (do bạn tạo bằng SQL tay) thì thôi, khỏi tạo nữa
        if (Schema::hasTable('books')) {
            return;
        }

        Schema::create('books', function (Blueprint $table) {
            $table->id(); // SERIAL PRIMARY KEY

            $table->string('title', 255);
            $table->string('author', 255)->nullable();
            $table->string('description', 1000)->nullable();
            $table->string('category', 100)->nullable();

            // DECIMAL(10,2)
            $table->decimal('price', 10, 2);

            $table->string('publisher', 255)->nullable();
            $table->date('publication_date')->nullable();
            $table->string('language', 50)->nullable();

            $table->integer('reading_age')->nullable();
            $table->integer('pages')->nullable();
            $table->string('dimension', 50)->nullable();

            // quantity INT DEFAULT 5
            $table->integer('quantity')->default(5);

            // discount DECIMAL(5,2) DEFAULT 0
            $table->decimal('discount', 5, 2)->default(0);

            // image_url TEXT
            $table->text('image_url')->nullable();

            // thêm timestamps cho tiện dùng Eloquent (created_at, updated_at)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
