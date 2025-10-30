<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
{
    // Thêm cột an toàn
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

    // Xử lý trùng user_name (nếu có) rồi mới tạo UNIQUE
    if (Schema::hasColumn('users', 'user_name')) {

        // Ví dụ tự động “gắn hậu tố” cho các bản ghi trùng
        $dupes = DB::table('users')
            ->select('user_name')
            ->whereNotNull('user_name')
            ->groupBy('user_name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('user_name');

        foreach ($dupes as $name) {
            $rows = DB::table('users')
                ->where('user_name', $name)
                ->orderBy('id')
                ->get();

            $i = 0;
            foreach ($rows as $r) {
                if ($i > 0) {
                    DB::table('users')
                      ->where('id', $r->id)
                      ->update(['user_name' => $name.'_'.$i]); // đổi cho unique
                }
                $i++;
            }
        }

        // Tạo UNIQUE (không nuốt lỗi)
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS users_user_name_unique ON users (user_name)');
        // Hoặc dùng schema builder:
        // Schema::table('users', fn (Blueprint $t) => $t->unique('user_name', 'users_user_name_unique'));
    }

    // Xoá cột name nếu còn (đã có guard)
    if (Schema::hasColumn('users', 'name')) {
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('name'));
    }
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        if (Schema::hasColumn('users', 'phone_number')) $table->dropColumn('phone_number');
        if (Schema::hasColumn('users', 'reset_password_token')) $table->dropColumn('reset_password_token');
        if (Schema::hasColumn('users', 'reset_password_expiry')) $table->dropColumn('reset_password_expiry');
    });

    // Bỏ index nếu có
    DB::statement('DROP INDEX IF EXISTS users_user_name_unique');
}

};
