<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Thêm các cột còn thiếu
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone_number')) {
                $table->string('phone_number', 15)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'reset_password_token')) {
                $table->string('reset_password_token')->nullable()->after('remember_token');
            }
            if (!Schema::hasColumn('users', 'reset_password_expiry')) {
                $table->timestamp('reset_password_expiry')->nullable()->after('reset_password_token');
            }
        });

        // Đảm bảo UNIQUE cho user_name (PostgreSQL)
        try {
            DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS users_user_name_unique ON users (user_name);');
        } catch (\Throwable $e) {
            // Bỏ qua nếu DB không phải Postgres hoặc index đã tồn tại theo tên khác
        }

        // Nếu còn cột name cũ thì xóa an toàn
        if (Schema::hasColumn('users', 'name')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('name');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'phone_number')) {
                $table->dropColumn('phone_number');
            }
            if (Schema::hasColumn('users', 'reset_password_token')) {
                $table->dropColumn('reset_password_token');
            }
            if (Schema::hasColumn('users', 'reset_password_expiry')) {
                $table->dropColumn('reset_password_expiry');
            }
        });

        // Không khôi phục cột name để tránh mất dữ liệu hiện tại
        // Có thể drop index nếu bạn muốn (PostgreSQL):
        try {
            DB::statement('DROP INDEX IF EXISTS users_user_name_unique;');
        } catch (\Throwable $e) {
            // Bỏ qua nếu không phải Postgres
        }
    }
};
