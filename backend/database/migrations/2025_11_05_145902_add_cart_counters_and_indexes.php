<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1) carts: thêm cột đếm
        Schema::table('carts', function (Blueprint $t) {
            $t->integer('items_count')->default(0);
            $t->integer('items_qty_sum')->default(0);
            $t->decimal('total_price', 12, 2)->default(0)->change(); // đảm bảo dạng tiền tệ ổn
            $t->index('user_id');
        });

        // 2) cart_items: unique & index để nhanh và chống trùng
        Schema::table('cart_items', function (Blueprint $t) {
            $t->unique(['cart_id', 'book_id']); // 1 sách chỉ 1 dòng trong 1 giỏ
            $t->index('cart_id');
            $t->index('book_id');
        });

        // 3) backfill counters từ dữ liệu hiện có
        DB::statement("
            UPDATE carts c
            SET items_count   = COALESCE(sub.cnt, 0),
                items_qty_sum = COALESCE(sub.qty, 0)
            FROM (
                SELECT cart_id, COUNT(*) AS cnt, COALESCE(SUM(quantity),0) AS qty
                FROM cart_items
                GROUP BY cart_id
            ) AS sub
            WHERE c.id = sub.cart_id
        ");
    }

    public function down(): void
    {
        Schema::table('carts', function (Blueprint $t) {
            $t->dropColumn(['items_count', 'items_qty_sum']);
        });

        Schema::table('cart_items', function (Blueprint $t) {
            $t->dropUnique(['cart_id', 'book_id']);
            $t->dropIndex(['cart_id']);
            $t->dropIndex(['book_id']);
        });
    }
};
