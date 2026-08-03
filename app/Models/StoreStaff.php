<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreStaff extends Model
{
    protected $table = 'store_staff';

    protected $fillable = [
        'store_id',
        'user_id',
        'store_role',
        'permissions',
        'years_of_experience',
        'diplomas',
        'age',
        'bio',
        'display_on_profile',
    ];

    protected $casts = [
        'permissions' => 'array',
        'display_on_profile' => 'boolean',
        'years_of_experience' => 'integer',
        'age' => 'integer',
    ];

    protected $appends = ['name'];

    public function getNameAttribute(): string
    {
        return $this->user?->name ?? 'Unknown';
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
