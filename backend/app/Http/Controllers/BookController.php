<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

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

// GET /api/books/book?Id=123  (giữ đúng chữ I hoa; cũng chấp nhận id)
    public function getBookById(Request $request)
    {
        $id = $request->query('Id', $request->query('id'));
        if (!$id) {
            return response()->json(['message' => 'Thiếu tham số Id'], 400);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(null, 404);
        }
        return new BookResource($book);
    }

    // PATCH /api/books?id=123  (partial update, logic y như Java)
    public function update(Request $request)
    {
        $id = $request->query('id', $request->query('Id'));
        if (!$id) {
            return response()->json(['message' => 'Thiếu tham số id'], 400);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Không tìm thấy Book với id = '.$id], 404);
        }

        // Validate "sometimes" cho patch
        $validator = Validator::make($request->all(), [
            'title'            => ['sometimes','string','max:255'],
            'author'           => ['sometimes','string','max:255'],
            'description'      => ['sometimes','string','max:1000'],
            'category'         => ['sometimes','string','max:100'],
            'price'            => ['sometimes','numeric','gt:0'],
            'publisher'        => ['sometimes','string','max:255'],
            'publication_date' => ['sometimes','date','date_format:Y-m-d','before_or_equal:today'],
            'language'         => ['sometimes','string','max:100'],
            'reading_age'      => ['sometimes','integer','min:0'],
            'pages'            => ['sometimes','integer','min:1'],
            'dimension'        => ['sometimes','nullable','string','max:50'],
            'quantity'         => ['sometimes','integer','min:0'],
            'discount'         => ['sometimes','numeric','min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors'  => $validator->messages(),
            ], 422);
        }

        $data = $validator->validated();

        // Java logic:
        // - Nếu title null hoặc bằng title cũ -> update các field còn lại
        // - Nếu title khác và đã tồn tại ở record khác -> 422
        // - Ngược lại cho phép đổi title
        if (array_key_exists('title', $data)) {
            $newTitle = $data['title'];
            if ($newTitle !== null && $newTitle !== $book->title) {
                $exists = Book::where('title', $newTitle)->where('id', '!=', $book->id)->exists();
                if ($exists) {
                    return response()->json(['message' => 'Title đã tồn tại'], 422);
                }
            }
        }

        // Gán từng field nếu có trong request (partial)
        foreach ([
            'title','author','description','category','price','publisher',
            'publication_date','language','reading_age','pages','dimension',
            'quantity','discount'
        ] as $f) {
            if ($request->has($f)) {
                $book->{$f} = $data[$f]; // đã validate/đã cast cơ bản
            }
        }

        $book->save();

        return new BookResource($book);
    }

    // DELETE /api/books?id=123  (xóa, dọn cart_items nếu có)
    public function destroy(Request $request)
    {
        $id = $request->query('id', $request->query('Id'));
        if (!$id) {
            return response()->json(['message' => 'Thiếu tham số id'], 400);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Không tìm thấy Book với id = '.$id], 404);
        }

        DB::beginTransaction();
        try {
            // Nếu có bảng cart_items thì xóa tham chiếu (bắt chước service Java)
            if (Schema::hasTable('cart_items')) {
                DB::table('cart_items')->where('book_id', $id)->delete();
            }

            $book->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Xóa thất bại', 'error' => $e->getMessage()], 500);
        }
    }

    // GET /api/books/search?searchTerm=...&sort=price,asc&page=0&size=12&filter_price_gte=10&filter_publication_date_lte=2020-01-01
    public function search(Request $request)
    {
        $searchTerm = $request->query('searchTerm');
        $sort       = $request->query('sort');            // "field,asc|desc"
        $page       = (int) $request->query('page', 0);   // 0-based như Java
        $size       = (int) $request->query('size', 12);

        $query = Book::query();

        // searchTerm: LIKE trên vài cột text
        if ($searchTerm !== null && trim($searchTerm) !== '') {
            $term = mb_strtolower($searchTerm);
            $query->where(function($q) use ($term) {
                foreach (['title','author','description','category','publisher','language'] as $col) {
                    $q->orWhereRaw('LOWER('.$col.') LIKE ?', ["%{$term}%"]);
                }
            });
        }

        // filters: mọi key bắt đầu bằng filter_
        $filters = collect($request->query())
            ->filter(fn($v,$k) => str_starts_with($k, 'filter_'));

        // Kiểu dữ liệu cho các field để ép kiểu an toàn
        $types = [
            'id'               => 'int',
            'title'            => 'string',
            'author'           => 'string',
            'description'      => 'string',
            'category'         => 'string',
            'price'            => 'float',
            'publisher'        => 'string',
            'publication_date' => 'date',
            'language'         => 'string',
            'reading_age'      => 'int',
            'pages'            => 'int',
            'dimension'        => 'string',
            'quantity'         => 'int',
            'discount'         => 'float',
        ];

        foreach ($filters as $key => $value) {
            // filter_field_operator=value
            $raw = substr($key, strlen('filter_'));
            $parts = explode('_', $raw, 2);
            $field = $parts[0] ?? null;
            $op    = strtolower($parts[1] ?? 'eq');

            if (!$field || !array_key_exists($field, $types)) {
                return response()->json(['message' => "Trường không hỗ trợ: {$field}"], 400);
            }

            // ép kiểu
            try {
                $typed = match ($types[$field]) {
                    'int'   => (int) $value,
                    'float' => (float) $value,
                    'date'  => Carbon::parse($value)->toDateString(), // Y-m-d
                    default => (string) $value,
                };
            } catch (\Throwable $e) {
                return response()->json(['message' => "Giá trị không hợp lệ cho {$field}: {$value}"], 400);
            }

            // áp điều kiện
            switch ($op) {
                case 'eq':  $query->where($field, '=', $typed); break;
                case 'neq': $query->where($field, '!=', $typed); break;
                case 'gte': $query->where($field, '>=', $typed); break;
                case 'lte': $query->where($field, '<=', $typed); break;
                case 'gt':  $query->where($field, '>',  $typed); break;
                case 'lt':  $query->where($field, '<',  $typed); break;
                case 'like':
                    if ($types[$field] !== 'string') {
                        return response()->json(['message' => "Toán tử like chỉ áp dụng cho chuỗi: {$field}"], 400);
                    }
                    $query->where($field, 'LIKE', "%{$typed}%");
                    break;
                default:
                    return response()->json(['message' => "Toán tử không hỗ trợ: {$op}"], 400);
            }
        }

        // sort: "field,asc|desc"
        if ($sort) {
            $parts = array_map('trim', explode(',', $sort));
            if (count($parts) !== 2) {
                return response()->json(['message' => 'Tham số sort không hợp lệ!'], 400);
            }
            [$sField, $dir] = $parts;
            $dir = strtolower($dir) === 'desc' ? 'desc' : 'asc';
            if (!array_key_exists($sField, $types)) {
                return response()->json(['message' => "Không thể sort theo trường: {$sField}"], 400);
            }
            $query->orderBy($sField, $dir);
        }

        // paginate: Laravel là 1-based => +1
        $paginator = $query->paginate($size, ['*'], 'page', $page + 1);

        // Trả về giống Java (Page) nhưng theo chuẩn Laravel Resource + meta
        return BookResource::collection($paginator);
    }

    // GET /api/books/searchTitle?term=abc
    public function searchTitle(Request $request)
    {
        $term = $request->query('term');
        if ($term === null || trim($term) === '') {
            // như Java: trả tất cả nếu không có term
            return BookResource::collection(Book::all());
        }

        $term = mb_strtolower($term);
        $books = Book::whereRaw('LOWER(title) LIKE ?', ["%{$term}%"])->get();

        return BookResource::collection($books);
    }


}
