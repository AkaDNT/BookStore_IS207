<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
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
    Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/signin',  [AuthController::class, 'login']);
    Route::get('/user/me',     [AuthController::class, 'me']);
    Route::post('/auth/logout',[AuthController::class, 'logout']);

    Route::middleware('auth:api')->group(function () {
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::patch('/addresses/{addressId}', [AddressController::class, 'update']);
    Route::delete('/addresses/{addressId}', [AddressController::class, 'destroy']);
});
