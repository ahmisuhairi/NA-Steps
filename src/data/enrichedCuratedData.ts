import type { DictionaryEntry } from '../types/dictionary';

export interface CuratedEnrichmentPatch {
  definitionEn?: string;
  definitionMs?: string;
  usageNoteEn?: string;
  aliases?: string[];
  extraExcerpts?: DictionaryEntry['excerpts'];
}

/**
 * Deeper, fuller Bahasa Malaysia & English explanations and impactful verbatim PDF
 * quotes merged onto existing core curated entries in CURATED_LEXICON.
 */
export const DEEPENED_CURATED_PATCHES: Record<string, CuratedEnrichmentPatch> = {
  acceptance: {
    definitionEn:
      'An honest, heartfelt acknowledgment of reality, powerlessness, and our disease of addiction that reaches far deeper than merely admitting a problem out loud. Acceptance ends the exhausting inner war against truth and opens the door to real hope, willingness, self-acceptance, and unity with others.',
    definitionMs:
      'Pengakuan dan penerimaan yang jujur serta mendalam terhadap hakikat diri, ketidakupayaan mengawal ketagihan, dan realiti kehidupan hari ini—jauh melangkaui sekadar pengakuan di bibir. Penerimaan menghentikan perjuangan sia-sia menentang kebenaran, lalu membuka ruang kepada harapan baharu, penerimaan diri, dan pemulihan sebenar.',
    usageNoteEn:
      'In Step One, acceptance transforms hopeless defeat into the beginning of recovery; in the Traditions, unconditional acceptance builds a safe fellowship for every newcomer.',
    aliases: ['accept', 'accepting', 'self-acceptance'],
  },
  addiction: {
    definitionEn:
      'A progressive, incurable, and potentially fatal disease that affects the whole person—mentally through obsession, physically through compulsion, and spiritually through deep emptiness and self-centeredness. While addiction cannot be cured once and for all, it can be arrested one day at a time through total abstinence and living the Twelve Steps.',
    definitionMs:
      'Penyakit kronik yang bersifat progresif (semakin melarat jika dibiarkan), tidak dapat disembuhkan sepenuhnya, dan boleh membawa maut—tetapi perkembangannya dapat dihentikan melalui pemulihan harian. Ia menyerang secara mental (obsesi), fizikal (dorongan kompulsif), dan rohani (kekosongan jiwa serta sikap mementingkan diri), merangkumi keseluruhan cara hidup dan bukan sekadar jenis dadah.',
    usageNoteEn:
      'It Works emphasizes that recovery focuses on the disease of addiction itself rather than any specific substance, freeing any addict to find common ground.',
    aliases: ['disease of addiction', 'active addiction'],
  },
  amends: {
    definitionEn:
      'Active restitution and consistent behavioral change offered to repair harm we caused in active addiction or recovery. Making amends is a two-stage commitment: acknowledging responsibility directly (unless doing so would injure anyone) and proving sincerity by living differently from that day forward.',
    definitionMs:
      'Tindakan nyata untuk membaiki kerosakan moral, emosi, atau material terhadap orang yang pernah kita sakiti, jauh lebih mendalam daripada sekadar mengucap "maaf". Ia menuntut proses dua peringkat: mengakui kesalahan serta membetulkan keadaan apabila selamat dilakukan, dan mengekalkan perubahan tingkah laku yang jujur secara berterusan.',
    aliases: ['making amends', 'make amends', 'made direct amends'],
  },
  'come-to-believe': {
    definitionEn:
      'The gradual, honest awakening of hope in Step Two—moving from total isolation and reliance on failed willpower toward trusting that a Power greater than ourselves can restore sanity and guide our lives.',
    definitionMs:
      'Proses beransur-ansur untuk mula percaya dan membina harapan dalam Langkah Dua—beralih daripada bergantung sepenuhnya kepada kekuatan diri yang telah gagal kepada keyakinan bahawa ada Kuasa yang lebih besar mampu memulihkan kewarasan serta kehidupan kita.',
    aliases: ['came to believe'],
  },
  compulsion: {
    definitionEn:
      'The irresistible physical and behavioral urge to keep using drugs—or acting out repetitively—even after realizing the severe destruction it causes and genuinely wanting to stop.',
    definitionMs:
      'Dorongan fizikal dan tingkah laku yang sukar dibendung untuk terus mengambil dadah atau mengulangi tabiat merosakkan, walaupun seseorang itu sedar kesan buruknya dan benar-benar mahu berhenti.',
    aliases: ['compulsive', 'compulsively'],
  },
  courage: {
    definitionEn:
      'The inner spiritual strength to tell the truth, face painful inventories, ask for help, and walk forward into recovery even while feeling afraid or uncertain.',
    definitionMs:
      'Keberanian rohani dan ketabahan jiwa untuk berhadapan dengan kebenaran diri, mengakui kesalahan, meminta bantuan daripada sponsor atau Kuasa Tertinggi, serta melangkah ke hadapan dalam pemulihan walaupun rasa takut masih wujud.',
  },
  denial: {
    definitionEn:
      'The deep psychological and spiritual defense system of addiction—built on lies, rationalizations, minimization, and blame—that blinds us to how destructive and unmanageable our lives have truly become.',
    definitionMs:
      'Mekanisme pertahanan diri dalam ketagihan yang penuh dengan penafian, alasan, dan penipuan terhadap diri sendiri—menyebabkan seseorang enggan melihat kehancuran serta ketidakupayaan mengawal hidupnya walaupun bukti kerosakan sudah nyata di depan mata.',
    aliases: ['darkness of denial', 'denied'],
  },
  'defects-of-character': {
    definitionEn:
      'Ingrained survival patterns such as dishonesty, fear, selfishness, resentment, and pride that once masked our pain but now block spiritual growth and hurt both ourselves and others.',
    definitionMs:
      'Sifat dan tabiat kelemahan watak yang berakar umbi—seperti ketidakjujuran, ketakutan, mementingkan diri, dendam, dan keangkuhan—yang dahulu digunakan sebagai benteng perlindungan diri tetapi kini menghalang pertumbuhan rohani serta menyakiti diri dan orang lain.',
    aliases: ['character defects', 'defects'],
  },
  desire: {
    definitionEn:
      'Even the smallest honest spark of wanting freedom from active addiction—the sole requirement for Narcotics Anonymous membership under Tradition Three, regardless of past history or drug choice.',
    definitionMs:
      'Keinginan yang jujur, walaupun sekecil zarah, untuk berhenti menggunakan dadah dan bebas daripada ketagihan aktif—satu-satunya syarat keahlian dalam Narcotics Anonymous di bawah Tradisi Tiga tanpa mengira latar belakang atau jenis bahan.',
    aliases: ['desire to stop using'],
  },
  'exact-nature-of-our-wrongs': {
    definitionEn:
      'The underlying motives, fears, beliefs, and character defects beneath our surface actions—uncovered honestly in Step Four and shared aloud in Step Five so shame loses its power.',
    definitionMs:
      'Akar umbi sebenar di sebalik perbuatan salah kita—meliputi niat tersembunyi, ketakutan, dan kecacatan watak—yang dikenal pasti dalam Langkah Empat dan diakui secara jujur dalam Langkah Lima supaya rasa malu dan rahsia gelap tidak lagi menguasai hidup.',
    aliases: ['exact nature'],
  },
  fellowship: {
    definitionEn:
      'The living community of recovering addicts who gather, share strength, support newcomers, and carry hope so no addict ever has to walk through early recovery alone.',
    definitionMs:
      'Komuniti persaudaraan ahli-ahli yang sedang pulih daripada ketagihan, yang saling berkongsi pengalaman, kekuatan, dan kasih sayang tanpa menghakimi supaya tiada seorang pun penagih perlu berjuang bersendirian untuk kekal bersih.',
  },
  gratitude: {
    definitionEn:
      'Deep, active appreciation for the gift of staying clean and living a new way of life—expressed daily through humility, service, kindness, and helping another addict.',
    definitionMs:
      'Rasa syukur yang mendalam dan aktif atas nikmat bebas daripada ketagihan serta peluang memulakan hidup baharu—dizahirkan melalui kerendahan hati, khidmat kepada sesama ahli, dan kesediaan membantu penagih lain yang masih menderita.',
  },
  'higher-power': {
    definitionEn:
      'Any loving, trustworthy Power greater than our own willpower—whether understood spiritually, religiously, or as the collective healing strength of the fellowship and recovery principles—that can restore sanity and care for our lives when self-will fails.',
    definitionMs:
      'Mana-mana Kuasa yang lebih besar, pengasih, dan boleh dipercayai melampaui kekuatan diri sendiri—sama ada difahami mengikut kepercayaan agama, kesedaran rohani peribadi, mahupun kekuatan kolektif komuniti pemulihan—yang mampu memulihkan kewarasan dan membimbing kehidupan apabila kehendak diri sendiri menemui jalan buntu.',
    usageNoteEn:
      'Appears across all Twelve Steps and Twelve Traditions; It Works invites each reader to develop a personal, practical relationship with a Power greater than themselves.',
    aliases: ['Power greater than ourselves', 'God of our understanding', 'God as we understood Him'],
  },
  honesty: {
    definitionEn:
      'The foundational spiritual principle of facing the truth about our addiction, feelings, motives, and daily actions—ending decades of hiding behind lies and self-deception.',
    definitionMs:
      'Prinsip rohani paling asas untuk berani berhadapan dengan kebenaran tentang ketagihan, perasaan, niat, dan perbuatan harian—menghentikan penipuan diri serta kepalsuan yang selama ini menjerumuskan kita ke dalam kancah dadah.',
  },
  hope: {
    definitionEn:
      'The quiet but transformative conviction born from surrender and seeing others recover: that we are no longer doomed to keep using, and that a clean, meaningful life is genuinely possible for us.',
    definitionMs:
      'Keyakinan baharu yang lahir daripada penyerahan diri dan melihat bukti pemulihan pada rakan lain—bahawa kita tidak lagi terperangkap untuk terus menagih, dan kehidupan yang bersih, tenang, serta bermakna benar-benar boleh dicapai.',
  },
  humility: {
    definitionEn:
      'Clear, balanced self-awareness—neither arrogance nor self-hatred—where we accept our human limitations, recognize we are neither better nor worse than anyone else, and willingly ask for help.',
    definitionMs:
      'Kesedaran diri yang seimbang dan jujur—bukan menghina diri dan bukan pula bermegah—di mana kita mengakui keterbatasan sebagai manusia biasa, sedar bahawa kita sama taraf dengan orang lain, dan bersedia meminta pertolongan dengan hati terbuka.',
  },
  insanity: {
    definitionEn:
      'Repeating the same destructive drug-using or self-defeating patterns over and over while expecting different results—plus believing lies such as "just one more time will be safe."',
    definitionMs:
      'Mengulangi tindakan dan pemikiran merosakkan yang sama berkali-kali sambil mengharapkan hasil yang berbeza, termasuk mempercayai pembohongan ketagihan bahawa kita masih boleh mengawal penggunaan dadah buat kali terakhir.',
  },
  'keep-coming-back': {
    definitionEn:
      'The warm invitation echoed in meetings everywhere, reminding newcomers—especially when overwhelmed, discouraged, or tempted—that staying connected to meetings and members keeps recovery alive.',
    definitionMs:
      'Seruan mesra dan penuh sokongan yang sentiasa diucapkan dalam perjumpaan—mengingatkan ahli baharu terutamanya ketika terasa lemah, putus asa, atau teruji agar terus hadir dan tidak menjauhkan diri daripada komuniti pemulihan.',
  },
  'life-on-lifes-terms': {
    definitionEn:
      'Facing both joyful and painful realities of daily life cleanly and constructively, without turning back to drugs or trying to force every circumstance to bend to our will.',
    definitionMs:
      'Menghadapi segala suka duka dan realiti kehidupan harian dalam keadaan bersih tanpa kembali kepada dadah, sambil belajar menerima keadaan seadanya tanpa memaksa dunia mengikut kehendak sendiri.',
    aliases: ['living on life’s terms', "living on life's terms", "life on life's terms"],
  },
  obsession: {
    definitionEn:
      'The relentless, overpowering mental preoccupation with getting, using, and finding ways to obtain more drugs—or fixing internal discomfort from outside ourselves—even when we desperately want to stop.',
    definitionMs:
      'Fikiran yang sentiasa terpaku, berulang-ulang, dan sukar dikawal tentang bagaimana hendak mendapatkan dan menggunakan dadah atau melarikan diri daripada rasa tidak selesa—sehingga melumpuhkan akal sihat walaupun hati ingin berhenti.',
    aliases: ['obsessive', 'mental obsession'],
  },
  'open-mindedness': {
    definitionEn:
      'Willingness to set aside rigid prejudice and listen to new ideas, sponsor guidance, and spiritual principles that have helped other recovering addicts stay clean.',
    definitionMs:
      'Kesediaan minda dan hati untuk mengetepikan sikap berprasangka atau rasa serba tahu, lalu sudi mendengar panduan baharu, nasihat sponsor, dan prinsip rohani yang telah terbukti menyelamatkan rakan-rakan lain.',
    aliases: ['open-minded'],
  },
  powerlessness: {
    definitionEn:
      'The liberating realization in Step One that our own willpower, promises, and clever control schemes cannot stop the disease of addiction once it has taken hold—and that real strength begins only when we stop fighting alone.',
    definitionMs:
      'Kesedaran yang membebaskan dalam Langkah Satu bahawa segala daya usaha sendiri, janji kosong, dan helah kawalan peribadi tidak lagi mampu menghentikan penyakit ketagihan—dan kekuatan sebenar hanya bermula apabila kita berhenti melawan bersendirian.',
    aliases: ['powerless', 'powerless over our addiction'],
  },
  relapse: {
    definitionEn:
      'Returning to active drug use—often preceded emotionally and mentally by complacency, kept reservations, unaddressed resentments, or isolating away from meetings and honesty.',
    definitionMs:
      'Kembali semula kepada penggunaan dadah aktif—yang biasanya bermula secara senyap melalui rasa terlalu selesa, menyimpan syarat dalam pemulihan ("reservations"), memendam dendam, atau menjauhkan diri daripada perjumpaan dan kejujuran.',
  },
  reservations: {
    definitionEn:
      'Unspoken mental escape clauses—such as "if my life falls apart, I might use again"—that secretly leave the door open for relapse until surrendered honestly.',
    definitionMs:
      'Syarat tersembunyi atau ruang kecemasan dalam fikiran—seperti "jika sesuatu musibah menimpa, mungkin saya akan guna semula"—yang secara diam-diam menyediakan tempat untuk kambuh (relapse) sekiranya tidak diserahkan dengan jujur.',
  },
  sanity: {
    definitionEn:
      'Soundness of mind and clarity of heart restored in recovery—the ability to see truth plainly, pause before reacting destructively, and choose actions aligned with staying clean and healthy.',
    definitionMs:
      'Kewarasan akal dan ketenangan hati yang dipulihkan dalam proses pemulihan—keupayaan melihat realiti dengan jelas, berfikir sebelum bertindak melulu, dan membuat pilihan yang menjaga kebersihan diri serta maruah hidup.',
    aliases: ['restored to sanity', 'restore us to sanity'],
  },
  'self-centeredness': {
    definitionEn:
      'A core spiritual symptom of addiction and self-will in which our own fears, desires, ego, and need for control sit at the center of every situation, blinding us to others’ needs and isolating us from recovery.',
    definitionMs:
      'Gejala teras ketagihan dan kehendak diri yang melampau apabila ketakutan, kemahuan, ego, dan keperluan untuk mengawal segala sesuatu dijadikan pusat kehidupan—menyebabkan seseorang sukar berempati, mudah tersinggung, dan terputus daripada hubungan sihat.',
    usageNoteEn:
      'Highlighted explicitly in Step Three as one of the four characteristics of self-will alongside closed-mindedness, unwillingness, and outright defiance.',
    aliases: ['self-centeredness', 'self-centered', 'self-obsession'],
  },
  'self-will': {
    definitionEn:
      'Stubborn insistence on running our lives and controlling everyone around us purely on our own terms—composed of closed-mindedness, unwillingness, self-centeredness, and outright defiance—which traps us in fear, exhaustion, and pain.',
    definitionMs:
      'Sikap berkeras mengemudi hidup serta cuba mengawal setiap orang dan keadaan mengikut kehendak nafsu sendiri semata-mata—yang terbentuk daripada sifat tertutup fikiran, keengganan, mementingkan diri, dan penentangan terang-terangan—sehingga menjerat kita dalam kitaran ketakutan dan kesengsaraan.',
    usageNoteEn:
      'Step Three contrasts destructive self-will against trusting the care of a Higher Power; turning our will over brings deep relief from the burden of trying to control everything.',
    extraExcerpts: [
      {
        bookPage: '19',
        pdfPage: 25,
        section: 'Step Three',
        quote:
          'Self-will is composed of such characteristics as closed-mindedness, unwillingness, self-centeredness, and outright defiance. Our self-centered obsession and its accompanying insanity have made our lives unmanageable.',
      },
    ],
  },
  'spiritual-awakening': {
    definitionEn:
      'The profound, progressive inner transformation described in Step Twelve that comes from living the steps—renewing the spark of life inside us, changing how we view ourselves and others, and inspiring us to carry hope cleanly.',
    definitionMs:
      'Transformasi batin yang mendalam dan berterusan hasil mengamalkan kesemua Dua Belas Langkah—menghidupkan semula cahaya kehidupan yang hampir padam akibat ketagihan, mengubah cara kita melihat diri serta dunia, dan mendorong kita menyampaikan harapan pemulihan kepada orang lain.',
    extraExcerpts: [
      {
        bookPage: '88',
        pdfPage: 94,
        section: 'Step Twelve',
        quote:
          'The quintessential spirit that lies inside each one of us, the spark of life that was almost extinguished by our disease, has been renewed through working the Twelve Steps of Narcotics Anonymous.',
      },
    ],
  },
  'spiritual-void': {
    definitionEn:
      'The deep, aching hollowness and loneliness felt especially starkly when we first get clean—an inner emptiness no drug or external distraction can fill, healed only by connection, love, and spiritual growth.',
    definitionMs:
      'Rasa kekosongan jiwa yang sangat perit dan kesunyian mendalam yang kerap dirasai sebaik sahaja seseorang mula berhenti menggunakan dadah—lompang batin yang tidak pernah dapat diisi oleh dadah atau benda luaran, dan hanya dapat disembuhkan melalui hubungan bermakna, kasih sayang komuniti, serta pertumbuhan rohani.',
    extraExcerpts: [
      {
        bookPage: '5',
        pdfPage: 11,
        section: 'Step One',
        quote:
          'The spiritual part of our disease, the part we may recognize only by a feeling of emptiness or loneliness when we first get clean, is perhaps one of the most difficult aspects of addiction for us.',
      },
    ],
  },
  sponsorship: {
    definitionEn:
      'The trusted, caring mentorship between recovering addicts where a sponsor shares personal experience working the Twelve Steps, listens honestly, and helps guide a newcomer through tough moments without control or judgment.',
    definitionMs:
      'Hubungan bimbingan saling percaya antara ahli yang lebih berpengalaman dalam pemulihan (sponsor) dengan ahli baharu—di mana sponsor berkongsi pengalaman jujur menjalani Dua Belas Langkah, mendengar tanpa menghukum, dan membantu menemani ketika detik sukar.',
    aliases: ['sponsor', 'sponsee'],
  },
  surrender: {
    definitionEn:
      'Laying down our exhausting fight to control addiction by ourselves and embracing help with an open heart. Far from humiliating defeat, surrender in recovery is where genuine relief, peace, and victory begin.',
    definitionMs:
      'Melepaskan pertarungan sia-sia untuk mengawal ketagihan dengan tenaga sendiri dan membuka hati menerima bantuan program pemulihan. Jauh daripada kekalahan yang memalukan, penyerahan diri inilah titik permulaan kelegaan, ketenangan, dan kemenangan hidup yang sebenar.',
    extraExcerpts: [
      {
        bookPage: '10',
        pdfPage: 16,
        section: 'Step One',
        quote:
          'We surrender again, knowing that victory lies in the admission of defeat. The feeling of love and acceptance we find in the Fellowship of Narcotics Anonymous allows us to begin recovering from our addiction.',
      },
    ],
  },
  unmanageability: {
    definitionEn:
      'The breakdown of emotional balance, relationships, finances, honesty, and daily functioning—showing us that addiction has stripped away our ability to steer our lives safely on our own.',
    definitionMs:
      'Keadaan hidup yang kucar-kacir dan di luar kawalan—meliputi kemelut emosi, keruntuhan hubungan, kehilangan maruah diri, atau masalah tanggungjawab harian—yang membuktikan bahawa ketagihan telah merampas keupayaan kita mengurus kehidupan dengan selamat.',
    aliases: ['unmanageable', 'lives had become unmanageable'],
  },
  willingness: {
    definitionEn:
      'Readiness to try another way and take positive recovery action even when fear, doubt, or discomfort still linger—the essential attitude that turns hope into real change.',
    definitionMs:
      'Kesediaan hati untuk mencuba jalan pemulihan yang baharu dan mengambil tindakan positif walaupun masih terasa takut, ragu, atau tidak selesa—sikap kunci yang menukar harapan menjadi perubahan nyata.',
  },
};

/**
 * Additional high-priority phrases, proper nouns, ordinal Step & Tradition names,
 * Step 3 self-will traits, and moving getting-clean recovery concepts directly from
 * It Works: How and Why.
 */
export const ADDITIONAL_PHRASES_LEXICON: DictionaryEntry[] = [
  {
    id: 'it-works-title',
    term: 'It Works (It Works: How and Why)',
    malayTerm: 'Ia Berfungsi (Bagaimana dan Mengapa Ia Berfungsi)',
    partOfSpeech: 'Prinsip',
    category: 'Frasa Teras',
    definitionEn:
      'Both the central promise of Narcotics Anonymous—that the Twelve Steps genuinely work when practiced honestly—and the title of this companion book exploring how and why the Steps and Traditions bring lasting freedom.',
    definitionMs:
      'Merujuk kepada kenyataan asas program Narcotics Anonymous bahawa program pemulihan ini benar-benar berkesan apabila diamalkan dengan jujur, serta menjadi tajuk buku panduan ini ("It Works: How and Why") yang menghuraikan cara dan hikmah di sebalik Dua Belas Langkah dan Dua Belas Tradisi.',
    usageNoteEn:
      'Introduced in the opening pages as the core truth emerging from collective addict experience: "IT WORKS."',
    aliases: ['It Works', 'It Works: How and Why', 'It Works: How & Why'],
    bookPages: ['i', 'ii', '89'],
    pdfPages: [6, 7, 95],
    section: 'Introduction',
    excerpts: [
      {
        bookPage: 'i',
        pdfPage: 6,
        section: 'Introduction',
        quote:
          'After all was said and done, one fundamental truth emerged as the crux of our program: IT WORKS. The reasons our program works, the how and why of recovery, are found in many places: in each other, in our relationship with a Higher Power, in our hearts and minds, and finally, in the collective wisdom of our members.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'twelve-steps-phrase',
    term: 'Twelve Steps',
    malayTerm: 'Dua Belas Langkah Pemulihan',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'The twelve sequential spiritual principles and practical actions of Narcotics Anonymous—beginning with honest admission of powerlessness and leading through hope, surrender, moral inventory, amends, daily reflection, and service to a spiritual awakening.',
    definitionMs:
      'Dua belas langkah panduan rohani dan tindakan praktikal dalam pemulihan peribadi—bermula daripada pengakuan jujur atas ketidakupayaan mengawal ketagihan, diikuti pembinaan harapan, penyerahan diri, inventori moral, pembaikan kesalahan, hubungan sedar dengan Tuhan, hingga kebangkitan rohani dan khidmat membantu orang lain.',
    usageNoteEn:
      'Book One dedicates a full chapter to each of the Twelve Steps, showing how practicing them daily arrests addiction and renews life.',
    aliases: ['Twelve Steps of Narcotics Anonymous', 'Twelve Steps of NA'],
    bookPages: ['i', '1', '7', '10', '88'],
    pdfPages: [6, 8, 13, 16, 94],
    section: 'Book One: The Twelve Steps',
    excerpts: [
      {
        bookPage: '10',
        pdfPage: 16,
        section: 'Step One',
        quote:
          'The Twelve Steps of Narcotics Anonymous will take us on a journey that will far exceed our expectations. Working and living the steps will lead us to a spiritual awakening.',
      },
      {
        bookPage: '88',
        pdfPage: 94,
        section: 'Step Twelve',
        quote:
          'The quintessential spirit that lies inside each one of us, the spark of life that was almost extinguished by our disease, has been renewed through working the Twelve Steps of Narcotics Anonymous.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'twelve-traditions-phrase',
    term: 'Twelve Traditions',
    malayTerm: 'Dua Belas Tradisi Persaudaraan',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'The twelve guiding principles that protect unity, autonomy, self-support, non-endorsement, anonymity, and primary purpose across Narcotics Anonymous groups so recovery remains freely available to every addict who wants it.',
    definitionMs:
      'Dua belas prinsip panduan yang memelihara perpaduan kumpulan, kebebasan operasi, kebergantungan diri tanpa sumbangan luar, prinsip kerahsiaan, serta fokus kepada tujuan utama agar ruang pemulihan sentiasa selamat dan terbuka kepada mana-mana penagih yang ingin pulih.',
    usageNoteEn:
      'Book Two explores the spirit—not rigid law—of the Twelve Traditions as collective principles grounded in humility and anonymity.',
    aliases: ['Twelve Traditions of Narcotics Anonymous'],
    bookPages: ['i', '89', '91', '153', '158'],
    pdfPages: [6, 95, 96, 158, 163],
    section: 'Book Two: The Twelve Traditions',
    excerpts: [
      {
        bookPage: '89',
        pdfPage: 95,
        section: 'Book Two: The Twelve Traditions',
        quote:
          'The traditions portion of It Works: How and Why serves as a resource for NA groups and the individual member. The book seeks to explore the spiritual principles within the traditions, engage members with the spirit—not the law—of the traditions, and provide a basis for thought and discussion.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'narcotics-anonymous-proper',
    term: 'Narcotics Anonymous',
    malayTerm: 'Persaudaraan Narcotics Anonymous (NA)',
    partOfSpeech: 'Kata Nama',
    category: 'Frasa Teras',
    definitionEn:
      'A global, nonprofit fellowship of recovering addicts who meet regularly to help each other stay clean from all drugs through mutual support, honesty, and the Twelve Steps and Twelve Traditions.',
    definitionMs:
      'Sebuah persaudaraan antarabangsa yang tidak berorientasikan keuntungan bagi individu yang sedang pulih daripada penyakit ketagihan, yang bertemu secara berkala untuk saling menyokong kekal bersih daripada semua jenis dadah melalui kejujuran dan pengamalan Dua Belas Langkah serta Dua Belas Tradisi.',
    usageNoteEn:
      'Named throughout the book as a welcoming community built on the therapeutic value of one addict helping another.',
    aliases: ['NA Fellowship', 'Fellowship of Narcotics Anonymous'],
    bookPages: ['i', '10', '106', '153'],
    pdfPages: [6, 16, 111, 158],
    section: 'Introduction & Tradition Three',
    excerpts: [
      {
        bookPage: '106',
        pdfPage: 111,
        section: 'Tradition Three',
        quote:
          'Narcotics Anonymous offers recovery to addicts around the world. We focus on the disease of addiction rather than any particular drug. Our message is broad enough to attract addicts from any social class or nationality.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'self-will-characteristics-clause',
    term: 'Composed of such characteristics as (Self-Will)',
    malayTerm: 'Terdiri Daripada Sifat-Sifat Seperti (Kehendak Diri)',
    partOfSpeech: 'Frasa',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Three’s defining description explaining how destructive self-will operates inside an addict’s life—manifesting as four interlocking barriers: closed-mindedness, unwillingness, self-centeredness, and outright defiance.',
    definitionMs:
      'Huraian penting dalam Langkah Tiga yang menjelaskan bentuk-bentuk nyata kehendak diri (self-will) yang merosakkan—iaitu apabila ego menguasai hati melalui empat sikap utama: fikiran tertutup (closed-mindedness), keengganan (unwillingness), mementingkan diri (self-centeredness), dan penentangan terang-terangan (outright defiance).',
    usageNoteEn:
      'Appears on page 19 (PDF p. 25) in Step Three immediately before contrasting self-will with trusting a Higher Power.',
    aliases: [
      'is composed of such characteristics as',
      'composed of such characteristics as',
    ],
    bookPages: ['19'],
    pdfPages: [25],
    section: 'Step Three',
    excerpts: [
      {
        bookPage: '19',
        pdfPage: 25,
        section: 'Step Three',
        quote:
          'Self-will is composed of such characteristics as closed-mindedness, unwillingness, self-centeredness, and outright defiance. Our self-centered obsession and its accompanying insanity have made our lives unmanageable.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'closed-mindedness-trait',
    term: 'Closed-mindedness',
    malayTerm: 'Sikap Tertutup Fikiran / Enggan Mendengar',
    partOfSpeech: 'Kata Nama',
    category: 'Langkah 1–12',
    definitionEn:
      'Refusing to consider help, new perspectives, or recovery principles because of pride, fear, or the false belief that we already know best—one of the four core characteristics of self-will described in Step Three.',
    definitionMs:
      'Keadaan minda dan hati yang tertutup serta menolak pandangan baharu, teguran membina, atau prinsip pemulihan kerana keangkuhan, ketakutan, atau sangkaan bahawa diri sendiri sentiasa betul—salah satu daripada empat ciri utama kehendak diri dalam Langkah Tiga.',
    usageNoteEn:
      'Directly named in Step Three (Book p. 19, PDF p. 25); overcome gradually through Step Two open-mindedness and listening to a sponsor.',
    aliases: ['closed-minded'],
    bookPages: ['19'],
    pdfPages: [25],
    section: 'Step Three',
    excerpts: [
      {
        bookPage: '19',
        pdfPage: 25,
        section: 'Step Three',
        quote:
          'Self-will is composed of such characteristics as closed-mindedness, unwillingness, self-centeredness, and outright defiance.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'unwillingness-trait',
    term: 'Unwillingness',
    malayTerm: 'Keengganan / Tidak Sanggup Berubah',
    partOfSpeech: 'Kata Nama',
    category: 'Langkah 1–12',
    definitionEn:
      'Internal resistance against taking the simple, honest actions recovery requires—holding back effort, avoiding change, or refusing surrender even while suffering from the consequences of addiction.',
    definitionMs:
      'Penolakan dalaman atau sikap berat hati untuk mengambil tindakan jujur yang dituntut oleh pemulihan—menahan diri daripada berubah atau enggan melepaskan ego walaupun sudah letih menanggung derita akibat ketagihan.',
    usageNoteEn:
      'Listed in Step Three (Book p. 19, PDF p. 25) as one of the four traits of self-will that prolong fear and pain.',
    aliases: ['unwilling'],
    bookPages: ['19'],
    pdfPages: [25],
    section: 'Step Three',
    excerpts: [
      {
        bookPage: '19',
        pdfPage: 25,
        section: 'Step Three',
        quote:
          'Self-will is composed of such characteristics as closed-mindedness, unwillingness, self-centeredness, and outright defiance. Acting on our self-will has kept us trapped in a continuous cycle of fear and pain.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'outright-defiance-trait',
    term: 'Outright defiance',
    malayTerm: 'Penentangan Terang-terangan / Sikap Membangkang',
    partOfSpeech: 'Frasa',
    category: 'Langkah 1–12',
    definitionEn:
      'Open, rebellious refusal to accept guidance, boundaries, reality, or spiritual help—insisting fiercely on "doing it my own way" even when doing so destroys peace and sobriety.',
    definitionMs:
      'Sikap memberontak dan membangkang secara terang-terangan terhadap bimbingan, batas kehidupan, realiti, atau pertolongan rohani—berdegil mahu mengikut cara sendiri walaupun jelas membawa kehancuran dan penderitaan.',
    usageNoteEn:
      'Highlighted in Step Three (Book p. 19, PDF p. 25) as the sharpest expression of self-will before practicing surrender.',
    aliases: ['defiance'],
    bookPages: ['19'],
    pdfPages: [25],
    section: 'Step Three',
    excerpts: [
      {
        bookPage: '19',
        pdfPage: 25,
        section: 'Step Three',
        quote:
          'Self-will is composed of such characteristics as closed-mindedness, unwillingness, self-centeredness, and outright defiance.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'getting-clean-phrase',
    term: 'Getting clean / Staying clean',
    malayTerm: 'Mula Berhenti & Kekal Bersih daripada Dadah',
    partOfSpeech: 'Frasa',
    category: 'Frasa Teras',
    definitionEn:
      'The brave turning point of stopping all drug use completely and continuing to live drug-free one day at a time—not only abstaining physically, but healing the emptiness, fear, and habits left behind when the drugs are gone.',
    definitionMs:
      'Detik perubahan berani untuk berhenti menggunakan segala jenis dadah sepenuhnya dan terus kekal bersih hari demi hari—bukan sekadar menahan diri secara fizikal, malah merawat rasa sunyi, kekosongan jiwa, ketakutan, dan tabiat lama selepas dadah ditinggalkan.',
    usageNoteEn:
      'It Works speaks honestly about the loneliness felt when first getting clean, reassuring newcomers that love, meetings, and the Steps fill that void.',
    aliases: [
      'get clean',
      'getting clean',
      'stay clean',
      'staying clean',
      'when we first get clean',
      'stop using drugs',
    ],
    bookPages: ['5', '6', '7', '10'],
    pdfPages: [11, 12, 13, 16],
    section: 'Step One',
    excerpts: [
      {
        bookPage: '5',
        pdfPage: 11,
        section: 'Step One',
        quote:
          'The spiritual part of our disease, the part we may recognize only by a feeling of emptiness or loneliness when we first get clean, is perhaps one of the most difficult aspects of addiction for us.',
      },
      {
        bookPage: '7',
        pdfPage: 13,
        section: 'Step One',
        quote:
          'While abstinence is the beginning, our only hope for recovery is a profound emotional and spiritual change.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'freedom-from-active-addiction',
    term: 'Freedom from active addiction',
    malayTerm: 'Kebebasan daripada Ketagihan Aktif',
    partOfSpeech: 'Frasa',
    category: 'Frasa Teras',
    definitionEn:
      'The core promise and primary message of Narcotics Anonymous: living free from the slavery of obsessive craving and compulsive drug use through practicing spiritual principles and fellowship support.',
    definitionMs:
      'Janji utama dan mesej teras pemulihan: hidup bebas daripada perhambaan nafsu dadah dan dorongan kompulsif melalui amalan prinsip rohani serta sokongan erat persaudaraan.',
    usageNoteEn:
      'Central to both Tradition Three and Tradition Five as the gift offered unconditionally to any addict seeking help.',
    aliases: ['freedom from addiction'],
    bookPages: ['106', '121'],
    pdfPages: [111, 126],
    section: 'Tradition Three & Tradition Five',
    excerpts: [
      {
        bookPage: '111',
        pdfPage: 116,
        section: 'Tradition Four',
        quote:
          'Our lives in active addiction often seemed more like slavery. When we first experience freedom from active addiction, it can feel exhilarating.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'therapeutic-value-phrase',
    term: 'Therapeutic value of one addict helping another',
    malayTerm: 'Nilai Terapeutik Seorang Penagih Membantu Penagih Lain',
    partOfSpeech: 'Frasa',
    category: 'Frasa Teras',
    definitionEn:
      'The unique healing power created when two people who share the same struggle listen, understand without judgment, and support each other in staying clean—something professional credentials alone cannot replicate.',
    definitionMs:
      'Kuasa penyembuhan unik yang terhasil apabila dua orang yang berkongsi pengalaman derita ketagihan saling mendengar tanpa menghakimi dan membantu satu sama lain untuk kekal bersih—suatu ikatan empati sejati yang memulihkan kedua-dua pihak.',
    usageNoteEn:
      'Highlighted in the Introduction (Book p. ii, PDF p. 7) and reinforced throughout Tradition Eight.',
    aliases: ['one addict helping another', 'therapeutic value'],
    bookPages: ['ii', '136'],
    pdfPages: [7, 141],
    section: 'Introduction & Tradition Eight',
    excerpts: [
      {
        bookPage: 'ii',
        pdfPage: 7,
        section: 'Introduction',
        quote:
          'We pray that this book truly represents the therapeutic value of one addict helping another. After all, it is through sharing with each other that we find our own answers, our own Higher Power, and our own path of recovery.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'first-step-milestone',
    term: 'First Step (Step One)',
    malayTerm: 'Langkah Pertama (Ketidakupayaan & Penyerahan)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step One: "We admitted that we were powerless over our addiction, that our lives had become unmanageable." It marks the honest end of denial and the start of real hope—recognizing that stopping drugs requires surrender, humility, and help rather than sheer willpower.',
    definitionMs:
      'Langkah Pertama: "Kami mengakui bahawa kami tidak berdaya ke atas ketagihan kami, dan hidup kami menjadi tidak terkawal." Ia menjadi titik tolak kejujuran yang memecahkan penafian—menyedari bahawa pemulihan bermula apabila kita berhenti bertarung sendirian, melepaskan ilusi kawalan, dan mula membina harapan.',
    usageNoteEn:
      'Covers obsession, compulsion, denial, spiritual void, honesty, total abstinence, and surrender across Book pp. 3–11 (PDF pp. 9–17).',
    aliases: ['First Step', 'Step One'],
    bookPages: ['3–11'],
    pdfPages: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    section: 'Step One',
    excerpts: [
      {
        bookPage: '4',
        pdfPage: 10,
        section: 'Step One',
        quote:
          'Through working the First Step we will address the obsession, the compulsion, the denial, and what many have termed a “spiritual void.” As we examine and acknowledge all these aspects of our disease, we start to understand our powerlessness.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'second-step-milestone',
    term: 'Second Step (Step Two)',
    malayTerm: 'Langkah Kedua (Harapan & Pemulihan Kewarasan)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Two: "We came to believe that a Power greater than ourselves could restore us to sanity." It nurtures open-mindedness and hope—showing newcomers who feel broken or hopeless that sanity and peace are possible through a Higher Power and the fellowship.',
    definitionMs:
      'Langkah Kedua: "Kami mula percaya bahawa satu Kuasa yang lebih besar daripada diri kami sendiri dapat memulihkan kewarasan kami." Langkah ini menanamkan harapan dan keterbukaan fikiran—bahawa walaupun jiwa terasa hancur ketika mula berhenti, kewarasan dan ketenangan tetap boleh dicapai dengan pertolongan Kuasa yang lebih besar.',
    usageNoteEn:
      'Explores hope, sanity vs. insanity, acting as if, and building trust across Book pp. 12–18 (PDF pp. 18–24).',
    aliases: ['Second Step', 'Step Two'],
    bookPages: ['12–18'],
    pdfPages: [18, 19, 20, 21, 22, 23, 24],
    section: 'Step Two',
    excerpts: [
      {
        bookPage: '12',
        pdfPage: 18,
        section: 'Step Two',
        quote:
          'Our surrender in the First Step leaves us with a deep need to believe that we can recover. This surrender makes it possible for us to feel hope.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'third-step-milestone',
    term: 'Third Step (Step Three)',
    malayTerm: 'Langkah Ketiga (Keputusan Penyerahan Kehendak)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Three: "We made a decision to turn our will and our lives over to the care of God as we understood Him." It puts Step Two belief into action—relinquishing destructive self-will and control in favor of trust, willingness, and spiritual care.',
    definitionMs:
      'Langkah Ketiga: "Kami membuat keputusan untuk menyerahkan kehendak dan kehidupan kami ke dalam pemeliharaan Tuhan mengikut pemahaman kami." Ia menterjemahkan kepercayaan kepada tindakan nyata—melepaskan beban mengawal segala sesuatu dan menyerahkan arah hidup kepada penjagaan Tuhan yang pengasih.',
    usageNoteEn:
      'Addresses self-will, trust, willingness, and practicing surrender daily across Book pp. 19–25 (PDF pp. 25–31).',
    aliases: ['Third Step', 'Step Three'],
    bookPages: ['19–25'],
    pdfPages: [25, 26, 27, 28, 29, 30, 31],
    section: 'Step Three',
    excerpts: [
      {
        bookPage: '20',
        pdfPage: 26,
        section: 'Step Three',
        quote:
          'The Third Step is our commitment to our own emotional, physical, and spiritual well-being. What began in the Second Step as belief in a Higher Power can become a fuller relationship with a God of our understanding in Step Three.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'fourth-step-milestone',
    term: 'Fourth Step (Step Four)',
    malayTerm: 'Langkah Keempat (Inventori Moral yang Berani)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Four: "We made a searching and fearless moral inventory of ourselves." An honest written self-examination of resentments, fears, guilt, behaviors, and positive character assets that frees us from living in fantasy and self-deception.',
    definitionMs:
      'Langkah Keempat: "Kami membuat inventori moral diri kami secara mendalam dan tanpa rasa takut." Proses menulis penilaian diri yang jujur merangkumi dendam, ketakutan, rasa bersalah, pola tingkah laku, serta kekuatan watak—membebaskan kita daripada penipuan diri.',
    aliases: ['Fourth Step', 'Step Four', 'searching and fearless moral inventory'],
    bookPages: ['26–34'],
    pdfPages: [32, 33, 34, 35, 36, 37, 38, 39, 40],
    section: 'Step Four',
    excerpts: [
      {
        bookPage: '27',
        pdfPage: 33,
        section: 'Step Four',
        quote:
          'Although we did discover some valuable truths in the First Step, the Fourth Step further separates fantasy from reality. We can begin to stop being the person we have invented and find out who we really are.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'fifth-step-milestone',
    term: 'Fifth Step (Step Five)',
    malayTerm: 'Langkah Kelima (Pengakuan Sifat Sebenar Kesalahan)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Five: "We admitted to God, to ourselves, and to another human being the exact nature of our wrongs." Sharing our written inventory openly dissolves the isolation of guilt and secrecy, building real trust and inner relief.',
    definitionMs:
      'Langkah Kelima: "Kami mengakui kepada Tuhan, kepada diri sendiri, dan kepada seorang manusia lain sifat sebenar kesalahan kami." Meluahkan inventori secara terbuka memecahkan tembok kesunyian dan rasa malu, lalu melahirkan kelegaan serta kejujuran baharu.',
    aliases: ['Fifth Step', 'Step Five'],
    bookPages: ['35–41'],
    pdfPages: [41, 42, 43, 44, 45, 46, 47],
    section: 'Step Five',
    excerpts: [
      {
        bookPage: '35',
        pdfPage: 41,
        section: 'Step Five',
        quote:
          'The sooner we work our Fifth Step, the stronger the foundation of our recovery will be. We’ve built this foundation on spiritual principles such as surrender, honesty, trust, faith, willingness, and courage.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'sixth-step-milestone',
    term: 'Sixth Step (Step Six)',
    malayTerm: 'Langkah Keenam (Kesediaan Sepenuhnya untuk Berubah)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Six: "We were entirely ready to have God remove all these defects of character." Becoming honestly willing to let go of old survival habits—even comfortable defects—so genuine character growth can take place.',
    definitionMs:
      'Langkah Keenam: "Kami bersedia sepenuhnya agar Tuhan menghapuskan segala kecacatan watak ini." Membina kesediaan tulus untuk melepaskan tabiat lama dan mekanisme pertahanan yang tidak lagi sihat agar perubahan akhlak yang mendalam dapat berlaku.',
    aliases: ['Sixth Step', 'Step Six'],
    bookPages: ['42–48'],
    pdfPages: [48, 49, 50, 51, 52, 53, 54],
    section: 'Step Six',
    excerpts: [
      {
        bookPage: '46',
        pdfPage: 52,
        section: 'Step Six',
        quote:
          'We are completely aware that there’s no turning back, because we can never forget the miracle that’s begun to happen to us. Our bruised and battered spirits have started to heal in the course of working the steps.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'seventh-step-milestone',
    term: 'Seventh Step (Step Seven)',
    malayTerm: 'Langkah Ketujuh (Kerendahan Hati Memohon Pembaikan)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Seven: "We humbly asked Him to remove our shortcomings." Practicing humility, patience, and deeper surrender—asking our Higher Power for help rather than trying to fix every flaw by willpower alone.',
    definitionMs:
      'Langkah Ketujuh: "Dengan rendah hati kami memohon agar Dia menghapuskan segala kelemahan kami." Mengamalkan kerendahan hati, kesabaran, dan kebergantungan kepada Tuhan untuk memperbaiki kekurangan diri yang tidak mampu kita ubah dengan kekuatan sendiri.',
    aliases: ['Seventh Step', 'Step Seven'],
    bookPages: ['49–53'],
    pdfPages: [55, 56, 57, 58, 59],
    section: 'Step Seven',
    excerpts: [
      {
        bookPage: '50',
        pdfPage: 56,
        section: 'Step Seven',
        quote:
          'Accepting our addiction was the first move in the direction of accepting ourselves. ... We know that we are neither more nor less important than anyone else.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'eighth-step-milestone',
    term: 'Eighth Step (Step Eight)',
    malayTerm: 'Langkah Kelapan (Senarai & Kesediaan Berdamai)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Eight: "We made a list of all persons we had harmed, and became willing to make amends to them all." Preparing our hearts through forgiveness—including forgiving ourselves—so we are ready to make peace with others.',
    definitionMs:
      'Langkah Kelapan: "Kami menyenaraikan semua individu yang pernah kami sakiti, dan menjadi bersedia untuk membaiki kesalahan terhadap mereka semua." Membersihkan hati melalui kemaafan—termasuk memaafkan diri sendiri—sebagai persediaan berdamai.',
    aliases: ['Eighth Step', 'Step Eight'],
    bookPages: ['54–59'],
    pdfPages: [60, 61, 62, 63, 64, 65],
    section: 'Step Eight',
    excerpts: [
      {
        bookPage: '54',
        pdfPage: 60,
        section: 'Step Eight',
        quote:
          'In the Eighth Step, we begin the process of making peace with others. ... In truth, we are becoming willing to do anything possible to repair the damage we’ve done, particularly by changing our behavior.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'ninth-step-milestone',
    term: 'Ninth Step (Step Nine)',
    malayTerm: 'Langkah Kesembilan (Pelaksanaan Ganti Rugi & Perubahan)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Nine: "We made direct amends to such people wherever possible, except when to do so would injure them or others." Taking wise, courageous action to repair past harm while backing up our words with lasting behavioral change.',
    definitionMs:
      'Langkah Kesembilan: "Kami membuat pembaikan secara langsung kepada mereka di mana sahaja yang mungkin, kecuali jika berbuat demikian akan mencederakan mereka atau pihak lain." Mengambil tindakan bertanggungjawab membaiki kerosakan silam disertai perubahan sikap yang nyata.',
    aliases: ['Ninth Step', 'Step Nine'],
    bookPages: ['60–68'],
    pdfPages: [66, 67, 68, 69, 70, 71, 72, 73, 74],
    section: 'Step Nine',
    excerpts: [
      {
        bookPage: '62',
        pdfPage: 68,
        section: 'Step Nine',
        quote:
          'In our experience, making amends is a two-stage process. Not only do we make amends to the person we’ve harmed, we follow up on those amends with a serious change in our behavior. We mend our fences and we mend our ways.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'tenth-step-milestone',
    term: 'Tenth Step (Step Ten)',
    malayTerm: 'Langkah Kesepuluh (Inventori Harian & Kejujuran Segera)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Ten: "We continued to take personal inventory and when we were wrong promptly admitted it." A daily spiritual check-in that catches resentments, pride, and mistakes early before they grow into bitterness or relapse.',
    definitionMs:
      'Langkah Kesepuluh: "Kami terus membuat inventori peribadi dan apabila kami bersalah, kami segera mengakuinya." Amalan muhasabah harian untuk mengesan kesilapan, ego, atau rasa sakit hati lebih awal supaya tidak membarah dan mengancam pemulihan.',
    aliases: ['Tenth Step', 'Step Ten'],
    bookPages: ['69–75'],
    pdfPages: [75, 76, 77, 78, 79, 80, 81],
    section: 'Step Ten',
    excerpts: [
      {
        bookPage: '68',
        pdfPage: 74,
        section: 'Step Nine & Step Ten',
        quote:
          'We may stumble from time to time, but the Tenth Step gives us the opportunity to pick ourselves up and keep walking forward. Our Higher Power has given us an invitation to live, and we accept it with gratitude.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'eleventh-step-milestone',
    term: 'Eleventh Step (Step Eleven)',
    malayTerm: 'Langkah Kesebelas (Doa, Meditasi & Hubungan Sedar)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Eleven: "We sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out." Deepening quiet daily alignment and spiritual strength.',
    definitionMs:
      'Langkah Kesebelas: "Kami berusaha melalui doa dan meditasi untuk mempertingkatkan hubungan sedar kami dengan Tuhan mengikut pemahaman kami, hanya berdoa memohon pengetahuan tentang kehendak-Nya bagi kami serta kekuatan untuk melaksanakannya." Membina ketenangan batin dan panduan rohani setiap hari.',
    aliases: ['Eleventh Step', 'Step Eleven'],
    bookPages: ['76–81'],
    pdfPages: [82, 83, 84, 85, 86, 87],
    section: 'Step Eleven',
    excerpts: [
      {
        bookPage: '76',
        pdfPage: 82,
        section: 'Step Eleven',
        quote:
          'Throughout our recovery, one of the things which stands out as a result of our working the steps is our success in building a relationship with a Higher Power.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'twelfth-step-milestone',
    term: 'Twelfth Step (Step Twelve)',
    malayTerm: 'Langkah Kedua Belas (Kebangkitan Rohani & Menyampaikan Mesej)',
    partOfSpeech: 'Prinsip',
    category: 'Langkah 1–12',
    definitionEn:
      'Step Twelve: "Having had a spiritual awakening as a result of these steps, we tried to carry this message to addicts and to practice these principles in all our affairs." Living recovery openly and sharing freely with others who still suffer.',
    definitionMs:
      'Langkah Kedua Belas: "Setelah mengalami kebangkitan rohani hasil daripada langkah-langkah ini, kami berusaha menyampaikan mesej ini kepada para penagih lain dan mengamalkan prinsip-prinsip ini dalam segala urusan hidup kami." Menyebarkan harapan bahawa sesiapa pun boleh pulih.',
    aliases: ['Twelfth Step', 'Step Twelve'],
    bookPages: ['82–88'],
    pdfPages: [88, 89, 90, 91, 92, 93, 94],
    section: 'Step Twelve',
    excerpts: [
      {
        bookPage: '86',
        pdfPage: 92,
        section: 'Step Twelve',
        quote:
          'The message we carry is that, by practicing the principles contained within the Twelve Steps, we have had a spiritual awakening. ... It is the hope that an addict, any addict, can recover from the disease of addiction.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'first-tradition-milestone',
    term: 'First Tradition (Tradition One)',
    malayTerm: 'Tradisi Pertama (Kesejahteraan Bersama & Perpaduan)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition One: "Our common welfare should come first; personal recovery depends on NA unity." Individual survival and recovery are deeply tied to the harmony, safety, and unity of the group as a whole.',
    definitionMs:
      'Tradisi Pertama: "Kesejahteraan bersama harus diutamakan; pemulihan peribadi bergantung kepada perpaduan NA." Pemulihan setiap individu bergantung kepada keharmonian, sikap saling menerima, dan keutuhan kumpulan secara keseluruhan.',
    aliases: ['First Tradition', 'Tradition One'],
    bookPages: ['91–97'],
    pdfPages: [96, 97, 98, 99, 100, 101, 102],
    section: 'Tradition One',
    excerpts: [
      {
        bookPage: '91',
        pdfPage: 96,
        section: 'Tradition One',
        quote:
          'Our First Tradition encourages not only our members but our groups to place our common welfare first.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'second-tradition-milestone',
    term: 'Second Tradition (Tradition Two)',
    malayTerm: 'Tradisi Kedua (Hati Nurani Kumpulan & Pelayan Dipercayai)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Two: "For our group purpose there is but one ultimate authority—a loving God as He may express Himself in our group conscience. Our leaders are but trusted servants; they do not govern."',
    definitionMs:
      'Tradisi Kedua: "Bagi tujuan kumpulan kami hanya ada satu kuasa mutlak—Tuhan yang pengasih sebagaimana Dia menyatakan diri-Nya dalam suara hati kumpulan (group conscience). Pemimpin kami hanyalah pelayan yang dipercayai; mereka tidak memerintah."',
    aliases: ['Second Tradition', 'Tradition Two'],
    bookPages: ['98–105'],
    pdfPages: [103, 104, 105, 106, 107, 108, 109, 110],
    section: 'Tradition Two',
    excerpts: [
      {
        bookPage: '98',
        pdfPage: 103,
        section: 'Tradition Two',
        quote:
          'When NA members gather together to seek direction through a loving Higher Power, group conscience guides our decisions with humility and unity.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'third-tradition-milestone',
    term: 'Third Tradition (Tradition Three)',
    malayTerm: 'Tradisi Ketiga (Syarat Tunggal Keahlian)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Three: "The only requirement for membership is a desire to stop using." Ensures every person seeking freedom from addiction is welcomed unconditionally without judgment, fees, or background barriers.',
    definitionMs:
      'Tradisi Ketiga: "Satu-satunya syarat untuk menjadi ahli ialah keinginan untuk berhenti menggunakan dadah." Memastikan pintu pemulihan sentiasa terbuka luas buat sesiapa sahaja tanpa mengira bangsa, darjat, atau sejarah silam.',
    aliases: ['Third Tradition', 'Tradition Three'],
    bookPages: ['106–110'],
    pdfPages: [111, 112, 113, 114, 115],
    section: 'Tradition Three',
    excerpts: [
      {
        bookPage: '106',
        pdfPage: 111,
        section: 'Tradition Three',
        quote:
          'When new members come to meetings, our sole interest is in their desire for freedom from active addiction and how we can be of help.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'fourth-tradition-milestone',
    term: 'Fourth Tradition (Tradition Four)',
    malayTerm: 'Tradisi Keempat (Autonomi Kumpulan)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Four: "Each group should be autonomous except in matters affecting other groups or NA as a whole." Balances creative local freedom with responsibility toward the wider fellowship.',
    definitionMs:
      'Tradisi Keempat: "Setiap kumpulan hendaklah berautonomi kecuali dalam perkara yang memberi kesan kepada kumpulan lain atau NA secara keseluruhan." Mengimbangi kebebasan tempatan dengan tanggungjawab bersama.',
    aliases: ['Fourth Tradition', 'Tradition Four'],
    bookPages: ['111–116'],
    pdfPages: [116, 117, 118, 119, 120, 121],
    section: 'Tradition Four',
    excerpts: [
      {
        bookPage: '111',
        pdfPage: 116,
        section: 'Tradition Four',
        quote:
          'Group autonomy gives groups the creative freedom to find individual ways to carry the message.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'fifth-tradition-milestone',
    term: 'Fifth Tradition (Tradition Five)',
    malayTerm: 'Tradisi Kelima (Tujuan Utama: Menyampaikan Mesej)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Five: "Each group has but one primary purpose—to carry the message to the addict who still suffers." Keeps every meeting centered on hope, welcome, and recovery.',
    definitionMs:
      'Tradisi Kelima: "Setiap kumpulan hanya mempunyai satu tujuan utama—iaitu menyampaikan mesej pemulihan kepada penagih yang masih menderita." Mengekalkan fokus mesyuarat pada penerimaan hangat dan harapan.',
    aliases: ['Fifth Tradition', 'Tradition Five'],
    bookPages: ['117–121'],
    pdfPages: [122, 123, 124, 125, 126],
    section: 'Tradition Five',
    excerpts: [
      {
        bookPage: '117',
        pdfPage: 122,
        section: 'Tradition Five',
        quote:
          'Tradition Five helps our groups fulfill the fundamental reason for their existence: to carry the message to the addict who still suffers.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'sixth-tradition-milestone',
    term: 'Sixth Tradition (Tradition Six)',
    malayTerm: 'Tradisi Keenam (Tiada Pengesahan Institusi Luar)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Six: "An NA group ought never endorse, finance, or lend the NA name to any related facility or outside enterprise, lest problems of money, property, or prestige divert us from our primary purpose."',
    definitionMs:
      'Tradisi Keenam: "Kumpulan NA tidak seharusnya mengesahkan, membiayai, atau meminjamkan nama NA kepada mana-mana kemudahan berkaitan atau pertubuhan luar agar masalah wang, harta, dan prestij tidak mengalihkan tujuan utama."',
    aliases: ['Sixth Tradition', 'Tradition Six'],
    bookPages: ['122–127'],
    pdfPages: [127, 128, 129, 130, 131, 132],
    section: 'Tradition Six',
    excerpts: [
      {
        bookPage: '122',
        pdfPage: 127,
        section: 'Tradition Six',
        quote:
          'The Sixth Tradition warns us of three things that could blur the distinction between Narcotics Anonymous and other enterprises: endorsement, financing, and the lending of our name.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'seventh-tradition-milestone',
    term: 'Seventh Tradition (Tradition Seven)',
    malayTerm: 'Tradisi Ketujuh (Berdikari Sepenuhnya)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Seven: "Every NA group ought to be fully self-supporting, declining outside contributions." Builds collective dignity, freedom from outside influence, and gratitude through voluntary member support.',
    definitionMs:
      'Tradisi Ketujuh: "Setiap kumpulan NA wajar berdikari sepenuhnya dan menolak sumbangan pihak luar." Membina maruah, kebebasan daripada campur tangan luar, dan rasa tanggungjawab ahli sendiri.',
    aliases: ['Seventh Tradition', 'Tradition Seven'],
    bookPages: ['128–135'],
    pdfPages: [133, 134, 135, 136, 137, 138, 139, 140],
    section: 'Tradition Seven',
    excerpts: [
      {
        bookPage: '128',
        pdfPage: 133,
        section: 'Tradition Seven',
        quote:
          'Tradition Seven encourages us to decline funding from other organizations so we remain free to carry our spiritual message cleanly.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'eighth-tradition-milestone',
    term: 'Eighth Tradition (Tradition Eight)',
    malayTerm: 'Tradisi Kelapan (Kekal Bukan Profesional)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Eight: "Narcotics Anonymous should remain forever nonprofessional, but our service centers may employ special workers." Preserves the pure peer-to-peer bond of one addict helping another.',
    definitionMs:
      'Tradisi Kelapan: "Narcotics Anonymous hendaklah kekal selama-lamanya sebagai gerakan bukan profesional, namun pusat khidmatnya boleh menggaji pekerja khas." Memelihara ketulusan ikatan sesama penagih membantu penagih lain tanpa bayaran.',
    aliases: ['Eighth Tradition', 'Tradition Eight'],
    bookPages: ['136–138'],
    pdfPages: [141, 142, 143],
    section: 'Tradition Eight',
    excerpts: [
      {
        bookPage: '137',
        pdfPage: 142,
        section: 'Tradition Eight',
        quote:
          'The principles underlying the Eighth Tradition are eminently practical ones: humility, prudence, anonymity, and integrity.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'ninth-tradition-milestone',
    term: 'Ninth Tradition (Tradition Nine)',
    malayTerm: 'Tradisi Kesembilan (Jawatankuasa Khidmat Bertanggungjawab)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Nine: "NA, as such, ought never be organized, but we may create service boards or committees directly responsible to those they serve." Keeps service structure humble, simple, and accountable.',
    definitionMs:
      'Tradisi Kesembilan: "NA sendiri tidak harus diorganisasikan secara birokratik, tetapi lembaga atau jawatankuasa khidmat boleh dibentuk dan bertanggungjawab terus kepada pihak yang dilayaninya."',
    aliases: ['Ninth Tradition', 'Tradition Nine'],
    bookPages: ['139–143'],
    pdfPages: [144, 145, 146, 147, 148],
    section: 'Tradition Nine',
    excerpts: [
      {
        bookPage: '139',
        pdfPage: 144,
        section: 'Tradition Nine',
        quote:
          'Rather than recommend that NA groups themselves become organized, the Ninth Tradition suggests that groups organize separate boards and committees to serve their needs.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'tenth-tradition-milestone',
    term: 'Tenth Tradition (Tradition Ten)',
    malayTerm: 'Tradisi Kesepuluh (Tiada Pendirian dalam Isu Luar)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Ten: "Narcotics Anonymous has no opinion on outside issues; hence the NA name ought never be drawn into public controversy." Protects the fellowship so no addict is ever turned away by politics or public disputes.',
    definitionMs:
      'Tradisi Kesepuluh: "Narcotics Anonymous tidak mempunyai sebarang pendapat dalam isu-isu luar; oleh itu nama NA tidak boleh sesekali diheret ke dalam kontroversi awam." Melindungi ruang selamat pemulihan daripada perpecahan politik atau perbalahan luar.',
    aliases: ['Tenth Tradition', 'Tradition Ten'],
    bookPages: ['144–148'],
    pdfPages: [149, 150, 151, 152, 153],
    section: 'Tradition Ten',
    excerpts: [
      {
        bookPage: '144',
        pdfPage: 149,
        section: 'Tradition Ten',
        quote:
          'Narcotics Anonymous, as a fellowship, has no opinion on the pressing world issues of our day so nothing distracts us from our primary purpose.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'eleventh-tradition-milestone',
    term: 'Eleventh Tradition (Tradition Eleven)',
    malayTerm: 'Tradisi Kesebelas (Daya Tarikan Bukan Promosi)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Eleven: "Our public relations policy is based on attraction rather than promotion; we need always maintain personal anonymity at the level of press, radio, and films." Lets real recovery speak quietly for itself.',
    definitionMs:
      'Tradisi Kesebelas: "Dasar perhubungan awam kami berteraskan daya tarikan dan bukannya promosi; kami sentiasa mengekalkan kerahsiaan identiti peribadi di peringkat media akhbar, radio, dan filem."',
    aliases: ['Eleventh Tradition', 'Tradition Eleven'],
    bookPages: ['149–152'],
    pdfPages: [154, 155, 156, 157],
    section: 'Tradition Eleven',
    excerpts: [
      {
        bookPage: '149',
        pdfPage: 154,
        section: 'Tradition Eleven',
        quote:
          'Public information work, done properly, is not promotion; rather, it seeks to make NA attractive to those who might need us.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'twelfth-tradition-milestone',
    term: 'Twelfth Tradition (Tradition Twelve)',
    malayTerm: 'Tradisi Kedua Belas (Kerahsiaan sebagai Asas Rohani)',
    partOfSpeech: 'Prinsip',
    category: 'Tradisi 1–12',
    definitionEn:
      'Tradition Twelve: "Anonymity is the spiritual foundation of all our traditions, ever reminding us to place principles before personalities." Calls every member to humility, selflessness, and confidentiality so trust endures.',
    definitionMs:
      'Tradisi Kedua Belas: "Kerahsiaan (anonymity) adalah asas rohani bagi segala tradisi kami, sentiasa mengingatkan kami agar mendahulukan prinsip daripada personaliti." Menyeru sikap tidak mementingkan ego demi kelangsungan persaudaraan.',
    aliases: ['Twelfth Tradition', 'Tradition Twelve'],
    bookPages: ['153–158'],
    pdfPages: [158, 159, 160, 161, 162, 163],
    section: 'Tradition Twelve',
    excerpts: [
      {
        bookPage: '153',
        pdfPage: 158,
        section: 'Tradition Twelve',
        quote:
          'That kind of selflessness is what the Twelfth Tradition means by the word “anonymity,” and it is the spiritual foundation upon which Narcotics Anonymous is built.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'moment-of-clarity',
    term: 'Moment of clarity',
    malayTerm: 'Detik Kesedaran Jelas',
    partOfSpeech: 'Frasa',
    category: 'Langkah 1–12',
    definitionEn:
      'That sobering, honest instant when all our lies, excuses, and rationalizations collapse and we finally see the truth about our addiction—creating the opening needed to reach out for help and stop using.',
    definitionMs:
      'Detik keinsafan yang amat jelas apabila segala helah, alasan, dan pembohongan terhadap diri sendiri runtuh sekaligus, membolehkan seseorang melihat realiti sebenar ketagihannya dan mula mencari pertolongan.',
    usageNoteEn:
      'Described in Step One (Book p. 6, PDF p. 12) as the breaking point where honesty begins to replace denial.',
    aliases: ['moment of clarity'],
    bookPages: ['6'],
    pdfPages: [12],
    section: 'Step One',
    excerpts: [
      {
        bookPage: '6',
        pdfPage: 12,
        section: 'Step One',
        quote:
          'Many of us recall the moment of clarity when we came face to face with our disease. All the lies, all the pretenses, all the rationalizations we had used to justify where we stood as a result of our drug use stopped working.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'despair-recovery',
    term: 'Despair & Desperation',
    malayTerm: 'Keputusasaan yang Mendorong Perubahan',
    partOfSpeech: 'Kata Nama',
    category: 'Langkah 1–12',
    definitionEn:
      'The heavy exhaustion and hopelessness caused by active addiction that finally breaks stubborn pride—often serving as the very threshold that makes an addict desperate enough to surrender and try recovery.',
    definitionMs:
      'Rasa putus asa yang amat berat dan keletihan jiwa akibat ketagihan yang akhirnya meruntuhkan keangkuhan diri—sering kali menjadi titik tolak yang membuat seseorang cukup terdesak untuk menyerah diri dan menerima jalan pemulihan.',
    aliases: ['despair', 'desperation'],
    bookPages: ['3', '50', '83'],
    pdfPages: [9, 56, 89],
    section: 'Step One & Step Seven',
    excerpts: [
      {
        bookPage: '3',
        pdfPage: 9,
        section: 'Step One',
        quote:
          'As addicts, we have each experienced the pain, loneliness, and despair of addiction. Before coming to NA, most of us tried everything we could think of to control our use of drugs.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'new-way-to-live',
    term: 'A new way to live',
    malayTerm: 'Cara Hidup Baharu',
    partOfSpeech: 'Frasa',
    category: 'Frasa Teras',
    definitionEn:
      'Recovery’s gift beyond merely putting down drugs: a joyful, honest, spiritually grounded daily life shared in fellowship where old emptiness is replaced by purpose, peace, and connection.',
    definitionMs:
      'Anugerah pemulihan yang melampaui sekadar meninggalkan dadah: membina corak hidup baharu yang jujur, bermakna, tenang, dan berteraskan prinsip rohani bersama sokongan persaudaraan sehingga kekosongan silam digantikan dengan harapan.',
    aliases: ['new way to live', 'new way of life'],
    bookPages: ['10', '46'],
    pdfPages: [16, 52],
    section: 'Step One & Step Six',
    excerpts: [
      {
        bookPage: '10',
        pdfPage: 16,
        section: 'Step One',
        quote:
          'We learn a new way to live. The emptiness from which we suffered is filled through working and living the Twelve Steps. We have found a solution to our hopelessness.',
      },
    ],
    source: 'curated',
  },
  {
    id: 'victory-in-defeat',
    term: 'Victory lies in the admission of defeat',
    malayTerm: 'Kemenangan Bermula dengan Mengakui Kekalahan',
    partOfSpeech: 'Frasa',
    category: 'Langkah 1–12',
    definitionEn:
      'The great spiritual paradox of Step One: stopping the futile battle to outsmart addiction alone is not failure—it is the exact moment we win freedom, support, and a chance to stay clean.',
    definitionMs:
      'Paradoks rohani agung dalam pemulihan: menghentikan peperangan sia-sia untuk mengawal ketagihan seorang diri bukanlah satu kegagalan, sebaliknya itulah saat kita meraih kemenangan, pertolongan, dan peluang sebenar untuk kekal bersih.',
    aliases: ['admission of defeat'],
    bookPages: ['10'],
    pdfPages: [16],
    section: 'Step One',
    excerpts: [
      {
        bookPage: '10',
        pdfPage: 16,
        section: 'Step One',
        quote:
          'We surrender again, knowing that victory lies in the admission of defeat. ... To get started on this journey, we must become willing to surrender to this program and its principles.',
      },
    ],
    source: 'curated',
  },
];
