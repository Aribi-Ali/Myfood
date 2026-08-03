<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChefApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Félicitations, votre profil Chef est approuvé !')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Nous avons le plaisir de vous informer que votre candidature en tant que Chef a été acceptée.')
            ->line('Vous pouvez dès à présent accéder à votre espace Chef, gérer vos compétences et postuler aux offres des restaurants.')
            ->action('Accéder à mon espace Chef', url('/profile'))
            ->line('Bienvenue dans notre communauté culinaire !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'chef_approved',
            'message' => 'Félicitations ! Votre profil Chef a été approuvé par l\'administration.',
        ];
    }
}
