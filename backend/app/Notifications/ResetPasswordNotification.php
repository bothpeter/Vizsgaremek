<?php 

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification  
{
    use Queueable;

    protected string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('🔑 Jelszó Visszaállítás')
            ->greeting('Hello! 👋')
            ->line('Azért kaptad ezt az e-mailt, mert kérted a jelszavad visszaállítását.')
            ->line('Itt van az ehhez szüksége kód: ' . $this->token .' 🔒')
            ->line('⏳ Ez a kód 60 percig érvényes.')
            ->line('Ha nem te kérted a jelszó visszaállítását, akkor hagyd figyelmen kívül ezt a levelet.')
            ->salutation('Üdvözlettel, **A FitnessMe csapata**');
    }
    


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'token' => $this->token,
        ];
    }
}
