<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Confirmation de votre commande #' . $this->order->id)
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Votre commande auprès de ' . $this->order->store->name . ' a été confirmée !')
            ->line('Montant total: ' . number_format($this->order->total_amount, 2) . ' DA')
            ->action('Voir ma commande', url('/profile/orders'))
            ->line('Merci pour votre confiance !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'     => 'order_confirmed',
            'order_id' => $this->order->id,
            'store'    => $this->order->store->name,
            'message'  => 'Votre commande #' . $this->order->id . ' a été confirmée.',
        ];
    }
}
