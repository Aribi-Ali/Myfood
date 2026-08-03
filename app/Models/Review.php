<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Store;
use App\Models\ReviewFlag;

/**
 * Review model.
 *
 * @property int $id
 * @property int $client_id
 * @property int $store_id
 * @property int $rating
 * @property string $comment
 * @property string|null $admin_reply
 */
class Review extends Model
{
    use HasFactory;
    protected $fillable = ['client_id', 'store_id', 'rating', 'comment', 'admin_reply'];


    /**
     * Get the flags for this review.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<ReviewFlag>
     */
    public function flags(): HasMany
    {
        return $this->hasMany(ReviewFlag::class);
    }

    protected $casts = [
        'rating' => 'integer',
        'admin_reply' => 'string',
    ];

    /**
     * The client who wrote the review.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, Review>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * The store the review belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Store, Review>
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
