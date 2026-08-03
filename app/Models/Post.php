<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['store_id', 'title', 'content', 'image'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
