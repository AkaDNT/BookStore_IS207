<?php

namespace App\Observers;

use App\Models\Book;
use App\Services\CartRecalculator;

class BookObserver
{

    public function updated(Book $book): void
    {
        if ($book->wasChanged(['price', 'discount'])) {
            CartRecalculator::recalcCartsForBook($book);
        }
    }
}
