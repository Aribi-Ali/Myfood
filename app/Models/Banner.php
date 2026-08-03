<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'image_path',
        'link_url',
        'active',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
