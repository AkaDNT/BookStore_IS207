<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id'               => (int) $this->id,
            'title'            => (string) $this->title,
            'author'           => (string) $this->author,
            'description'      => (string) $this->description,
            'category'         => (string) $this->category,
            'price'            => $this->whenNotNull($this->price, fn () => (float) $this->price),
            'publisher'        => (string) $this->publisher,
            'publicationDate'  => optional($this->publication_date)->toDateString(), // YYYY-MM-DD
            'language'         => (string) $this->language,
            'readingAge'       => (int) $this->reading_age,
            'pages'            => (int) $this->pages,
            'dimension'        => (string) $this->dimension,
            'quantity'         => (int) $this->quantity,
            'discount'         => $this->whenNotNull($this->discount, fn () => (float) $this->discount),
            'imageUrl'        =>  (string)$this->image_url
        ];
    }
}
