<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreStaff;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerStaffController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $staff = StoreStaff::where('store_id', $store->id)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->success($staff);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $data = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'store_role' => 'required|string|max:50',
                'display_on_profile' => 'boolean',
            ]);

            $user = User::find($data['user_id']);

            if ($user->id === Auth::id()) {
                return $this->error('You cannot add yourself as staff.', 422);
            }

            $exists = StoreStaff::where('store_id', $store->id)
                ->where('user_id', $data['user_id'])
                ->exists();

            if ($exists) {
                return $this->error('This user is already a staff member.', 422);
            }

            $data['store_id'] = $store->id;
            $staff = StoreStaff::create($data);
            $staff->load('user');

            return $this->success($staff, 201, 'Staff member added successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $staff = StoreStaff::where('id', $id)->where('store_id', $store->id)->first();

            if (!$staff) {
                return $this->notFound('Staff member not found.');
            }

            $data = $request->validate([
                'store_role' => 'sometimes|string|max:50',
                'display_on_profile' => 'boolean',
            ]);

            $staff->update($data);
            $staff->load('user');

            return $this->success($staff, 200, 'Staff member updated successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $staff = StoreStaff::where('id', $id)->where('store_id', $store->id)->first();

            if (!$staff) {
                return $this->notFound('Staff member not found.');
            }

            $staff->delete();

            return $this->success(null, 200, 'Staff member removed successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
