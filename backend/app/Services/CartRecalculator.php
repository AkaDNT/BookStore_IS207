<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;

class CartRecalculator
{

    public static function recalcCartsForBook(Book $book): void
    {
        CartItem::where('book_id', $book->id)->update([
            'book_price' => $book->price,
            'discount'   => $book->discount, // lưu % giảm (10 = 10%)
        ]);

        $cartIds = CartItem::where('book_id', $book->id)
            ->distinct()
            ->pluck('cart_id')
            ->all();

        if (empty($cartIds)) {
            return;
        }

        $chunks = array_chunk($cartIds, 500);
        foreach ($chunks as $ids) {
            $totals = CartItem::select(
                    'cart_id',
                    DB::raw('SUM(book_price * (1 - discount/100.0) * quantity) AS total_price')
                )
                ->whereIn('cart_id', $ids)
                ->groupBy('cart_id')
                ->get()
                ->keyBy('cart_id');

            foreach ($ids as $cid) {
                DB::transaction(function () use ($cid, $totals) {
                    $cart = Cart::lockForUpdate()->find($cid);
                    if (!$cart) {
                        return;
                    }
                    $newTotal = (float) ($totals[$cid]->total_price ?? 0.0);
                    $cart->total_price = round($newTotal, 2);
                    $cart->save();
                });
            }
        }
    }
}
