<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Order;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'order_id' => 'nullable|exists:orders,id',
            'food_id' => 'nullable|exists:foods,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Ensure the user has at least one delivered order from this store
        $hasOrdered = Order::where('client_id', auth()->id())
            ->where('store_id', $data['store_id'])
            ->where('status', OrderStatus::Delivered->value)
            ->exists();

        if (!$hasOrdered) {
            return response()->json(['message' => 'You can only file a complaint against a store you have ordered from.'], 403);
        }

        if ($request->filled('order_id')) {
            $order = Order::findOrFail($request->order_id);
            if ($order->client_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Vous ne pouvez pas soumettre une réclamation pour une commande qui ne vous appartient pas.',
                ], 403);
            }
        }

        $complaint = Complaint::create([
            'client_id' => auth()->id(),
            'store_id' => $data['store_id'],
            'order_id' => $data['order_id'] ?? null,
            'food_id' => $data['food_id'] ?? null,
            'subject' => $data['subject'],
            'description' => $data['description'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Votre réclamation a été soumise avec succès.',
            'complaint' => $complaint,
        ], 201);
    }
}
