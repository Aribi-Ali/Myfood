<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commune extends Model
{
    use HasFactory;

    protected $fillable = ['daira_id', 'wilaya_id', 'name_fr', 'name_ar'];

    public function daira()
    {
        return $this->belongsTo(Daira::class);
    }

    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class);
    }

}
