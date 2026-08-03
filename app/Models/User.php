<?php

namespace App\Models;

use App\Enums\Role;
use App\Models\ClientBan;
use App\Models\ClientReport;
use App\Models\ClientTrustScore;
use App\Models\UserBan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'phone_verified_at',
        'password',
        'profile_image',
        'role',
        'wilaya',
        'daira',
        'commune',
        'address',
        'latitude',
        'longitude',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
        ];
    }

    // --- ROLE HELPERS ---
    public function isAdmin(): bool
    {
        return $this->role === Role::Admin;
    }

    public function isOwner(): bool
    {
        return $this->role === Role::Owner || Store::where('owner_id', $this->id)->exists();
    }

    public function isDelivery(): bool
    {
        return $this->role === Role::Delivery;
    }

    public function isClient(): bool
    {
        return $this->role === Role::Client;
    }

    /**
     * Checks if staff member has permission inside a given store.
     */
    public function hasStorePermission(int $storeId, string $permission): bool
    {
        // 1. If admin, full access
        if ($this->isAdmin()) {
            return true;
        }

        // 2. If the user owns the store, full access
        $store = Store::where('id', $storeId)->first();
        if ($store && $store->owner_id === $this->id) {
            return true;
        }

        // 3. Otherwise, check staff table for specific role & permissions
        $staff = StoreStaff::where('store_id', $storeId)->where('user_id', $this->id)->first();
        if ($staff) {
            // Manager role has all permissions by default
            if ($staff->store_role === 'manager') {
                return true;
            }
            // Check list of permissions
            return is_array($staff->permissions) && in_array($permission, $staff->permissions);
        }

        return false;
    }

    // --- RELATIONSHIPS ---

    public function store()
    {
        return $this->hasOne(Store::class, 'owner_id');
    }

    public function assignedBranches()
    {
        return $this->belongsToMany(StoreBranch::class, 'branch_user', 'user_id', 'branch_id')
            ->withPivot(['role', 'permissions'])
            ->withTimestamps();
    }

    public function hasBranchPermission(int $branchId, string $permission): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        $branch = StoreBranch::find($branchId);
        if ($branch && $branch->store->owner_id === $this->id) {
            return true;
        }

        $assignment = $this->assignedBranches()->where('branch_id', $branchId)->first();
        if ($assignment) {
            if ($assignment->pivot->role === 'manager') {
                return true;
            }
            $perms = json_decode($assignment->pivot->permissions, true) ?? [];
            return in_array($permission, $perms);
        }

        return false;
    }

    public function staffJobs()
    {
        return $this->hasMany(StoreStaff::class, 'user_id');
    }

    public function deliveryProfile()
    {
        return $this->hasOne(DeliveryProfile::class, 'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'client_id');
    }

    public function deliveryOrders()
    {
        return $this->hasMany(Order::class, 'delivery_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'client_id');
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'client_id');
    }

    public function favoriteRiders()
    {
        return $this->belongsToMany(User::class, 'favorite_deliveries', 'owner_id', 'delivery_user_id');
    }

    /**
     * Get chef profile if user is a chef.
     */
    public function chefProfile()
    {
        return $this->hasOne(ChefProfile::class, 'user_id');
    }

    /**
     * Chef role helper.
     */
    public function isChef(): bool
    {
        return $this->role === Role::Chef;
    }

    // --- Global Ban ---

    public function userBans()
    {
        return $this->hasMany(UserBan::class, 'user_id');
    }

    public function activeBan()
    {
        return $this->hasOne(UserBan::class, 'user_id')->whereNull('unbanned_at')->latestOfMany('banned_at');
    }

    public function isGloballyBanned(): bool
    {
        return $this->activeBan()->exists();
    }

    public function bannedBy()
    {
        return $this->hasMany(UserBan::class, 'banned_by');
    }

    // --- Client Ban / Report / Trust ---

    public function storeBans()
    {
        return $this->hasMany(ClientBan::class, 'client_id');
    }

    public function reportsAgainst()
    {
        return $this->hasMany(ClientReport::class, 'client_id');
    }

    public function reportsMade()
    {
        return $this->hasMany(ClientReport::class, 'reporter_id');
    }

    public function sendPasswordResetNotification(#[\SensitiveParameter] $token): void
    {
        $this->notify(new \App\Notifications\ResetPassword($token));
    }

    public function trustScore()
    {
        return $this->hasOne(ClientTrustScore::class, 'client_id')->whereNull('store_id');
    }

    public function storeTrustScores()
    {
        return $this->hasMany(ClientTrustScore::class, 'client_id');
    }

    // ── Phone Verification ──

    public function isPhoneVerified(): bool
    {
        return $this->phone_verified_at !== null;
    }

    public function phoneVerificationCodes()
    {
        return $this->morphMany(PhoneVerificationCode::class, 'verifiable');
    }
}
