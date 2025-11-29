<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\{
    Order,
    OrderItem,
    Payment,
    Cart,
    CartItem,
    Address,
    Book,
    User
};
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;


class VnpayController extends Controller
{
    public function create(Request $request)
{
    $data = $request->validate([
        'addressId' => ['required', 'integer', 'min:1'],
    ]);

    $user   = auth('api')->user();
    $ipAddr = $request->ip(); 

    return DB::transaction(function () use ($user, $data, $ipAddr) {

        $cart = Cart::with('cartItems.book')
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart empty'], 400);
        }

        $address = Address::where('id', $data['addressId'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        // 1. Payment PENDING
        $payment = Payment::create([
            'payment_method' => 'VNPAY',
            'pg_status'      => 'PENDING',
            'pg_name'        => 'VNPAY',
        ]);

        // 2. Order PENDING
        $order = Order::create([
            'email'          => $user->email,
            'order_date'     => now()->toDateString(),
            'payment_id'     => $payment->id,
            'address_id'     => $address->id,
            'total_amount'   => $cart->total_price,
            'order_status'   => 'ACCEPTED',
            'payment_status' => 'PENDING',
            'order_code'     => strtoupper(Str::ulid()),
        ]);

        // 3. Copy cart items sang order_items
        $itemsPayload = [];
        foreach ($cart->cartItems as $ci) {
            if (!$ci->book) {
                return response()->json(['message' => 'Invalid cart item'], 400);
            }

            $itemsPayload[] = [
                'order_id'           => $order->id,
                'book_id'            => $ci->book->id,
                'quantity'           => $ci->quantity,
                'discount'           => $ci->discount,
                'ordered_book_price' => $ci->book_price,
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }
        OrderItem::insert($itemsPayload);

        // 4. Build URL thanh toán VNPAY 
        $vnp_TmnCode    = env('VNP_TMN_CODE');
        $vnp_HashSecret = env('VNP_HASH_SECRET');
        $vnp_Url        = env('VNP_URL');          
        $vnp_ReturnUrl  = env('VNP_RETURN_URL');  

        $usdAmount = (float) $order->total_amount;

        // Convert sang VND bằng API
        $vndAmount = $this->usdToVnd($usdAmount);

        $order->total_amount_vnd = $vndAmount;
        $order->save();

        if (property_exists($order->payment, 'pg_amount')) {
            $order->payment->pg_amount = $vndAmount;
            $order->payment->save();
        }

        $vnp_TxnRef = $order->order_code;
        $vnp_Amount = $vndAmount * 100; 

        $vnp_OrderInfo = 'Thanh toan don hang #' . $order->order_code;
        $vnp_OrderType = 'billpayment';
        $vnp_Locale    = 'vn';
        $vnp_IpAddr    = $ipAddr;

        $inputData = [
            "vnp_Version"    => "2.1.0",
            "vnp_TmnCode"    => $vnp_TmnCode,
            "vnp_Amount"     => $vnp_Amount,
            "vnp_Command"    => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'),
            "vnp_CurrCode"   => "VND",
            "vnp_IpAddr"     => $vnp_IpAddr,
            "vnp_Locale"     => $vnp_Locale,
            "vnp_OrderInfo"  => $vnp_OrderInfo,
            "vnp_OrderType"  => $vnp_OrderType,
            "vnp_ReturnUrl"  => $vnp_ReturnUrl,
            "vnp_TxnRef"     => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query    = "";
        $hashdata = "";
        $i        = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnpUrl = $vnp_Url . "?" . $query;
        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnpUrl       .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        Log::info('VNPAY_CREATE_HASH', [
            'hashData' => $hashdata,
            'url'      => $vnpUrl,
        ]);

        return response()->json([
            'code'      => '00',
            'message'   => 'success',
            'data'      => $vnpUrl,                 // giống $returnData['data']
            'orderCode' => $order->order_code,      // thêm cho FE dễ tra
        ]);
    });
}


    /**
     * Return URL: chỉ để điều hướng FE, không dùng để xác nhận thanh toán.
     */
    public function return(Request $request)
    {
        $orderCode = $request->input('vnp_TxnRef');
        $frontend  = rtrim(env('APP_FRONTEND', ''), '/');

        // FE sẽ dùng orderCode này để gọi API xem trạng thái thực (PAID/PENDING)
        return redirect($frontend . '/checkout/vnpay/result?orderCode=' . urlencode($orderCode));
    }

    /*
     *  1. Verify chữ ký
     *  2. Xác nhận trạng thái (vnp_ResponseCode, vnp_TransactionStatus)
     *  3. Đối soát số tiền
     *  4. Nếu ok -> trừ kho, dọn giỏ, set PAID
     */
    public function ipn(Request $request)
{
    $vnp_HashSecret = env('VNP_HASH_SECRET');

    // Lấy toàn bộ tham số vnp_*
    $inputData = [];
    foreach ($request->all() as $key => $value) {
        if (str_starts_with($key, 'vnp_')) {
            $inputData[$key] = $value;
        }
    }

    $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? null;
    unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

    ksort($inputData);
    $hashdata = "";
    $i        = 0;
    foreach ($inputData as $key => $value) {
        if ($i == 1) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashdata .= urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
    }

    $calcHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

    Log::info('VNPAY_IPN_VERIFY', [
        'hashData' => $hashdata,
        'recvHash' => $vnp_SecureHash,
        'calcHash' => $calcHash,
    ]);

    if (!$vnp_SecureHash || $calcHash !== $vnp_SecureHash) {
        return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
    }

    $orderCode       = $inputData['vnp_TxnRef']             ?? null;
    $responseCode    = $inputData['vnp_ResponseCode']       ?? null;
    $transactionStat = $inputData['vnp_TransactionStatus']  ?? null;
    $amount          = isset($inputData['vnp_Amount']) ? (int)$inputData['vnp_Amount'] : 0;

    if (!$orderCode) {
        return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
    }

    $order = Order::with(['payment', 'orderItems.book'])
        ->where('order_code', $orderCode)
        ->lockForUpdate()
        ->first();

    if (!$order || !$order->payment) {
        return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
    }

    if ($order->payment_status === 'PAID') {
        return response()->json(['RspCode' => '00', 'Message' => 'Order already confirmed']);
    }

    if ($responseCode !== '00' || $transactionStat !== '00') {
        $order->payment_status = 'FAILED';
        $order->payment->pg_status = 'FAILED';
        $order->payment->pg_response_message = 'Payment failed: ' . $responseCode . '/' . $transactionStat;
        $order->payment->save();
        $order->save();

        return response()->json(['RspCode' => '00', 'Message' => 'Payment failed']);
    }

    $expectedAmount = (int) ($order->total_amount_vnd * 100);
    if ($amount !== $expectedAmount) {
    return response()->json(['RspCode' => '04', 'Message' => 'Invalid amount']);
    }


    DB::transaction(function () use ($order) {
        // 1. Trừ kho
        foreach ($order->orderItems as $item) {
            $book = $item->book;
            if (!$book) {
                continue;
            }
            if ($book->quantity < $item->quantity) {
                continue;
            }
            $book->quantity = max(0, $book->quantity - $item->quantity);
            $book->save();
        }

        // 2. Dọn giỏ
        $userId = User::where('email', $order->email)->value('id');
        if ($userId) {
            $cart = Cart::with('cartItems')->where('user_id', $userId)->first();
            if ($cart) {
                CartItem::where('cart_id', $cart->id)->delete();
                $cart->total_price = 0;
                $cart->save();
            }
        }

        // 3. Cập nhật trạng thái thanh toán
        $order->payment_status = 'PAID';
        $order->paid_at        = now();
        $order->payment->pg_status = 'SUCCESS';
        $order->payment->pg_response_message = 'Payment success';
        $order->payment->save();
        $order->save();
    });

    return response()->json(['RspCode' => '00', 'Message' => 'Confirm success']);
}

//HELPER
    protected function usdToVnd(float $amountUsd): int
{
    $url  = config('services.fx.url');
    $from = config('services.fx.from', 'USD');
    $to   = config('services.fx.to', 'VND');
    $key  = config('services.fx.key');

    $params = [
        'from'   => $from,
        'to'     => $to,
        'amount' => $amountUsd,
    ];

    if ($key) {
        $params['access_key'] = $key;
    }

    try {
        $client = Http::timeout(5);

        if (app()->environment('local')) {
            $client = $client->withoutVerifying();
        }

        $res = $client->get($url, $params);
    } catch (\Throwable $e) {
        Log::error('FX_API_ERROR', [
            'message' => $e->getMessage(),
        ]);
        throw new \RuntimeException('Không lấy được tỉ giá, vui lòng thử lại');
    }

    if (!$res->ok()) {
        Log::error('FX_API_ERROR_STATUS', [
            'status' => $res->status(),
            'body'   => $res->body(),
        ]);
        throw new \RuntimeException('Không lấy được tỉ giá, vui lòng thử lại');
    }

    $data = $res->json();

    // exchangerate.host/convert: cần success = true và có result
    if (
        empty($data['success']) ||
        $data['success'] !== true ||
        !isset($data['result'])
    ) {
        Log::error('FX_API_INVALID_RESPONSE', ['data' => $data]);
        throw new \RuntimeException('FX API trả về sai định dạng');
    }

    // result = số VND tương ứng với $amountUsd
    return (int) round($data['result']);
}


}
