<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('qr_provider')->nullable();
            $table->string('qr_image_url')->nullable();
            $table->text('qr_data')->nullable();
            $table->string('bank_account_no')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_bin')->nullable();
        });
    }

    public function down(): void {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['qr_provider','qr_image_url','qr_data','bank_account_no','bank_account_name','bank_bin']);
        });
    }
};
