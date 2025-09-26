<?php

use App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('books')->group(function () {
    Route::get('/', [BookController::class, 'index']);
    Route::get('/book', [BookController::class, 'getBookById']); // ?Id=...
    Route::post('/', [BookController::class, 'store']);
    Route::patch('/', [BookController::class, 'update']);        // ?id=...
    Route::delete('/', [BookController::class, 'destroy']);      // ?id=...
    Route::get('/search', [BookController::class, 'search']);
    Route::get('/searchTitle', [BookController::class, 'searchTitle']);
});

