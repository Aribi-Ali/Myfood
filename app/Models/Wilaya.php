<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wilaya extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name_fr', 'name_ar'];

    public function dairas()
    {
        return $this->hasMany(Daira::class);
    }

    public function communes()
    {
        return $this->hasMany(Commune::class);
    }

}
