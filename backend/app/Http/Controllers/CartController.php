<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Book;
use Exception;

class CartController extends Controller
{
    public function addProduct(Request $request, int $bookId, int $quantity)
    {
        try {
            $request->validate([
                'bookId'   => ['sometimes'],
                'quantity' => ['sometimes','integer','min:1'],
            ]);
            $user = auth('api')->user();
            $cart = $this->getOrCreateCart($user->id);

            $book = Book::findOrFail($bookId);
            $exists = CartItem::where('cart_id', $cart->id)->where('book_id', $book->id)->first();
            if ($exists) {
                return $this->errorResponse(409, 'Book already exists in cart', ['cart' => ['Book already exists in cart.']]);
            }
            if ($book->quantity <= 0) {
                return $this->errorResponse(400, 'Book is not available', ['stock' => ['Book is not available.']]);
            }
            if ($book->quantity < $quantity) {
                return $this->errorResponse(400, 'Quantity exceeds stock', ['stock' => ['Requested quantity exceeds available stock.']]);
            }

            $response = DB::transaction(function () use ($cart, $book, $quantity) {
                $item = new CartItem();
                $item->cart_id = $cart->id;
                $item->book_id = $book->id;
                $item->quantity = $quantity;
                $item->discount = $book->discount;
                $item->book_price = $book->price;
                $item->save();

                $cart->total_price = $cart->total_price + ($book->price * (1 - $book->discount/100) * $quantity);
                $cart->save();

                return $this->cartResponse($cart->fresh('cartItems.book'));
            });

            return response()->json($response, 201);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(404, 'Not found', ['resource' => ['Book or cart not found.']]);
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function getUsersCart(Request $request)
    {
        try {
            $user = auth('api')->user();
            $cart = Cart::with('cartItems.book')->where('user_id', $user->id)->first();
            if (!$cart) {
                $cart = $this->getOrCreateCart($user->id)->load('cartItems.book');
            }
            return response()->json($this->cartResponse($cart));
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function updateBookQuantity(Request $request, int $bookId, string $operation)
    {
        try {
            $user = auth('api')->user();
            $delta = strtolower($operation) === 'delete' ? -1 : 1;

            $response = DB::transaction(function () use ($user, $bookId, $delta) {
                $cart = Cart::where('user_id', $user->id)->first();
                if (!$cart) {
                    throw new ModelNotFoundException();
                }
                $book = Book::findOrFail($bookId);
                $item = CartItem::where('cart_id', $cart->id)->where('book_id', $book->id)->first();
                if (!$item) {
                    return $this->errorResponse(404, 'Cart item not found', ['cart' => ['Cart item not found.']]);
                }
                if ($book->quantity <= 0) {
                    return $this->errorResponse(400, 'Book is not available', ['stock' => ['Book is not available.']]);
                }

                $cart->total_price = $cart->total_price - ($item->book_price * (1 - ($item->discount)/100) * $item->quantity);

                $newQty = $item->quantity + $delta;
                if ($newQty < 0) {
                    $newQty = 0;
                }
                if ($newQty > $book->quantity) {
                    return $this->errorResponse(400, 'Quantity exceeds stock', ['stock' => ['Requested quantity exceeds available stock.']]);
                }

                if ($newQty === 0) {
                    $item->delete();
                } else {
                    $item->quantity = $newQty;
                    $item->book_price = $book->price;
                    $item->discount = $book->discount;
                    $item->save();
                }

                $cart->total_price = $cart->total_price + ($book->price * (1 - $book->discount/100) * ($newQty));
                $cart->save();

                return response()->json($this->cartResponse($cart->fresh('cartItems.book')));
            });

            return $response;
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(404, 'Not found', ['resource' => ['Cart or book not found.']]);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function deleteBook(Request $request, int $bookId)
    {
        try {
            $user = auth('api')->user();

            $result = DB::transaction(function () use ($user, $bookId) {
                $cart = Cart::where('user_id', $user->id)->first();
                if (!$cart) {
                    throw new ModelNotFoundException();
                }
                $item = CartItem::where('cart_id', $cart->id)->where('book_id', $bookId)->first();
                if (!$item) {
                    return $this->errorResponse(404, 'Cart item not found', ['cart' => ['Cart item not found.']]);
                }
                $cart->total_price = $cart->total_price - ($item->book_price * (1 - ($item->discount)/100) * $item->quantity);
                $item->delete();
                $cart->save();

                return response()->json(['message' => 'Book removed from cart']);
            });

            return $result;
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(404, 'Cart not found', ['cart' => ['Cart not found.']]);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function totalItems(Request $request)
    {
        try {
            $user = auth('api')->user();
            $cart = Cart::withCount('cartItems')->where('user_id', $user->id)->first();
            if (!$cart) {
                return response()->json(0);
            }
            return response()->json($cart->cart_items_count);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    private function getOrCreateCart(int $userId): Cart
    {
        $cart = Cart::where('user_id', $userId)->first();
        if ($cart) return $cart;
        $cart = new Cart();
        $cart->user_id = $userId;
        $cart->total_price = 0;
        $cart->save();
        return $cart;
    }

    private function cartResponse(Cart $cart): array
    {
        $books = [];
        foreach ($cart->cartItems as $ci) {
            $b = $ci->book;
            $books[] = [
                'id' => $b->id,
                'title' => $b->title,
                'price' => $b->price,
                'discount' => $b->discount,
                'quantity' => $ci->quantity,
            ];
        }
        return [
            'cartId' => $cart->id,
            'totalPrice' => $cart->total_price,
            'books' => $books,
        ];
    }

    private function errorResponse(int $status, string $message, array $errors = [])
    {
        return response()->json([
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
