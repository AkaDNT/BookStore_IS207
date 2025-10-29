<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
// Laravel 9/10/11 dùng middleware này:
use Illuminate\Http\Middleware\TrustProxies as Middleware;
// Nếu bạn dùng Laravel cũ hơn (<=5.8), thay bằng: use Fideloper\Proxy\TrustProxies as Middleware;

class TrustProxies extends Middleware
{
    /**
     * Tin cậy toàn bộ proxy (hoặc bạn có thể liệt kê IP/ CIDR cụ thể).
     */
    protected $proxies = '*';

    /**
     * Các header X-Forwarded-* mà app sẽ đọc.
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO;
}
