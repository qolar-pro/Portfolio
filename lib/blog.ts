import type { Lang } from '@/lib/content';

/**
 * Articles live here rather than in a CMS because there are three of them and
 * a database for three documents is a liability, not a feature. When the
 * count justifies it, this shape maps onto any headless CMS without touching
 * the components.
 *
 * Bodies are structured rather than HTML strings so nothing renders unescaped
 * and the typography stays under the stylesheet's control.
 */

export type Block =
  | { t: 'p'; s: string }
  | { t: 'h'; s: string }
  | { t: 'ul'; s: string[] }
  | { t: 'quote'; s: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date — set when the piece was written, not when the build ran. */
  date: string;
  readingTime: string;
  tag: string;
  body: Block[];
}

const en: Article[] = [
  {
    slug: 'rebuild-or-redesign',
    title: 'Do I need to rebuild my site, or just design it better?',
    excerpt:
      'The honest test is not how the site looks. It is what happens when you try to change something.',
    date: '2026-07-14',
    readingTime: '6 min',
    tag: 'Deciding',
    body: [
      {
        t: 'p',
        s: 'Almost everyone who asks me this has already decided the site looks dated, and wants permission to spend money on it. That is the wrong test. Plenty of ugly sites make money and plenty of beautiful ones are quietly broken underneath.',
      },
      { t: 'h', s: 'The test that actually works' },
      {
        t: 'p',
        s: 'Try to make a small change. Add a page. Change a price. Put up a banner for a promotion that starts on Friday. Time how long it takes and count how many people you had to ask.',
      },
      {
        t: 'p',
        s: 'If that takes ten minutes and nobody else was involved, your site is fine and you have a design problem. A redesign — new layout, new type, better photography, clearer buttons — will fix it, and it costs a fraction of a rebuild.',
      },
      {
        t: 'p',
        s: 'If it took three days, or you gave up, or the answer was "we have to ask the guy who built it and he does not reply" — the design is not your problem. You have a structural problem wearing a design problem as a costume.',
      },
      { t: 'h', s: 'Signs it is genuinely a rebuild' },
      {
        t: 'ul',
        s: [
          'Nobody can edit content without a developer.',
          'It is slow on a phone on mobile data, and the fix is always "add a caching plugin".',
          'It runs on a platform version that stopped getting security updates.',
          'Adding a language, or a second currency, means duplicating the whole site.',
          'The checkout drops people and nobody can tell you where, because nothing is measured.',
        ],
      },
      {
        t: 'p',
        s: 'Two or more of those and a redesign is money spent painting a house with a cracked foundation. The paint will be lovely. The crack will still be there next year, and you will have spent the budget you needed for the real fix.',
      },
      { t: 'h', s: 'The middle path nobody offers you' },
      {
        t: 'p',
        s: 'There is a third answer that agencies rarely propose, because it is the smallest invoice: keep the site, fix the three things that are actually costing you money. Usually that is page speed, the contact or checkout flow, and whatever is stopping you from editing your own content.',
      },
      {
        t: 'quote',
        s: 'If someone quotes you a full rebuild before asking what happens when you try to change a price, they are selling, not diagnosing.',
      },
      {
        t: 'p',
        s: 'Send me the URL and I will tell you which of the three you are looking at. If it is the cheap one, I will say so — a small honest job that goes well is worth more to me than a big one you resent paying for.',
      },
    ],
  },
  {
    slug: 'traffic-that-converts',
    title: 'How to actually get traffic to your site',
    excerpt:
      'Traffic is the easy half. The hard half is traffic that had a reason to come and a reason to stay.',
    date: '2026-07-28',
    readingTime: '7 min',
    tag: 'Growth',
    body: [
      {
        t: 'p',
        s: 'You can buy visitors this afternoon. A few hundred euros in Google Ads will put people on your site by dinner. The question worth asking is not how to get traffic — it is why the traffic you already get does nothing.',
      },
      { t: 'h', s: 'Start with the traffic you are wasting' },
      {
        t: 'p',
        s: 'Most small business sites already receive more visitors than the owner realises, and lose nearly all of them. Before spending anything on ads, find out what is happening to the people who already arrive. Install analytics properly, watch a week, and look at two numbers: how many leave without a second page, and where the ones who do stay end up.',
      },
      {
        t: 'p',
        s: 'Doubling the number of visitors who do something useful is almost always cheaper than doubling the number of visitors.',
      },
      { t: 'h', s: 'Then, in order of cost' },
      {
        t: 'ul',
        s: [
          'Google Business Profile. Free, and for a local business it outperforms almost everything else. Photos, hours, and answered reviews.',
          'The pages that answer a real question. "How much does X cost in Greece" is searched by people about to spend money. "Welcome to our website" is searched by nobody.',
          'Technical basics — speed, mobile layout, a sitemap, pages that load in under two seconds on a phone.',
          'Email to people who already bought. The cheapest revenue on this list and the most ignored.',
          'Paid ads, last. They work, but they stop the moment you stop paying, and they magnify whatever your site already does — including losing people.',
        ],
      },
      { t: 'h', s: 'The part that takes a year' },
      {
        t: 'p',
        s: 'Search traffic is a compounding asset and it moves slowly. A page written today may not rank for six months. That is genuinely frustrating and it is also why it is worth doing: your competitor gave up in month two.',
      },
      {
        t: 'quote',
        s: 'Ads are rented traffic. Search and email are owned. Build the owned half, rent the rest while you wait.',
      },
      {
        t: 'p',
        s: 'If someone promises you page one in thirty days, ask them to put the timeline in the contract with a refund attached. The answer tells you everything.',
      },
    ],
  },
  {
    slug: 'ecommerce-2026',
    title: 'What an e-shop actually needs in 2026',
    excerpt:
      'The storefront is the part everyone argues about. The parts that decide whether it works are behind it.',
    date: '2026-08-05',
    readingTime: '8 min',
    tag: 'Commerce',
    body: [
      {
        t: 'p',
        s: 'Every e-shop conversation starts with how it should look and ends, months later, with someone doing stock counts in a spreadsheet at midnight. The design matters. It matters less than the six things below.',
      },
      { t: 'h', s: 'Payments, plural' },
      {
        t: 'p',
        s: 'Cards through a proper processor, and cash on delivery. In Greece and North Macedonia, dropping cash on delivery to keep the build simple is dropping a meaningful share of orders. Build for both from the start; retrofitting it into a checkout designed around cards only is genuinely painful.',
      },
      { t: 'h', s: 'Stock that knows about variants' },
      {
        t: 'p',
        s: 'A product is rarely one thing. It is a size, a colour, a pack quantity. If the system tracks stock per product rather than per variant, you will oversell the medium and disappoint someone. This is the single most common thing I fix on inherited stores.',
      },
      { t: 'h', s: 'An admin panel your staff will actually use' },
      {
        t: 'p',
        s: 'If adding a product takes fifteen fields and a manual, nobody adds products, and the catalogue rots. The admin side deserves the same design attention as the storefront — it is the screen your team looks at every day.',
      },
      { t: 'h', s: 'Speed on a mid-range phone' },
      {
        t: 'p',
        s: 'Not on your laptop on office wifi. On a three-year-old Android on mobile data, which is what most of your customers are holding. Every second of load time costs orders, and image-heavy storefronts are the usual culprit.',
      },
      { t: 'h', s: 'Measurement wired in from day one' },
      {
        t: 'p',
        s: 'You need to know which step of the checkout loses people. Without that you are guessing, and guessing about checkout is expensive guessing.',
      },
      { t: 'h', s: 'An exit' },
      {
        t: 'ul',
        s: [
          'You own the domain, registered to you, not to your agency.',
          'You have access to the hosting and the payment accounts.',
          'The product data can be exported in a format another system can read.',
        ],
      },
      {
        t: 'quote',
        s: 'A store you cannot leave is not a platform, it is a hostage situation with monthly billing.',
      },
      {
        t: 'p',
        s: 'Shopify is a genuinely good answer for a lot of businesses and I will tell you when it is yours. A custom build earns its cost when the rules of your business do not fit a template — wholesale pricing tiers, complex variants, an ordering flow nobody else has.',
      },
    ],
  },
];

const el: Article[] = [
  {
    slug: 'rebuild-or-redesign',
    title: 'Χρειάζομαι νέο site ή απλώς καλύτερο σχεδιασμό;',
    excerpt:
      'Το ειλικρινές τεστ δεν είναι πώς φαίνεται το site. Είναι τι γίνεται όταν πάτε να αλλάξετε κάτι.',
    date: '2026-07-14',
    readingTime: '6 λεπτά',
    tag: 'Απόφαση',
    body: [
      {
        t: 'p',
        s: 'Σχεδόν όλοι όσοι κάνουν αυτή την ερώτηση έχουν ήδη αποφασίσει ότι το site δείχνει παλιό και ψάχνουν έγκριση για να ξοδέψουν. Λάθος τεστ. Πολλά άσχημα site βγάζουν λεφτά και πολλά ωραία είναι σπασμένα από κάτω.',
      },
      { t: 'h', s: 'Το τεστ που δουλεύει πραγματικά' },
      {
        t: 'p',
        s: 'Δοκιμάστε να κάνετε μια μικρή αλλαγή. Προσθέστε μια σελίδα. Αλλάξτε μια τιμή. Βάλτε ένα banner για μια προσφορά που ξεκινά την Παρασκευή. Μετρήστε πόση ώρα πήρε και πόσους ανθρώπους χρειάστηκε να ρωτήσετε.',
      },
      {
        t: 'p',
        s: 'Αν πήρε δέκα λεπτά και δεν εμπλάκηκε κανείς άλλος, το site σας είναι εντάξει και έχετε θέμα σχεδιασμού. Ένας ανασχεδιασμός θα το λύσει, και κοστίζει κλάσμα μιας ανακατασκευής.',
      },
      {
        t: 'p',
        s: 'Αν πήρε τρεις μέρες, ή το παρατήσατε, ή η απάντηση ήταν «πρέπει να ρωτήσουμε αυτόν που το έφτιαξε και δεν απαντάει» — ο σχεδιασμός δεν είναι το πρόβλημά σας. Έχετε δομικό πρόβλημα μεταμφιεσμένο σε αισθητικό.',
      },
      { t: 'h', s: 'Σημάδια ότι πράγματι θέλει ανακατασκευή' },
      {
        t: 'ul',
        s: [
          'Κανείς δεν μπορεί να αλλάξει περιεχόμενο χωρίς προγραμματιστή.',
          'Είναι αργό σε κινητό με δεδομένα, και η λύση είναι πάντα «βάλε ένα plugin cache».',
          'Τρέχει σε έκδοση πλατφόρμας που δεν παίρνει πια ενημερώσεις ασφαλείας.',
          'Μια νέα γλώσσα ή δεύτερο νόμισμα σημαίνει να διπλασιάσετε όλο το site.',
          'Το checkout χάνει κόσμο και κανείς δεν ξέρει πού, γιατί δεν μετριέται τίποτα.',
        ],
      },
      {
        t: 'p',
        s: 'Δύο ή περισσότερα από αυτά και ο ανασχεδιασμός είναι μπογιά σε σπίτι με ραγισμένα θεμέλια. Η μπογιά θα είναι ωραία. Η ρωγμή θα είναι εκεί του χρόνου, και θα έχετε ξοδέψει το budget που χρειαζόσασταν για την πραγματική λύση.',
      },
      { t: 'h', s: 'Ο τρίτος δρόμος που δεν σας προτείνει κανείς' },
      {
        t: 'p',
        s: 'Υπάρχει και τρίτη απάντηση, που σπάνια προτείνεται επειδή είναι το μικρότερο τιμολόγιο: κρατάτε το site και διορθώνετε τα τρία πράγματα που σας κοστίζουν όντως λεφτά. Συνήθως ταχύτητα, η ροή επικοινωνίας ή checkout, και ό,τι σας εμποδίζει να αλλάζετε μόνοι σας περιεχόμενο.',
      },
      {
        t: 'quote',
        s: 'Αν κάποιος σας δίνει προσφορά για ολική ανακατασκευή πριν ρωτήσει τι γίνεται όταν αλλάζετε μια τιμή, πουλάει — δεν διαγιγνώσκει.',
      },
      {
        t: 'p',
        s: 'Στείλτε μου το URL και θα σας πω σε ποια από τις τρεις περιπτώσεις είστε. Αν είναι η φθηνή, θα το πω — μια μικρή τίμια δουλειά που πάει καλά αξίζει περισσότερο από μια μεγάλη που τη μετανιώνετε.',
      },
    ],
  },
  {
    slug: 'traffic-that-converts',
    title: 'Πώς φέρνετε πραγματικά επισκεψιμότητα στο site σας',
    excerpt:
      'Η επισκεψιμότητα είναι το εύκολο μισό. Το δύσκολο είναι επισκέπτες που είχαν λόγο να έρθουν και λόγο να μείνουν.',
    date: '2026-07-28',
    readingTime: '7 λεπτά',
    tag: 'Ανάπτυξη',
    body: [
      {
        t: 'p',
        s: 'Μπορείτε να αγοράσετε επισκέπτες σήμερα το απόγευμα. Λίγες εκατοντάδες ευρώ σε Google Ads και θα έχετε κόσμο μέχρι το βράδυ. Το ερώτημα δεν είναι πώς θα φέρετε κίνηση — είναι γιατί η κίνηση που ήδη έχετε δεν κάνει τίποτα.',
      },
      { t: 'h', s: 'Ξεκινήστε από την κίνηση που σπαταλάτε' },
      {
        t: 'p',
        s: 'Τα περισσότερα site μικρών επιχειρήσεων δέχονται περισσότερους επισκέπτες απ’ όσο νομίζει ο ιδιοκτήτης, και τους χάνουν σχεδόν όλους. Πριν ξοδέψετε σε διαφήμιση, δείτε τι γίνεται με όσους ήδη έρχονται. Βάλτε σωστά analytics, παρακολουθήστε μία εβδομάδα, και κοιτάξτε δύο νούμερα: πόσοι φεύγουν χωρίς δεύτερη σελίδα, και πού καταλήγουν όσοι μένουν.',
      },
      {
        t: 'p',
        s: 'Το να διπλασιάσετε τους επισκέπτες που κάνουν κάτι χρήσιμο είναι σχεδόν πάντα φθηνότερο από το να διπλασιάσετε τους επισκέπτες.',
      },
      { t: 'h', s: 'Μετά, με σειρά κόστους' },
      {
        t: 'ul',
        s: [
          'Google Business Profile. Δωρεάν, και για τοπική επιχείρηση αποδίδει περισσότερο από σχεδόν οτιδήποτε άλλο.',
          'Σελίδες που απαντούν σε πραγματική ερώτηση. Το «πόσο κοστίζει X» το ψάχνουν άνθρωποι έτοιμοι να πληρώσουν. Το «καλώς ήρθατε στο site μας» δεν το ψάχνει κανείς.',
          'Τεχνικά βασικά — ταχύτητα, σωστή εμφάνιση σε κινητό, sitemap, σελίδες που φορτώνουν κάτω από δύο δευτερόλεπτα.',
          'Email σε όσους ήδη αγόρασαν. Τα φθηνότερα έσοδα της λίστας και τα πιο παραμελημένα.',
          'Πληρωμένη διαφήμιση, τελευταία. Δουλεύει, αλλά σταματά μόλις σταματήσετε να πληρώνετε.',
        ],
      },
      { t: 'h', s: 'Το κομμάτι που θέλει έναν χρόνο' },
      {
        t: 'p',
        s: 'Η οργανική επισκεψιμότητα είναι περιουσιακό στοιχείο που ανατοκίζεται, και κινείται αργά. Μια σελίδα που γράφεται σήμερα ίσως δεν φανεί για έξι μήνες. Είναι εκνευριστικό, και γι’ αυτό ακριβώς αξίζει: ο ανταγωνιστής σας το παράτησε τον δεύτερο μήνα.',
      },
      {
        t: 'quote',
        s: 'Οι διαφημίσεις είναι νοικιασμένη επισκεψιμότητα. Η αναζήτηση και το email είναι δική σας. Χτίστε το δικό σας μισό, νοικιάστε το υπόλοιπο όσο περιμένετε.',
      },
      {
        t: 'p',
        s: 'Αν κάποιος υπόσχεται πρώτη σελίδα σε τριάντα μέρες, ζητήστε του να το βάλει στο συμβόλαιο με ρήτρα επιστροφής. Η απάντηση λέει τα πάντα.',
      },
    ],
  },
  {
    slug: 'ecommerce-2026',
    title: 'Τι χρειάζεται πραγματικά ένα e-shop το 2026',
    excerpt:
      'Για τη βιτρίνα μαλώνουν όλοι. Αυτά που κρίνουν αν δουλεύει είναι από πίσω.',
    date: '2026-08-05',
    readingTime: '8 λεπτά',
    tag: 'E-commerce',
    body: [
      {
        t: 'p',
        s: 'Κάθε κουβέντα για e-shop ξεκινά με το πώς θα φαίνεται και τελειώνει, μήνες μετά, με κάποιον να μετράει απόθεμα σε excel στις δώδεκα το βράδυ. Ο σχεδιασμός μετράει. Μετράει λιγότερο από τα έξι παρακάτω.',
      },
      { t: 'h', s: 'Πληρωμές, στον πληθυντικό' },
      {
        t: 'p',
        s: 'Κάρτες μέσω σοβαρού παρόχου, και αντικαταβολή. Σε Ελλάδα και Βόρεια Μακεδονία, το να κόψετε την αντικαταβολή για να απλοποιήσετε την κατασκευή σημαίνει να κόψετε σημαντικό ποσοστό παραγγελιών. Χτίστε και τα δύο από την αρχή.',
      },
      { t: 'h', s: 'Απόθεμα που ξέρει από παραλλαγές' },
      {
        t: 'p',
        s: 'Ένα προϊόν σπάνια είναι ένα πράγμα. Είναι νούμερο, χρώμα, συσκευασία. Αν το σύστημα κρατά απόθεμα ανά προϊόν αντί ανά παραλλαγή, θα πουλήσετε medium που δεν έχετε. Είναι το πιο συχνό πράγμα που διορθώνω σε καταστήματα που παραλαμβάνω.',
      },
      { t: 'h', s: 'Admin panel που θα χρησιμοποιεί όντως το προσωπικό' },
      {
        t: 'p',
        s: 'Αν η προσθήκη προϊόντος θέλει δεκαπέντε πεδία κι ένα εγχειρίδιο, κανείς δεν προσθέτει προϊόντα και ο κατάλογος σαπίζει. Η πλευρά της διαχείρισης αξίζει την ίδια σχεδιαστική προσοχή με τη βιτρίνα.',
      },
      { t: 'h', s: 'Ταχύτητα σε μεσαίο κινητό' },
      {
        t: 'p',
        s: 'Όχι στο laptop σας με wifi γραφείου. Σε ένα τριών ετών Android με δεδομένα, που κρατούν οι περισσότεροι πελάτες σας. Κάθε δευτερόλεπτο καθυστέρησης κοστίζει παραγγελίες.',
      },
      { t: 'h', s: 'Μέτρηση από την πρώτη μέρα' },
      {
        t: 'p',
        s: 'Πρέπει να ξέρετε σε ποιο βήμα του checkout χάνετε κόσμο. Χωρίς αυτό μαντεύετε, και το μάντεμα στο checkout είναι ακριβό μάντεμα.',
      },
      { t: 'h', s: 'Μια έξοδος' },
      {
        t: 'ul',
        s: [
          'Το domain είναι δικό σας, στο δικό σας όνομα, όχι του γραφείου.',
          'Έχετε πρόσβαση στο hosting και στους λογαριασμούς πληρωμών.',
          'Τα δεδομένα προϊόντων εξάγονται σε μορφή που διαβάζει άλλο σύστημα.',
        ],
      },
      {
        t: 'quote',
        s: 'Ένα κατάστημα που δεν μπορείτε να εγκαταλείψετε δεν είναι πλατφόρμα· είναι ομηρία με μηνιαία χρέωση.',
      },
      {
        t: 'p',
        s: 'Το Shopify είναι πολύ καλή απάντηση για αρκετές επιχειρήσεις και θα σας πω πότε είναι η δική σας. Μια custom κατασκευή δικαιολογεί το κόστος της όταν οι κανόνες της επιχείρησής σας δεν χωράνε σε template — τιμοκατάλογοι χονδρικής, σύνθετες παραλλαγές, ροή παραγγελίας που δεν την έχει άλλος.',
      },
    ],
  },
];

const mk: Article[] = [
  {
    slug: 'rebuild-or-redesign',
    title: 'Дали ми треба нова страница или само подобар дизајн?',
    excerpt:
      'Искрениот тест не е како изгледа страницата. Туку што се случува кога ќе сакате да смените нешто.',
    date: '2026-07-14',
    readingTime: '6 мин',
    tag: 'Одлука',
    body: [
      {
        t: 'p',
        s: 'Речиси секој што го поставува ова прашање веќе одлучил дека страницата изгледа старо и бара одобрение да потроши. Погрешен тест. Многу грди страници заработуваат пари, и многу убави се скршени одоздола.',
      },
      { t: 'h', s: 'Тестот што навистина работи' },
      {
        t: 'p',
        s: 'Обидете се да направите мала промена. Додајте страница. Сменете цена. Ставете банер за понуда што почнува в петок. Измерете колку време ви требаше и колку луѓе моравте да прашате.',
      },
      {
        t: 'p',
        s: 'Ако ви требаа десет минути и никој друг не беше вклучен, страницата ви е во ред и имате прашање на дизајн. Редизајн ќе го реши, и чини дел од цената на преправање.',
      },
      {
        t: 'p',
        s: 'Ако ви требаа три дена, или се откажавте, или одговорот беше „мораме да го прашаме оној што ја правеше, а не се јавува“ — дизајнот не ви е проблемот. Имате структурен проблем маскиран во естетски.',
      },
      { t: 'h', s: 'Знаци дека навистина треба преправање' },
      {
        t: 'ul',
        s: [
          'Никој не може да смени содржина без програмер.',
          'Бавна е на телефон со мобилен интернет, а решението е секогаш „стави cache plugin“.',
          'Работи на верзија на платформа што повеќе не добива безбедносни ажурирања.',
          'Нов јазик или втора валута значи да ја дуплирате целата страница.',
          'Checkout-от губи луѓе и никој не знае каде, зашто ништо не се мери.',
        ],
      },
      {
        t: 'p',
        s: 'Две или повеќе од овие и редизајнот е боја врз куќа со напукнати темели. Бојата ќе биде убава. Пукнатината ќе биде таму и догодина, а вие ќе сте го потрошиле буџетот што ви требаше за вистинското решение.',
      },
      { t: 'h', s: 'Третиот пат што никој не ви го нуди' },
      {
        t: 'p',
        s: 'Постои и трет одговор, кој ретко се нуди зашто е најмалата фактура: ја задржувате страницата и ги поправате трите работи што навистина ве чинат пари. Обично брзината, текот на контакт или checkout, и она што ве спречува сами да менувате содржина.',
      },
      {
        t: 'quote',
        s: 'Ако некој ви дава понуда за целосно преправање пред да прашал што се случува кога менувате цена — продава, не дијагностицира.',
      },
      {
        t: 'p',
        s: 'Испратете ми го URL-от и ќе ви кажам во кој од трите случаи сте. Ако е евтиниот, ќе го кажам — мала чесна работа што поминува добро вреди повеќе од голема за која ќе се каете.',
      },
    ],
  },
  {
    slug: 'traffic-that-converts',
    title: 'Како навистина да доведете посетители на вашата страница',
    excerpt:
      'Сообраќајот е лесната половина. Тешката се посетители што имале причина да дојдат и причина да останат.',
    date: '2026-07-28',
    readingTime: '7 мин',
    tag: 'Раст',
    body: [
      {
        t: 'p',
        s: 'Можете да купите посетители денес попладне. Неколку стотини евра во Google Ads и ќе имате луѓе до навечер. Прашањето не е како да доведете сообраќај — туку зошто сообраќајот што веќе го имате не прави ништо.',
      },
      { t: 'h', s: 'Почнете од сообраќајот што го трошите залудно' },
      {
        t: 'p',
        s: 'Повеќето страници на мали фирми примаат повеќе посетители отколку што мисли сопственикот, и ги губат речиси сите. Пред да трошите на реклама, видете што се случува со оние што веќе доаѓаат. Поставете analytics како треба, следете една недела, и погледнете два броја: колку заминуваат без втора страница, и каде завршуваат оние што остануваат.',
      },
      {
        t: 'p',
        s: 'Да ги удвоите посетителите што прават нешто корисно е речиси секогаш поевтино од да ги удвоите посетителите.',
      },
      { t: 'h', s: 'Потоа, по редослед на цена' },
      {
        t: 'ul',
        s: [
          'Google Business Profile. Бесплатно, и за локална фирма враќа повеќе од речиси сѐ друго.',
          'Страници што одговараат на вистинско прашање. „Колку чини X“ го бараат луѓе спремни да платат. „Добредојдовте на нашата страница“ не го бара никој.',
          'Технички основи — брзина, точен приказ на телефон, sitemap, страници што се вчитуваат под две секунди.',
          'Email до оние што веќе купиле. Најевтиниот приход на списокот и најзапоставениот.',
          'Платена реклама, последна. Работи, но запира штом престанете да плаќате.',
        ],
      },
      { t: 'h', s: 'Делот што бара една година' },
      {
        t: 'p',
        s: 'Органскиот сообраќај е имот што се натрупува, и се движи бавно. Страница напишана денес можеби нема да се појави шест месеци. Тоа е нервозно, и токму затоа вреди: вашиот конкурент се откажал во вториот месец.',
      },
      {
        t: 'quote',
        s: 'Рекламите се изнајмен сообраќај. Пребарувањето и email-от се ваши. Изградете ја вашата половина, изнајмете ја другата додека чекате.',
      },
      {
        t: 'p',
        s: 'Ако некој ветува прва страница за триесет дена, побарајте да го стави во договор со клаузула за враќање пари. Одговорот кажува сѐ.',
      },
    ],
  },
  {
    slug: 'ecommerce-2026',
    title: 'Што навистина ѝ треба на една онлајн продавница во 2026',
    excerpt: 'За излогот се расправаат сите. Она што одлучува дали работи е одзади.',
    date: '2026-08-05',
    readingTime: '8 мин',
    tag: 'Е-трговија',
    body: [
      {
        t: 'p',
        s: 'Секој разговор за онлајн продавница почнува со тоа како ќе изгледа и завршува, месеци подоцна, со некој што брои залиха во excel во дванаесет навечер. Дизајнот е важен. Помалку важен од шесте работи подолу.',
      },
      { t: 'h', s: 'Плаќања, во множина' },
      {
        t: 'p',
        s: 'Картички преку сериозен провајдер, и плаќање при достава. Во Северна Македонија и во регионот, да го исфрлите плаќањето при достава за да ја поедноставите изработката значи да исфрлите значаен процент нарачки. Изградете ги двете од почеток.',
      },
      { t: 'h', s: 'Залиха што знае за варијанти' },
      {
        t: 'p',
        s: 'Еден производ ретко е една работа. Тоа е број, боја, пакување. Ако системот чува залиха по производ наместо по варијанта, ќе продадете medium што го немате. Тоа е најчестата работа што ја поправам во продавници што ги преземам.',
      },
      { t: 'h', s: 'Admin panel што персоналот навистина ќе го користи' },
      {
        t: 'p',
        s: 'Ако додавањето производ бара петнаесет полиња и упатство, никој не додава производи и каталогот скапува. Административната страна ја заслужува истата дизајнерска грижа како излогот.',
      },
      { t: 'h', s: 'Брзина на среден телефон' },
      {
        t: 'p',
        s: 'Не на вашиот лаптоп со канцелариски wifi. На тригодишен Android со мобилен интернет, каков што држат повеќето ваши купувачи. Секоја секунда доцнење чини нарачки.',
      },
      { t: 'h', s: 'Мерење од првиот ден' },
      {
        t: 'p',
        s: 'Мора да знаете на кој чекор од checkout-от губите луѓе. Без тоа погодувате, а погодувањето во checkout е скапо погодување.',
      },
      { t: 'h', s: 'Еден излез' },
      {
        t: 'ul',
        s: [
          'Доменот е ваш, на ваше име, не на агенцијата.',
          'Имате пристап до хостингот и до сметките за плаќање.',
          'Податоците за производите се извезуваат во формат што го чита друг систем.',
        ],
      },
      {
        t: 'quote',
        s: 'Продавница што не можете да ја напуштите не е платформа; тоа е заложништво со месечна претплата.',
      },
      {
        t: 'p',
        s: 'Shopify е многу добар одговор за доста фирми и ќе ви кажам кога е за вашата. Custom изработка си ја оправдува цената кога правилата на вашата фирма не се собираат во шаблон — големопродажни ценовници, сложени варијанти, тек на нарачка каков што нема никој друг.',
      },
    ],
  },
];

export const articles: Record<Lang, Article[]> = { en, el, mk };

export function getArticle(lang: Lang, slug: string): Article | undefined {
  return articles[lang].find((a) => a.slug === slug);
}
