<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChefRejected extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly ?string $reason = null)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('Mise à jour concernant votre candidature Chef')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Après examen de votre dossier, nous sommes au regret de vous informer que votre candidature pour devenir Chef n\'a pas été retenue pour le moment.');

        if ($this->reason) {
            $mail->line('Motif : ' . $this->reason);
        }

        $mail->line('Vous pourrez soumettre une nouvelle candidature ultérieurement avec des documents mis à jour.')
            ->action('Voir mon profil', url('/profile'));

        return $mail;
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'chef_rejected',
            'message' => 'Votre demande pour devenir Chef n\'a pas pu être validée.',
            'reason'  => $this->reason,
        ];
    }
}
