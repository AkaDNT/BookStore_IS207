<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
        -- Hàm trigger: cập nhật 2 cột đếm trong carts
        CREATE OR REPLACE FUNCTION trg_cart_items_counter()
        RETURNS TRIGGER AS $$
        BEGIN
          IF (TG_OP = 'INSERT') THEN
            UPDATE carts
               SET items_count   = items_count + 1,
                   items_qty_sum = items_qty_sum + NEW.quantity
             WHERE id = NEW.cart_id;
            RETURN NEW;
          ELSIF (TG_OP = 'DELETE') THEN
            UPDATE carts
               SET items_count   = items_count - 1,
                   items_qty_sum = items_qty_sum - OLD.quantity
             WHERE id = OLD.cart_id;
            RETURN OLD;
          ELSIF (TG_OP = 'UPDATE') THEN
            -- chỉ quantity thay đổi mới ảnh hưởng đến items_qty_sum
            IF (NEW.quantity IS DISTINCT FROM OLD.quantity) THEN
              UPDATE carts
                 SET items_qty_sum = items_qty_sum - OLD.quantity + NEW.quantity
               WHERE id = NEW.cart_id;
            END IF;
            -- items_count không đổi khi UPDATE
            RETURN NEW;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS cart_items_counter_ins ON cart_items;
        DROP TRIGGER IF EXISTS cart_items_counter_upd ON cart_items;
        DROP TRIGGER IF EXISTS cart_items_counter_del ON cart_items;

        CREATE TRIGGER cart_items_counter_ins
          AFTER INSERT ON cart_items
          FOR EACH ROW EXECUTE FUNCTION trg_cart_items_counter();

        CREATE TRIGGER cart_items_counter_upd
          AFTER UPDATE OF quantity ON cart_items
          FOR EACH ROW EXECUTE FUNCTION trg_cart_items_counter();

        CREATE TRIGGER cart_items_counter_del
          AFTER DELETE ON cart_items
          FOR EACH ROW EXECUTE FUNCTION trg_cart_items_counter();
        SQL);
    }

    public function down(): void
    {
        DB::unprepared(<<<'SQL'
        DROP TRIGGER IF EXISTS cart_items_counter_ins ON cart_items;
        DROP TRIGGER IF EXISTS cart_items_counter_upd ON cart_items;
        DROP TRIGGER IF EXISTS cart_items_counter_del ON cart_items;
        DROP FUNCTION IF EXISTS trg_cart_items_counter();
        SQL);
    }
};
