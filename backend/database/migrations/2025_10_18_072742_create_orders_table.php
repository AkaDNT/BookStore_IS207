<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->date('order_date')->nullable();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->foreignId('address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->decimal('total_amount', 12, 2)->nullable();
            $table->string('order_status')->nullable();
            $table->timestamps();
            $table->unique('payment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
