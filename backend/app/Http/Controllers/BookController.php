<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    //
    public function index(){
        $books = Book::get();
        if($books -> count()>0){
            return BookResource::collection($books);
        } else {
            return response()->json(['message'=>'No record available'], 200);
        }
    }

public function store(Request $request)
{
    $validated = Validator::make($request->all(), [
        'title'            => ['required','string','max:255'],
        'author'           => ['required','string','max:255'],
        'description'      => ['required','string','max:1000'],
        'category'         => ['required','string','max:100'],
        'price'            => ['required','numeric','gt:0'],
        'publisher'        => ['required','string','max:255'],
        // Chọn 1 trong 2: (mình khuyên dùng Y-m-d cho cột date)
        'publication_date' => ['required','date','before_or_equal:today'],
        // hoặc: ['required','date_format:Y-m-d','before_or_equal:today'],

        'language'         => ['required','string','max:100'],
        'reading_age'      => ['required','integer','min:0'],
        'pages'            => ['required','integer','min:1'],
        'dimension'        => ['nullable','string','max:50'],
        'quantity'         => ['sometimes','integer','min:0'],
        'discount'         => ['sometimes','numeric','min:0'],
    ]);

    if ($validated->fails()) {
        return response()->json([
            'message' => 'Dữ liệu không hợp lệ',
            'errors'  => $validated->messages(),
        ], 422);
    }

    // Lấy data đã validate
    $data = $validated->validated();

    // Nếu thích đảm bảo kiểu ngày chuẩn:
    // $data['publication_date'] = $request->date('publication_date')->toDateString();

    // Default cho optional fields
    $data['quantity'] = (int) $request->input('quantity', 0);
    $data['discount'] = (float) $request->input('discount', 0.0);

    $book = Book::create($data);

    return response()->json([
        'message' => 'Tạo sách thành công',
        'data'    => new BookResource($book),
    ], 201);
}


}
