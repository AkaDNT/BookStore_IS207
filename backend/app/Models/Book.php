<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string $author
 * @property string $description
 * @property string $category
 * @property string $publisher
 * @property string $language
 * @property string $dimension
 * @property \Illuminate\Support\Carbon $publication_date
 * @property int $reading_age
 * @property int $pages
 * @property int $quantity
 * @property string $price
 * @property string $discount
 */
class Book extends Model
{
    use HasFactory;


    protected $table = 'books';

    public $timestamps = false;

    protected $fillable = [
        'title',
        'author',
        'description',
        'category',
        'price',
        'publisher',
        'publication_date',
        'language',
        'reading_age',
        'pages',
        'dimension',
        'quantity',
        'discount',
    ];

    protected $casts = [
        'id'               => 'integer',
        'price'            => 'decimal:2',
        'publication_date' => 'date',
        'reading_age'      => 'integer',
        'pages'            => 'integer',
        'quantity'         => 'integer',
        'discount'         => 'decimal:2',
    ];
}
