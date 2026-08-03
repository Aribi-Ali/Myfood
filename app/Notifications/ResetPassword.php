<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPassword extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly string $token)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.frontend_url') . '/reset-password?token=' . $this->token;

        $appName = config('app.name');

        $lines = match ($notifiable->locale ?? 'fr') {
            'ar' => [
                'subject' => "إعادة تعيين كلمة المرور - $appName",
                'greeting' => 'مرحباً ' . $notifiable->name . '،',
                'line1' => 'لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في ' . $appName . '.',
                'line2' => 'انقر على الزر أدناه لإعادة تعيين كلمة المرور:',
                'action' => 'إعادة تعيين كلمة المرور',
                'line3' => 'إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.',
                'line4' => 'رابط إعادة التعيين سينتهي صلاحيته بعد 60 دقيقة.',
            ],
            'fr' => [
                'subject' => "Réinitialisation de mot de passe - $appName",
                'greeting' => 'Bonjour ' . $notifiable->name . ',',
                'line1' => 'Vous avez reçu cet email suite à une demande de réinitialisation de mot de passe pour votre compte ' . $appName . '.',
                'line2' => 'Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :',
                'action' => 'Réinitialiser mon mot de passe',
                'line3' => 'Si vous n\'avez pas demandé de réinitialisation, ignorez cet email.',
                'line4' => 'Ce lien expirera dans 60 minutes.',
            ],
            default => [
                'subject' => "Reset Password - $appName",
                'greeting' => 'Hello ' . $notifiable->name . ',',
                'line1' => 'You are receiving this email because we received a password reset request for your ' . $appName . ' account.',
                'line2' => 'Click the button below to reset your password:',
                'action' => 'Reset Password',
                'line3' => 'If you did not request a password reset, no further action is required.',
                'line4' => 'This password reset link will expire in 60 minutes.',
            ],
        };

        return (new MailMessage)
            ->subject($lines['subject'])
            ->greeting($lines['greeting'])
            ->line($lines['line1'])
            ->line($lines['line2'])
            ->action($lines['action'], $url)
            ->line($lines['line3'])
            ->line($lines['line4']);
    }
}
