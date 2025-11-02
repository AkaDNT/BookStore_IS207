<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::get();
        if ($books->count() > 0) {
            return BookResource::collection($books);
        } else {
            return response()->json(['message' => 'No record available'], 200);
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
            'publicationDate'  => ['required','date','before_or_equal:today'],
            'language'         => ['required','string','max:100'],
            'readingAge'       => ['required','integer','min:0'],
            'pages'            => ['required','integer','min:1'],
            'dimension'        => ['nullable','string','max:50'],
            'quantity'         => ['sometimes','integer','min:0'],
            'discount'         => ['sometimes','numeric','min:0'],
            'imageUrl'         => ['sometimes','nullable','string','url',],
        ]);

        if ($validated->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validated->messages(),
            ], 422);
        }

        $data = $validated->validated();
        $data['quantity'] = (int) $request->input('quantity', 0);
        $data['discount'] = (float) $request->input('discount', 0.0);

        $payload = [];
        foreach ($data as $k => $v) {
            $payload[Str::snake($k)] = $v;
        }

        $book = Book::create($payload);

        return response()->json([
            'message' => 'Book created successfully',
            'data'    => new BookResource($book),
        ], 201);
    }

    public function getBookById(Request $request)
    {
        $id = $request->query('Id', $request->query('id'));
        if (!$id) {
            return response()->json(['message' => 'Missing parameter: Id'], 400);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(null, 404);
        }
        return new BookResource($book);
    }

    public function update(Request $request)
    {
        $id = $request->query('id', $request->query('Id'));
        if (!$id) {
            return response()->json(['message' => 'Missing parameter: id'], 400);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found with id = '.$id], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'           => ['sometimes','string','max:255'],
            'author'          => ['sometimes','string','max:255'],
            'description'     => ['sometimes','string','max:1000'],
            'category'        => ['sometimes','string','max:100'],
            'price'           => ['sometimes','numeric','gt:0'],
            'publisher'       => ['sometimes','string','max:255'],
            'publicationDate' => ['sometimes','date','date_format:Y-m-d','before_or_equal:today'],
            'language'        => ['sometimes','string','max:100'],
            'readingAge'      => ['sometimes','integer','min:0'],
            'pages'           => ['sometimes','integer','min:1'],
            'dimension'       => ['sometimes','nullable','string','max:50'],
            'quantity'        => ['sometimes','integer','min:0'],
            'discount'        => ['sometimes','numeric','min:0'],
            'imageUrl'         => ['sometimes','nullable','string','url',],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->messages(),
            ], 422);
        }

        $data = $validator->validated();

        if (array_key_exists('title', $data)) {
            $newTitle = $data['title'];
            if ($newTitle !== null && $newTitle !== $book->title) {
                $exists = Book::where('title', $newTitle)->where('id', '!=', $book->id)->exists();
                if ($exists) {
                    return response()->json(['message' => 'Title already exists'], 422);
                }
            }
        }

        $map = [
            'title','author','description','category','price','publisher',
            'publicationDate','language','readingAge','pages','dimension',
            'quantity','discount','imageUrl'
        ];

        foreach ($map as $f) {
            if ($request->has($f)) {
                $snake = Str::snake($f);
                $book->{$snake} = $data[$f];
            }
        }

        $book->save();

        return new BookResource($book);
    }

    public function destroy(Request $request)
    {
        $id = $request->query('id', $request->query('Id'));
        if (!$id) {
            return response()->json(['message' => 'Missing parameter: id'], 400);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found with id = '.$id], 404);
        }

        DB::beginTransaction();
        try {
            if (Schema::hasTable('cart_items')) {
                DB::table('cart_items')->where('book_id', $id)->delete();
            }

            $book->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Delete failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function search(Request $request)
    {
        $searchTerm = $request->query('searchTerm');
        $sort       = $request->query('sort');
        $page       = (int) $request->query('page', 0);
        $size       = (int) $request->query('size', 12);

        $query = Book::query();

        if ($searchTerm !== null && trim($searchTerm) !== '') {
            $term = mb_strtolower($searchTerm);
            $query->where(function($q) use ($term) {
                foreach (['title','author','description','category','publisher','language'] as $col) {
                    $q->orWhereRaw('LOWER('.$col.') LIKE ?', ["%{$term}%"]);
                }
            });
        }

        $filters = collect($request->query())
            ->filter(fn($v,$k) => str_starts_with($k, 'filter_'));

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
            $raw = substr($key, strlen('filter_'));
            $parts = explode('_', $raw, 2);
            $fieldRaw = $parts[0] ?? null;
            $op       = strtolower($parts[1] ?? 'eq');

            $field = Str::snake($fieldRaw ?? '');
            if (!$field || !array_key_exists($field, $types)) {
                return response()->json(['message' => "Unsupported field: {$fieldRaw}"], 400);
            }

            try {
                $typed = match ($types[$field]) {
                    'int'   => (int) $value,
                    'float' => (float) $value,
                    'date'  => Carbon::parse($value)->toDateString(),
                    default => (string) $value,
                };
            } catch (\Throwable $e) {
                return response()->json(['message' => "Invalid value for {$fieldRaw}: {$value}"], 400);
            }

            switch ($op) {
                case 'eq':  $query->where($field, '=', $typed); break;
                case 'neq': $query->where($field, '!=', $typed); break;
                case 'gte': $query->where($field, '>=', $typed); break;
                case 'lte': $query->where($field, '<=', $typed); break;
                case 'gt':  $query->where($field, '>',  $typed); break;
                case 'lt':  $query->where($field, '<',  $typed); break;
                case 'like':
                    if ($types[$field] !== 'string') {
                        return response()->json(['message' => "Operator like only applies to string: {$fieldRaw}"], 400);
                    }
                    $query->where($field, 'LIKE', "%{$typed}%");
                    break;
                default:
                    return response()->json(['message' => "Unsupported operator: {$op}"], 400);
            }
        }

        if ($sort) {
            $parts = array_map('trim', explode(',', $sort));
            if (count($parts) !== 2) {
                return response()->json(['message' => 'Invalid sort parameter'], 400);
            }
            [$sField, $dir] = $parts;
            $sField = Str::snake($sField);
            $dir = strtolower($dir) === 'desc' ? 'desc' : 'asc';
            if (!array_key_exists($sField, $types)) {
                return response()->json(['message' => "Cannot sort by field: {$parts[0]}"], 400);
            }
            $query->orderBy($sField, $dir);
        }

        $paginator = $query->paginate($size, ['*'], 'page', $page + 1);
        return BookResource::collection($paginator);
    }

    public function searchTitle(Request $request)
    {
        $term = $request->query('term');
        if ($term === null || trim($term) === '') {
            return BookResource::collection(Book::all());
        }

        $term = mb_strtolower($term);
        $books = Book::whereRaw('LOWER(title) LIKE ?', ["%{$term}%"])->get();

        return BookResource::collection($books);
    }
}
