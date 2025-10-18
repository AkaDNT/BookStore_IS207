<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    protected $fillable = [
        'payment_method','pg_payment_id','pg_status','pg_response_message','pg_name'
    ];

    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }
}
