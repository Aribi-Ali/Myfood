<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\ClientReport;
use App\Models\User;
use App\Models\UserBan;
use App\Notifications\UserWarning;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'role' => 'nullable|in:admin,owner,delivery,client,chef',
            'search' => 'nullable|string|max:100',
            'banned' => 'nullable|boolean',
        ]);

        $query = User::query()
            ->withCount(['orders', 'reviews', 'store'])
            ->with(['activeBan' => fn($q) => $q->with('bannedBy:id,name')]);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', $s)
                  ->orWhere('email', 'like', $s)
                  ->orWhere('phone', 'like', $s);
            });
        }

        if ($request->boolean('banned')) {
            $query->whereHas('activeBan');
        }

        $users = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($users);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::withCount(['orders', 'reviews', 'store'])
            ->with([
                'store',
                'chefProfile',
                'deliveryProfile',
                'activeBan' => fn($q) => $q->with('bannedBy:id,name'),
                'userBans' => fn($q) => $q->with('bannedBy:id,name')->latest('banned_at'),
            ])
            ->findOrFail($id);

        return $this->success($user);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $id,
            'role' => 'sometimes|in:admin,owner,delivery,client,chef',
            'profile_image' => 'nullable|string|max:255',
            'wilaya' => 'nullable|string|max:255',
            'daira' => 'nullable|string|max:255',
            'commune' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        if (isset($validated['role']) && $validated['role'] !== $user->role->value) {
            if ($user->isAdmin() && User::where('role', Role::Admin)->count() <= 1) {
                return $this->error('Cannot change role of the last admin.', 422);
            }
        }

        $user->update($validated);

        return $this->success($user->fresh(), 200, 'User updated.');
    }

    public function verifyEmail(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->email_verified_at) {
            return $this->success($user, 200, 'Email already verified.');
        }

        $user->update(['email_verified_at' => now()]);

        return $this->success($user->fresh(), 200, 'Email verified.');
    }

    public function createUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20|unique:users,phone',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,owner,delivery,client,chef',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return $this->success($user, 201, 'User created.');
    }

    /**
     * Ban a user globally from the entire app.
     */
    public function ban(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return $this->error('Cannot ban an admin.', 422);
        }

        if ($user->isGloballyBanned()) {
            return $this->error('User is already banned.', 422);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        UserBan::create([
            'user_id' => $user->id,
            'banned_by' => Auth::id(),
            'reason' => $request->reason,
            'banned_at' => now(),
        ]);

        $user->tokens()->delete();

        return $this->success(null, 200, 'User banned globally.');
    }

    /**
     * Unban a user (lift the global ban).
     */
    public function unban(int $id): JsonResponse
    {
        $ban = UserBan::where('user_id', $id)
            ->whereNull('unbanned_at')
            ->first();

        if (!$ban) {
            return $this->error('User is not banned.', 404);
        }

        $ban->update(['unbanned_at' => now()]);

        return $this->success(null, 200, 'User unbanned.');
    }

    /**
     * Send a warning notification to a user.
     */
    public function sendWarning(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $user->notify(new UserWarning(
            subject: $validated['subject'],
            message: $validated['message'],
            sentBy: Auth::user()->name,
        ));

        return $this->success(null, 200, 'Warning sent successfully.');
    }

    /**
     * List all client reports (across all stores) for admin review.
     */
    public function reportedClients(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|in:pending,reviewed,dismissed',
        ]);

        $query = ClientReport::with([
            'client:id,name,email,phone,profile_image',
            'store:id,name,alias',
            'reporter:id,name',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.complaints', 20));

        return $this->success($reports);
    }

    /**
     * Resolve or dismiss a client report.
     */
    public function resolveReport(Request $request, int $id): JsonResponse
    {
        $report = ClientReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:reviewed,dismissed',
            'admin_reply' => 'nullable|string|max:2000',
        ]);

        $report->update([
            'status' => $validated['status'],
            'admin_reply' => $validated['admin_reply'] ?? null,
            'resolved_at' => now(),
        ]);

        return $this->success($report->fresh(), 200, 'Report ' . $validated['status'] . '.');
    }
}
