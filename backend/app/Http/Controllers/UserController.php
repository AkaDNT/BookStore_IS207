<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Order;
use Exception;

class UserController extends Controller
{
    public function me(Request $request)
    {
        try {
            $authUser = auth('api')->user();
            if (!$authUser) {
                return $this->errorResponse(401, 'Unauthenticated', ['auth' => ['Token is missing or invalid.']]);
            }

            $user = User::query()
                ->with('addresses')
                ->findOrFail($authUser->id);

            $roles = DB::table('roles')
                ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                ->where('role_user.user_id', $user->id)
                ->pluck('roles.name')
                ->toArray();

            $addresses = $user->addresses->map(fn($a) => [
                'id' => $a->id,
                'street' => $a->street,
                'buildingName' => $a->building_name,
                'city' => $a->city,
                'district' => $a->district,
                'ward' => $a->ward,
            ])->values()->all();

            return response()->json([
                'id' => $user->id,
                'userName' => $user->user_name,
                'email' => $user->email,
                'phoneNumber' => $user->phone_number,
                'roles' => implode(',', $roles),
                'addresses' => $addresses,
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function myOrders(Request $request)
    {
        try {
            $user = auth('api')->user();
            if (!$user) {
                return $this->errorResponse(401, 'Unauthenticated', ['auth' => ['Token is missing or invalid.']]);
            }

            $orders = Order::with(['orderItems.book', 'address', 'payment'])
                ->where('email', $user->email)
                ->orderByDesc('order_date')
                ->get();

            $list = [];
            foreach ($orders as $o) {
                $list[] = $this->orderResponse($o);
            }
            return response()->json($list);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function updateMe(Request $request)
    {
        try {
            $authUser = auth('api')->user();
            if (!$authUser) {
                return $this->errorResponse(401, 'Unauthenticated', ['auth' => ['Token is missing or invalid.']]);
            }

            $data = $request->validate([
                'userName' => ['sometimes','string','min:2','max:20', Rule::unique('users','user_name')->ignore($authUser->id)],
                'email' => ['sometimes','email','max:50', Rule::unique('users','email')->ignore($authUser->id)],
                'phoneNumber' => ['sometimes','nullable','string','min:9','max:15'],
                'password' => ['sometimes','string','min:6','max:100'],
            ]);

            $payload = [];
            foreach ($data as $k => $v) {
                $payload[Str::snake($k)] = $v;
            }

            if (array_key_exists('user_name', $payload)) $payload['user_name'] = mb_strtolower(trim($payload['user_name']), 'UTF-8');
            if (array_key_exists('email', $payload)) $payload['email'] = mb_strtolower(trim($payload['email']), 'UTF-8');

            User::where('id', $authUser->id)->update($payload);

            $user = User::query()
                ->with('addresses')
                ->findOrFail($authUser->id);

            $roles = DB::table('roles')
                ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                ->where('role_user.user_id', $user->id)
                ->pluck('roles.name')
                ->toArray();

            $addresses = $user->addresses->map(fn($a) => [
                'id' => $a->id,
                'street' => $a->street,
                'buildingName' => $a->building_name,
                'city' => $a->city,
                'district' => $a->district,
                'ward' => $a->ward,
            ])->values()->all();

            return response()->json([
                'id' => $user->id,
                'userName' => $user->user_name,
                'email' => $user->email,
                'phoneNumber' => $user->phone_number,
                'roles' => implode(',', $roles),
                'addresses' => $addresses,
            ]);
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    private function orderResponse(Order $order): array
    {
        $items = [];
        foreach ($order->orderItems as $oi) {
            $items[] = [
                'orderItemId' => $oi->id,
                'bookId' => $oi->book_id,
                'title' => optional($oi->book)->title,
                'quantity' => $oi->quantity,
                'discount' => $oi->discount,
                'orderedBookPrice' => $oi->ordered_book_price,
            ];
        }
        return [
            'orderId' => $order->id,
            'email' => $order->email,
            'orderDate' => $order->order_date,
            'totalAmount' => $order->total_amount,
            'orderStatus' => $order->order_status,
            'addressId' => $order->address_id,
            'payment' => $order->payment ? [
                'paymentId' => $order->payment->id,
                'paymentMethod' => $order->payment->payment_method,
                'pgPaymentId' => $order->payment->pg_payment_id,
                'pgStatus' => $order->payment->pg_status,
                'pgResponseMessage' => $order->payment->pg_response_message,
                'pgName' => $order->payment->pg_name,
            ] : null,
            'orderItems' => $items,
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
