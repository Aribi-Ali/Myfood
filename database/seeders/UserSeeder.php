<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            // Admin
            ['name' => 'Admin YallahKool',       'email' => 'admin@yallahkool.dz',     'role' => Role::Admin,    'phone' => '0551000000'],

            // Owners
            ['name' => 'Mario Rossi',             'email' => 'mario@pizza.dz',          'role' => Role::Owner,    'phone' => '0551000001'],
            ['name' => 'Sarah Burger',            'email' => 'sarah@burger.dz',         'role' => Role::Owner,    'phone' => '0551000002'],
            ['name' => 'Takeshi Tanaka',          'email' => 'tanaka@sushi.dz',         'role' => Role::Owner,    'phone' => '0551000003'],
            ['name' => 'Pierre LeGourmet',        'email' => 'pierre@cafe.dz',          'role' => Role::Owner,    'phone' => '0551000004'],
            ['name' => 'Carlos Fernandez',        'email' => 'carlos@tacos.dz',         'role' => Role::Owner,    'phone' => '0551000005'],
            ['name' => 'Jean-Claude Dupont',      'email' => 'jc@creuset.dz',           'role' => Role::Owner,    'phone' => '0551000006'],
            ['name' => 'Li Wei',                  'email' => 'liwei@wok.dz',            'role' => Role::Owner,    'phone' => '0551000007'],
            ['name' => 'Karim Hadj',              'email' => 'karim@grill.dz',          'role' => Role::Owner,    'phone' => '0551000008'],
            ['name' => 'Sophie Lambert',          'email' => 'sophie@icecream.dz',      'role' => Role::Owner,    'phone' => '0551000009'],
            ['name' => 'Samir Chahine',           'email' => 'samir@libanais.dz',       'role' => Role::Owner,    'phone' => '0551000010'],

            // Clients
            ['name' => 'Ali Client',              'email' => 'ali@client.dz',           'role' => Role::Client,   'phone' => '0661000001'],
            ['name' => 'Yasmine Amrani',          'email' => 'yasmine@client.dz',       'role' => Role::Client,   'phone' => '0661000002'],
            ['name' => 'Rachid Benali',           'email' => 'rachid@client.dz',        'role' => Role::Client,   'phone' => '0661000003'],

            // Delivery
            ['name' => 'Ahmed Delivery',          'email' => 'ahmed@delivery.dz',       'role' => Role::Delivery, 'phone' => '0771000001'],
            ['name' => 'Yacine Rider',            'email' => 'yacine@delivery.dz',      'role' => Role::Delivery, 'phone' => '0771000002'],

            // Chefs
            ['name' => 'Chef Hakim Benali',       'email' => 'hakim@chef.dz',           'role' => Role::Chef,     'phone' => '0662000001'],
            ['name' => 'Chef Fatima Zohra',       'email' => 'fatima@chef.dz',          'role' => Role::Chef,     'phone' => '0662000002'],
        ];

        foreach ($users as $u) {
            User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name'              => $u['name'],
                    'password'          => bcrypt('password'),
                    'role'              => $u['role'],
                    'phone'             => $u['phone'],
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Users seeded: ' . count($users));
    }
}
