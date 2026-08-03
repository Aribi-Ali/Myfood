<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AlgeriaGeographySeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('communes')->truncate();
        DB::table('dairas')->truncate();
        DB::table('wilayas')->truncate();
        Schema::enableForeignKeyConstraints();

        $now = now()->toDateTimeString();

        // ── 1. Insert Wilayas ──────────────────────────────────────────────────
        $wilayas = [
            ['01', 'Adrar'],
            ['02', 'Chlef'],
            ['03', 'Laghouat'],
            ['04', 'Oum El Bouaghi'],
            ['05', 'Batna'],
            ['06', 'Béjaïa'],
            ['07', 'Biskra'],
            ['08', 'Béchar'],
            ['09', 'Blida'],
            ['10', 'Bouira'],
            ['11', 'Tamanrasset'],
            ['12', 'Tébessa'],
            ['13', 'Tlemcen'],
            ['14', 'Tiaret'],
            ['15', 'Tizi Ouzou'],
            ['16', 'Alger'],
            ['17', 'Djelfa'],
            ['18', 'Jijel'],
            ['19', 'Sétif'],
            ['20', 'Saïda'],
            ['21', 'Skikda'],
            ['22', 'Sidi Bel Abbès'],
            ['23', 'Annaba'],
            ['24', 'Guelma'],
            ['25', 'Constantine'],
            ['26', 'Médéa'],
            ['27', 'Mostaganem'],
            ['28', "M'Sila"],
            ['29', 'Mascara'],
            ['30', 'Ouargla'],
            ['31', 'Oran'],
            ['32', 'El Bayadh'],
            ['33', 'Illizi'],
            ['34', 'Bordj Bou Arréridj'],
            ['35', 'Boumerdès'],
            ['36', 'El Tarf'],
            ['37', 'Tindouf'],
            ['38', 'Tissemsilt'],
            ['39', 'El Oued'],
            ['40', 'Khenchela'],
            ['41', 'Souk Ahras'],
            ['42', 'Tipaza'],
            ['43', 'Mila'],
            ['44', 'Aïn Defla'],
            ['45', 'Naâma'],
            ['46', 'Aïn Témouchent'],
            ['47', 'Ghardaïa'],
            ['48', 'Relizane'],
            ['49', 'Timimoun'],
            ['50', 'Bordj Badji Mokhtar'],
            ['51', 'Ouled Djellal'],
            ['52', 'Béni Abbès'],
            ['53', 'In Salah'],
            ['54', 'In Guezzam'],
            ['55', 'Touggourt'],
            ['56', 'Djanet'],
            ['57', "El M'Ghair"],
            ['58', 'El Meniaa'],
        ];

        $wilayaRows = [];
        foreach ($wilayas as [$code, $name]) {
            $wilayaRows[] = ['code' => $code, 'name_fr' => $name, 'name_ar' => null, 'created_at' => $now, 'updated_at' => $now];
        }
        DB::table('wilayas')->insert($wilayaRows);

        // Build a quick lookup: name → id
        $wilayaIds = DB::table('wilayas')->pluck('id', 'name_fr')->toArray();

        // ── 2. Insert Dairas & Communes per Wilaya ─────────────────────────────
        // Format: 'Wilaya Name' => [ 'Daira Name' => ['Commune1', 'Commune2', ...], ... ]
        $geography = [
            'Alger' => [
                'Alger-Centre' => ['Alger-Centre', 'Sidi M\'Hamed', 'El Madania', 'Belouizdad', 'Bab El Oued', 'Bologhine Ibn Ziri', 'Casbah', 'Oued Koriche'],
                'Bir Mourad Raïs' => ['Bir Mourad Raïs', 'Birkhadem', 'El Biar', 'Bouzaréah', 'Bains Romains'],
                'Hussein Dey' => ['Hussein Dey', 'El Harrach', 'Kouba', 'Bachdjerrah', 'Dar El Beïda'],
                'Birtouta' => ['Birtouta', 'Tessala El Merdja', 'Sidi Moussa'],
                'Chéraga' => ['Chéraga', 'Staoueli', 'Zeralda', 'Rahmania', 'Mahelma'],
                'Draria' => ['Draria', 'Souidania', 'Ouled Fayet', 'El Achour'],
                'Rouïba' => ['Rouïba', 'Réghaia', 'Heuraoua', 'Hammamet', 'Khrouba', 'Ain Taya'],
                'Bab Ezzouar' => ['Bab Ezzouar', 'Ben Aknoun', 'Dely Brahim', 'Hydra', 'El Biar', 'El Mouradia', 'Mohammadia', 'Bordj El Kiffan', 'El Magharia'],
            ],
            'Oran' => [
                'Oran' => ['Oran', 'Bir El Djir', 'Es Senia', 'Arzew', 'Bethioua'],
                'Gdyel' => ['Gdyel', 'Ain Biya', 'Boutlelis', 'Sidi Chami'],
                'Ain El Turk' => ['Ain El Turk', 'El Ancor', 'Mers El Hadjadj', 'Cap Falcon'],
                'Bousfer' => ['Bousfer', 'El Braya'],
                'Oued Tlélat' => ['Oued Tlélat', 'Ben Freha', 'Messerghin', 'Tafraoui'],
            ],
            'Constantine' => [
                'Constantine' => ['Constantine', 'Hamma Bouziane', 'Ibn Badis', 'Zighoud Youcef'],
                'El Khroub' => ['El Khroub', 'Ain Smara', 'Ain Abid', 'Beni Hamidane'],
                'Aïn Abid' => ['Aïn Abid', 'Ouled Rahmoune'],
                'Didouche Mourad' => ['Didouche Mourad', 'Beni Merouan'],
            ],
            'Batna' => [
                'Batna' => ['Batna', 'Fesdis', 'Oued El Ma'],
                'Barika' => ['Barika', 'Djerma', 'Seriana'],
                'Arris' => ['Arris', 'Menaa', 'T\'Kout'],
                'Aïn Touta' => ['Aïn Touta', 'Oued Chaaba', 'Bouzina'],
            ],
            'Sétif' => [
                'Sétif' => ['Sétif', 'Ain El Kebira', 'Bougaa', 'Bir Arram'],
                'El Eulma' => ['El Eulma', 'Salah Bey', 'Guidjel'],
                'Aïn Oulmane' => ['Aïn Oulmane', 'Ain Arnat', 'Hammam Guergour'],
                'Amoucha' => ['Amoucha', 'El Ouricia'],
            ],
            'Annaba' => [
                'Annaba' => ['Annaba', 'El Bouni', 'El Hadjar', 'Berrahal'],
                'El Eulma' => ['Chetaïbi', 'Seraïdi'],
                'Aïn Berda' => ['Aïn Berda', 'Chorfa'],
            ],
            'Blida' => [
                'Blida' => ['Blida', 'Chréa', 'Bouarfa', 'Beni Mered'],
                'Boufarik' => ['Boufarik', 'Bougara', 'Larbaa', 'Meftah'],
                'Mouzaïa' => ['Mouzaïa', 'Oued El Alleug'],
                'Bougara' => ['Bougara', 'Birtouta'],
            ],
            'Tizi Ouzou' => [
                'Tizi Ouzou' => ['Tizi Ouzou', 'Ait Chafaa', 'Tizi Gheniff', 'Oued Falli'],
                'Tigzirt' => ['Tigzirt', 'Iflissen', 'Azeffoun'],
                'Draa El Mizan' => ['Draa El Mizan', 'Ait Yahia Moussa', 'Ain Zaouia'],
                'Boghni' => ['Boghni', 'Ait Boumahdi', 'Tizi N\'Tlata'],
            ],
            'Béjaïa' => [
                'Béjaïa' => ['Béjaïa', 'Oued Ghir', 'Tichy', 'Aokas'],
                'Amizour' => ['Amizour', 'Ighram', 'El Kseur'],
                'Kherrata' => ['Kherrata', 'Tamridjet'],
                'Sidi Aich' => ['Sidi Aich', 'Ighil Ali', 'Chellata'],
            ],
            'Médéa' => [
                'Médéa' => ['Médéa', 'Ouzera', 'Ouamri', 'Si Mahdjoub'],
                'Berrouaghia' => ['Berrouaghia', 'Ouled Bouachra', 'Sidi Ziane'],
                'Ksar El Boukhari' => ['Ksar El Boukhari', 'Ain Boucif'],
            ],
            'Mostaganem' => [
                'Mostaganem' => ['Mostaganem', 'Mesra', 'Sidi Ali'],
                'Ain Tedeles' => ['Ain Tedeles', 'Hadjadj'],
                'Sidi Ali' => ['Sidi Ali', 'Ain Nouissy'],
            ],
            'Tlemcen' => [
                'Tlemcen' => ['Tlemcen', 'Mansourah', 'Chetouane'],
                'Ghazaouet' => ['Ghazaouet', 'Nedroma', 'Honaine'],
                'Maghnia' => ['Maghnia', 'Hammam Boughrara', 'Souahlia'],
                'Remchi' => ['Remchi', 'Bab El Assa'],
            ],
            'Skikda' => [
                'Skikda' => ['Skikda', 'El Hadaïek', 'Hamadi Krouma'],
                'Collo' => ['Collo', 'Zitouna', 'El Milia'],
                'Azzaba' => ['Azzaba', 'Oued Zehour'],
            ],
            'Guelma' => [
                'Guelma' => ['Guelma', 'Nechmaya', 'Héliopolis'],
                'Bouchegouf' => ['Bouchegouf', 'Ras El Agba'],
                'Oued Zenati' => ['Oued Zenati', 'El Fedjoudj'],
            ],
            'Biskra' => [
                'Biskra' => ['Biskra', 'Ouled Djellal', 'El Ghrous'],
                'Tolga' => ['Tolga', 'Bordj Ben Azzouz', 'Bouchagroune'],
                'Sidi Okba' => ['Sidi Okba', 'El Haouch', 'Chetma'],
            ],
            'Jijel' => [
                'Jijel' => ['Jijel', 'Taher', 'El Aouana'],
                'El Milia' => ['El Milia', 'Chekfa', 'Ziama Mansouriah'],
            ],
            'Boumerdès' => [
                'Boumerdès' => ['Boumerdès', 'Corso', 'Boudouaou', 'Khemis El Khechna'],
                'Dellys' => ['Dellys', 'Afir', 'Isser'],
                'Bordj Menaïel' => ['Bordj Menaïel', 'Si Mustapha', 'Naciria'],
            ],
            'Tipaza' => [
                'Tipaza' => ['Tipaza', 'Koléa', 'Hadjout'],
                'Cherchell' => ['Cherchell', 'Sidi Ghiles', 'Aïn Tagourait'],
                'Bou Ismaïl' => ['Bou Ismaïl', 'Fouka', 'Mahelma'],
            ],
            'Aïn Defla' => [
                'Aïn Defla' => ['Aïn Defla', 'Djelida'],
                'Miliana' => ['Miliana', 'Bourached'],
                'El Attaf' => ['El Attaf', 'Ain Soltane', 'Hammam Righa'],
            ],
            'Relizane' => [
                'Relizane' => ['Relizane', 'Zemmoura', 'Oued Essalem'],
                'Mazouna' => ['Mazouna', 'Sidi M\'Hamed Ben Ali'],
            ],
            'Mascara' => [
                'Mascara' => ['Mascara', 'Matemore', 'Maoussa'],
                'Sig' => ['Sig', 'Ain Fares'],
            ],
            'Sidi Bel Abbès' => [
                'Sidi Bel Abbès' => ['Sidi Bel Abbès', 'Tessala', 'Ain El Berd'],
                'Telagh' => ['Telagh', 'Ras El Ma'],
            ],
            'Ouargla' => [
                'Ouargla' => ['Ouargla', 'Sidi Khouiled', 'Ain Beida'],
                'Hassi Messaoud' => ['Hassi Messaoud'],
                'Touggourt' => ['Touggourt', 'Megarine', 'Tebesbest'],
            ],
            'Ghardaïa' => [
                'Ghardaïa' => ['Ghardaïa', 'El Guerrara', 'Berriane'],
                'Metlili' => ['Metlili', 'El Atteuf'],
            ],
            'El Oued' => [
                'El Oued' => ['El Oued', 'Robbah', 'Guemar'],
                'Debila' => ['Debila', 'Kouinine'],
            ],
            'Laghouat' => [
                'Laghouat' => ['Laghouat', 'Ksar El Hirane', 'Sidi Makhlouf'],
                'Aflou' => ['Aflou', 'El Ghicha'],
            ],
            'Djelfa' => [
                'Djelfa' => ['Djelfa', 'Ain Oussera', 'Messaad'],
                'Birine' => ['Birine', 'Sed Rahal'],
            ],
            'Tiaret' => [
                'Tiaret' => ['Tiaret', 'Sougueur', 'Oued Lilli'],
                'Frenda' => ['Frenda', 'Ain Kermes'],
            ],
            'Chlef' => [
                'Chlef' => ['Chlef', 'Ain Merane', 'Ouled Fares'],
                'Ténès' => ['Ténès', 'Beni Haoua'],
            ],
            'Bouira' => [
                'Bouira' => ['Bouira', 'Ain Bessem', 'El Hachimia'],
                'Lakhdaria' => ['Lakhdaria', 'Kadiria', 'Sour El Ghozlane'],
            ],
            'Mila' => [
                'Mila' => ['Mila', 'Ferdjioua', 'Tassadane Haddada'],
                'Chelghoum Laïd' => ['Chelghoum Laïd', 'Ain Tine'],
            ],
            'Bordj Bou Arréridj' => [
                'Bordj Bou Arréridj' => ['Bordj Bou Arréridj', 'Ain Taghrout', 'Ras El Oued'],
                'El Achir' => ['El Achir', 'Djaafra'],
            ],
            'Oum El Bouaghi' => [
                'Oum El Bouaghi' => ['Oum El Bouaghi', 'Ain Beida', 'Ain M\'Lila'],
                'Aïn Fakroun' => ['Aïn Fakroun', 'Souk Naamane'],
            ],
            'Tébessa' => [
                'Tébessa' => ['Tébessa', 'El Kouif', 'Bir El Ater'],
                'Cheria' => ['Cheria', 'El Ogla'],
            ],
            'Souk Ahras' => [
                'Souk Ahras' => ['Souk Ahras', 'Sedrata', 'Merahna'],
                'Taoura' => ['Taoura', 'Hanancha'],
            ],
            'Khenchela' => [
                'Khenchela' => ['Khenchela', 'Ain Touila', 'Baghai'],
                'Chechar' => ['Chechar', 'Kais'],
            ],
            'Saïda' => [
                'Saïda' => ['Saïda', 'Ain Skhouna', 'Ain El Hadjar'],
                'El Hassasna' => ['El Hassasna', 'Youb'],
            ],
            'Aïn Témouchent' => [
                'Aïn Témouchent' => ['Aïn Témouchent', 'Beni Saf', 'Ain El Arba'],
                'El Malah' => ['El Malah', 'Chaabat El Lehem'],
            ],
            'Naâma' => [
                'Naâma' => ['Naâma', 'Ain Sefra', 'Mecheria'],
                'El Biodh' => ['El Biodh', 'Tiout'],
            ],
            'El Bayadh' => [
                'El Bayadh' => ['El Bayadh', 'Rogassa', 'Brezina'],
                'Boualem' => ['Boualem', 'Stitten'],
            ],
            'Béchar' => [
                'Béchar' => ['Béchar', 'Kenadsa', 'Meridja'],
                'Abadla' => ['Abadla', 'Tamtert'],
            ],
            'Adrar' => [
                'Adrar' => ['Adrar', 'Tamantit', 'Fenoughil'],
                'Reggane' => ['Reggane', 'Aougrout'],
            ],
            'Tamanrasset' => [
                'Tamanrasset' => ['Tamanrasset', 'Abalessa', 'In Mguel'],
                'In Guezzam' => ['In Guezzam'],
            ],
            'Tissemsilt' => [
                'Tissemsilt' => ['Tissemsilt', 'Bordj Emir Abdelkader', 'Theniet El Had'],
                'Lazharia' => ['Lazharia', 'Ouled Beslem'],
            ],
            'Illizi' => [
                'Illizi' => ['Illizi', 'Debdeb'],
                'Djanet' => ['Djanet', 'In Amenas'],
            ],
            'El Tarf' => [
                'El Tarf' => ['El Tarf', 'El Kala', 'Besbes'],
                'Ben M\'Hidi' => ['Ben M\'Hidi', 'Bougous'],
            ],
            'Tindouf' => [
                'Tindouf' => ['Tindouf'],
            ],
            'Bordj Badji Mokhtar' => [
                'Bordj Badji Mokhtar' => ['Bordj Badji Mokhtar', 'Timiaouine'],
            ],
            'Ouled Djellal' => [
                'Ouled Djellal' => ['Ouled Djellal', 'Doucen'],
            ],
            'Béni Abbès' => [
                'Béni Abbès' => ['Béni Abbès', 'Kerzaz'],
            ],
            'In Salah' => [
                'In Salah' => ['In Salah', 'Foggaret Ezzoua'],
            ],
            'In Guezzam' => [
                'In Guezzam' => ['In Guezzam', 'Tin Zaouatine'],
            ],
            'Touggourt' => [
                'Touggourt' => ['Touggourt', 'Nezla', 'Tebesbest'],
            ],
            'Djanet' => [
                'Djanet' => ['Djanet', 'Bordj El Haoues'],
            ],
            "El M'Ghair" => [
                "El M'Ghair" => ["El M'Ghair", 'Djamaa'],
            ],
            'El Meniaa' => [
                'El Meniaa' => ['El Meniaa', 'Hassi Gara'],
            ],
            'Timimoun' => [
                'Timimoun' => ['Timimoun', 'Aougrout', 'Charouine'],
            ],
            "M'Sila" => [
                "M'Sila" => ["M'Sila", 'Bou Saada', 'Sidi Aissa'],
                'Hammam Dalaa' => ['Hammam Dalaa', 'Ain El Hadjel'],
            ],
        ];

        // ── 3. Insert Dairas + Communes ────────────────────────────────────────
        foreach ($geography as $wilayaName => $dairas) {
            $wilayaId = $wilayaIds[$wilayaName] ?? null;
            if (!$wilayaId) continue;

            foreach ($dairas as $dairaName => $communes) {
                $dairaId = DB::table('dairas')->insertGetId([
                    'wilaya_id'  => $wilayaId,
                    'name_fr'    => $dairaName,
                    'name_ar'    => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $communeRows = [];
                foreach ($communes as $communeName) {
                    $communeRows[] = [
                        'daira_id'   => $dairaId,
                        'wilaya_id'  => $wilayaId,
                        'name_fr'    => $communeName,
                        'name_ar'    => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                if ($communeRows) {
                    DB::table('communes')->insert($communeRows);
                }
            }
        }

        $this->command->info('Algeria geography seeded: ' .
            DB::table('wilayas')->count() . ' wilayas, ' .
            DB::table('dairas')->count() . ' dairas, ' .
            DB::table('communes')->count() . ' communes.'
        );
    }
}
