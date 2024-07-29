<template>
    <div
        class="fixed z-[9999999] bg-black bg-opacity-50 inset-0 flex flex-col items-center justify-center p-3"
        @click.self="closePopup"
    >
        <div
            class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-5 w-[500px] max-w-full shadow-lg text-gray-900 dark:text-gray-100 overflow-auto relative"
        >
            <button
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                @click="closePopup"
            >
                <svg
                    class="w-6 h-6 fill-gray-100 stroke-gray-400 hover:stroke-gray-900 dark:fill-gray-700 dark:stroke-gray-400 dark:hover:stroke-gray-100 transition"
                    viewBox="0 0 21 21"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="8.5" cy="8.5" r="8" />
                    <path d="m5.5 11.5 6-6" />

                    <path d="m5.5 5.5 6 6" />
                </svg>
            </button>
            <div
                class="flex items-center justify-center text-center font-bold text-sm mb-4"
            >
                {{ getTranslation("translate") }}
            </div>

            <div
                class="inline-flex bg-white dark:bg-gray-900 py-1.5 px-2.5 rounded-lg text-xs text-gray-400 mb-2 uppercase"
            >
                {{
                    response?.src &&
                    languages?.[response.src as keyof typeof languages]
                        ? languages[response.src as keyof typeof languages]
                        : getTranslation("auto")
                }}
            </div>

            <div class="bg-white dark:bg-gray-900 p-3 rounded-lg text-sm mb-4">
                {{ selectedText }}
            </div>

            <div
                class="relative text-xs text-gray-400 uppercase bg-white dark:bg-gray-900 rounded-lg inline-flex cursor-pointer"
                :class="{
                    'opacity-50 pointer-events-none': loading,
                }"
            >
                <select
                    v-model="targetLang"
                    class="appearance-none py-1.5 pl-2.5 pr-8 bg-transparent"
                >
                    <option
                        v-for="(lang, code) in languages"
                        :key="code"
                        :value="code"
                        :disabled="code === response?.src"
                    >
                        {{ lang }}
                    </option>
                </select>
                <svg
                    class="absolute top-1/2 right-3 w-4 h-4 pointer-events-none transform -translate-y-1/2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>

            <div
                class="relative mt-2 bg-white dark:bg-gray-900 p-3 text-sm rounded-lg"
            >
                <div
                    v-if="loading"
                    class="flex items-center justify-center rounded-lg"
                    :class="{
                        'absolute inset-0 bg-gray-100/20 dark:bg-gray-700/20 backdrop-blur':
                            translatedText,
                    }"
                >
                    <svg
                        aria-hidden="true"
                        class="w-7 h-7 text-gray-400 animate-spin dark:text-gray-600 fill-gray-900 dark:fill-white mx-auto"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>

                <template v-if="translatedText">
                    {{ translatedText }}
                </template>
            </div>

            <div class="grid gap-3 mt-5">
                <button
                    class="bg-gray-300 text-gray-900 rounded-lg px-4 py-2 w-full hover:bg-gray-400 transition text-center"
                    :class="{
                        'opacity-50 pointer-events-none': loading || copied,
                    }"
                    @click.prevent="copyToClipboard"
                >
                    <span v-if="copied"> ✔️ </span>
                    <span v-else>
                        {{ getTranslation("copyToClipboard") }}
                    </span>
                </button>
                <!-- <button
                    class="bg-gray-300 text-gray-900 rounded-lg px-4 py-2 w-full hover:bg-gray-400 transition text-center"
                    @click.prevent="replaceText"
                >
                    {{ getTranslation("replaceText") }}
                </button> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ref,
    onMounted,
    onUnmounted,
    onBeforeUnmount,
    watch,
    defineEmits,
} from "vue";

interface ModelTracking {
    checkpoint_md5: string;
    launch_doc: string;
}

interface TranslationEngineDebugInfo {
    model_tracking: ModelTracking;
}

interface Sentence {
    trans: string;
    orig: string;
    backend: number;
    model_specification?: Array<object>;
    translation_engine_debug_info?: Array<TranslationEngineDebugInfo>;
}

interface LDResult {
    srclangs: Array<string>;
    srclangs_confidences: Array<number>;
    extended_srclangs: Array<string>;
}

interface TranslateApiResponse {
    sentences: Array<Sentence>;
    src: string;
    confidence: number;
    spell?: object;
    ld_result: LDResult;
}

const props = defineProps<{
    selectedText: string;
}>();

const emit = defineEmits(["close", "replace"]);

const defaultResponse = {
    sentences: [],
    src: "",
    confidence: 0,
    ld_result: {
        srclangs: [],
        srclangs_confidences: [],
        extended_srclangs: [],
    },
};

const response = ref<TranslateApiResponse>(defaultResponse);
const translatedText = ref<string>("");
const loading = ref<boolean>(true);
const targetLang = ref<string>("en");
const copied = ref<boolean>(false);

const languages: { [key: string]: string } = {
    af: "Afrikaans",
    sq: "Shqip",
    am: "አማርኛ",
    ar: "العربية",
    hy: "Հայերեն",
    az: "Azərbaycanca",
    eu: "Euskara",
    be: "Беларуская",
    bn: "বাংলা",
    bs: "Bosanski",
    bg: "Български",
    ca: "Català",
    ceb: "Cebuano",
    zh: "中文",
    "zh-CN": "中文（简体）",
    "zh-TW": "中文（繁體）",
    co: "Corsu",
    hr: "Hrvatski",
    cs: "Čeština",
    da: "Dansk",
    nl: "Nederlands",
    en: "English",
    eo: "Esperanto",
    et: "Eesti",
    fi: "Suomi",
    fr: "Français",
    fy: "Frysk",
    gl: "Galego",
    ka: "ქართული",
    de: "Deutsch",
    el: "Ελληνικά",
    gu: "ગુજરાતી",
    ht: "Kreyòl Ayisyen",
    ha: "Hausa",
    haw: "ʻŌlelo Hawaiʻi",
    he: "עברית",
    hi: "हिन्दी",
    hmn: "Hmoob",
    hu: "Magyar",
    is: "Íslenska",
    ig: "Igbo",
    id: "Indonesia",
    ga: "Gaeilge",
    it: "Italiano",
    ja: "日本語",
    jw: "Basa Jawa",
    kn: "ಕನ್ನಡ",
    kk: "Қазақша",
    km: "ភាសាខ្មែរ",
    rw: "Kinyarwanda",
    ko: "한국어",
    ku: "Kurdî",
    ky: "Кыргызча",
    lo: "ລາວ",
    la: "Latina",
    lv: "Latviešu",
    lt: "Lietuvių",
    lb: "Lëtzebuergesch",
    mk: "Македонски",
    mg: "Malagasy",
    ms: "Bahasa Melayu",
    ml: "മലയാളം",
    mt: "Malti",
    mi: "Māori",
    mr: "मराठी",
    mn: "Монгол",
    my: "မြန်မာစာ",
    ne: "नेपाली",
    no: "Norsk",
    ny: "Chichewa",
    or: "ଓଡ଼ିଆ",
    ps: "پښتو",
    fa: "فارسی",
    pl: "Polski",
    pt: "Português",
    pa: "ਪੰਜਾਬੀ",
    ro: "Română",
    ru: "Русский",
    sm: "Gagana Samoa",
    gd: "Gàidhlig",
    sr: "Српски",
    st: "Sesotho",
    sn: "Shona",
    sd: "سنڌي",
    si: "සිංහල",
    sk: "Slovenčina",
    sl: "Slovenščina",
    so: "Soomaali",
    es: "Español",
    su: "Basa Sunda",
    sw: "Kiswahili",
    sv: "Svenska",
    tl: "Filipino",
    tg: "Тоҷикӣ",
    ta: "தமிழ்",
    tt: "Татар",
    te: "తెలుగు",
    th: "ไทย",
    tr: "Türkçe",
    tk: "Türkmen",
    uk: "Українська",
    ur: "اردو",
    ug: "ئۇيغۇرچە",
    uz: "Oʻzbek",
    vi: "Tiếng Việt",
    cy: "Cymraeg",
    xh: "isiXhosa",
    yi: "ייִדיש",
    yo: "Yorùbá",
    zu: "isiZulu",
};

const translations: { [key: string]: { [key: string]: string } } = {
    af: {
        translate: "Vertaal",
        loading: "Laai...",
        auto: "Auto",
        copyToClipboard: "Kopieer na knipbord",
        replaceText: "Vervang teks",
    },
    sq: {
        translate: "Përkthe",
        loading: "Duke u ngarkuar...",
        auto: "Auto",
        copyToClipboard: "Kopjo në të ndërtuar",
        replaceText: "Zëvendëso tekstin",
    },
    am: {
        translate: "አስተርጓሚ",
        loading: "በመጫን ላይ...",
        auto: "አውቶ",
        copyToClipboard: "ወደ ቅንጥብ ገፅ ቅዳ",
        replaceText: "ጽሑፍን ተካ",
    },
    ar: {
        translate: "ترجمة",
        loading: "جارٍ التحميل...",
        auto: "تلقائي",
        copyToClipboard: "نسخ إلى الحافظة",
        replaceText: "استبدال النص",
    },
    hy: {
        translate: "Թարգմանել",
        loading: "Բեռնում...",
        auto: "Ավտո",
        copyToClipboard: "Պատճենել սեղմաթերթին",
        replaceText: "Փոխարինել տեքստը",
    },
    az: {
        translate: "Tərcümə et",
        loading: "Yüklənir...",
        auto: "Avto",
        copyToClipboard: "Panoya kopyalayın",
        replaceText: "Mətn dəyişdir",
    },
    eu: {
        translate: "Itzuli",
        loading: "Kargatzen...",
        auto: "Auto",
        copyToClipboard: "Arbelean kopiatu",
        replaceText: "Testua ordezkatu",
    },
    be: {
        translate: "Перакласці",
        loading: "Загрузка...",
        auto: "Аўто",
        copyToClipboard: "Капіяваць у буфер абмену",
        replaceText: "Замяніць тэкст",
    },
    bn: {
        translate: "অনুবাদ",
        loading: "লোড হচ্ছে...",
        auto: "অটো",
        copyToClipboard: "ক্লিপবোর্ডে কপি করুন",
        replaceText: "পাঠ্য প্রতিস্থাপন করুন",
    },
    bs: {
        translate: "Prevedi",
        loading: "Učitavanje...",
        auto: "Auto",
        copyToClipboard: "Kopiraj u međuspremnik",
        replaceText: "Zamijenite tekst",
    },
    bg: {
        translate: "Превеждам",
        loading: "Зареждане...",
        auto: "Авто",
        copyToClipboard: "Копиране в клипборд",
        replaceText: "Замяна на текст",
    },
    ca: {
        translate: "Traduir",
        loading: "Carregant...",
        auto: "Automàtic",
        copyToClipboard: "Copia al porta-retalls",
        replaceText: "Substitueix el text",
    },
    ceb: {
        translate: "Hubaron",
        loading: "Nag-load...",
        auto: "Auto",
        copyToClipboard: "Kopyahin sa clipboard",
        replaceText: "Palitan ang teksto",
    },
    zh: {
        translate: "翻译",
        loading: "加载中...",
        auto: "自动",
        copyToClipboard: "复制到剪贴板",
        replaceText: "替换文本",
    },
    "zh-CN": {
        translate: "翻译",
        loading: "加载中...",
        auto: "自动",
        copyToClipboard: "复制到剪贴板",
        replaceText: "替换文本",
    },
    "zh-TW": {
        translate: "翻譯",
        loading: "載入中...",
        auto: "自動",
        copyToClipboard: "複製到剪貼簿",
        replaceText: "替換文字",
    },
    co: {
        translate: "Traduci",
        loading: "Caricamentu...",
        auto: "Auto",
        copyToClipboard: "Copia in clipboard",
        replaceText: "Sostituisci testo",
    },
    hr: {
        translate: "Prevedi",
        loading: "Učitavanje...",
        auto: "Auto",
        copyToClipboard: "Kopiraj u međuspremnik",
        replaceText: "Zamijenite tekst",
    },
    cs: {
        translate: "Přeložit",
        loading: "Načítání...",
        auto: "Auto",
        copyToClipboard: "Kopírovat do schránky",
        replaceText: "Nahradit text",
    },
    da: {
        translate: "Oversæt",
        loading: "Indlæser...",
        auto: "Auto",
        copyToClipboard: "Kopier til udklipsholder",
        replaceText: "Erstat tekst",
    },
    nl: {
        translate: "Vertalen",
        loading: "Laden...",
        auto: "Auto",
        copyToClipboard: "Kopiëren naar klembord",
        replaceText: "Vervang tekst",
    },
    en: {
        translate: "Translate",
        loading: "Loading...",
        auto: "Auto",
        copyToClipboard: "Copy to clipboard",
        replaceText: "Replace text",
    },
    eo: {
        translate: "Traduki",
        loading: "Ŝargado...",
        auto: "Aŭtomata",
        copyToClipboard: "Kopii al tondujo",
        replaceText: "Anstataŭigi tekston",
    },
    et: {
        translate: "Tõlkida",
        loading: "Laadimine...",
        auto: "Auto",
        copyToClipboard: "Kopeeri lõikelauale",
        replaceText: "Asenda tekst",
    },
    fi: {
        translate: "Kääntää",
        loading: "Ladataan...",
        auto: "Auto",
        copyToClipboard: "Kopioi leikepöydälle",
        replaceText: "Korvaa teksti",
    },
    fr: {
        translate: "Traduire",
        loading: "Chargement...",
        auto: "Auto",
        copyToClipboard: "Copier dans le presse-papiers",
        replaceText: "Remplacer le texte",
    },
    fy: {
        translate: "Oersette",
        loading: "Lade...",
        auto: "Auto",
        copyToClipboard: "Kopiëarje nei klamboerd",
        replaceText: "Ferfange tekst",
    },
    gl: {
        translate: "Traducir",
        loading: "Cargando...",
        auto: "Auto",
        copyToClipboard: "Copiar ao portapapeis",
        replaceText: "Substituír o texto",
    },
    ka: {
        translate: "თარგმნა",
        loading: "ჩატვირთვა...",
        auto: "ავტო",
        copyToClipboard: "კოპირება ბუფერში",
        replaceText: "ტექსტის შეცვლა",
    },
    de: {
        translate: "Übersetzen",
        loading: "Laden...",
        auto: "Auto",
        copyToClipboard: "In die Zwischenablage kopieren",
        replaceText: "Text ersetzen",
    },
    el: {
        translate: "Μετάφραση",
        loading: "Φόρτωση...",
        auto: "Αυτόματο",
        copyToClipboard: "Αντιγραφή στο πρόχειρο",
        replaceText: "Αντικατάσταση κειμένου",
    },
    gu: {
        translate: "અનુવાદ",
        loading: "લોડ કરી રહ્યું છે...",
        auto: "ઓટો",
        copyToClipboard: "ક્લિપબોર્ડમાં નકલ કરો",
        replaceText: "ટેક્સ્ટ બદલો",
    },
    ht: {
        translate: "Tradui",
        loading: "Chaje...",
        auto: "Auto",
        copyToClipboard: "Kopi nan clipboard",
        replaceText: "Ranplase tèks",
    },
    ha: {
        translate: "Fassara",
        loading: "Ana loda...",
        auto: "Atomatik",
        copyToClipboard: "Kwafi zuwa allo",
        replaceText: "Maye gurbin rubutu",
    },
    haw: {
        translate: "Unuhi",
        loading: "Ke hoʻouka nei...",
        auto: "Aka",
        copyToClipboard: "Kope i ka papa kūkala",
        replaceText: "Hoʻololi i ka kikokikona",
    },
    he: {
        translate: "לתרגם",
        loading: "טוען...",
        auto: "אוטו",
        copyToClipboard: "העתק ללוח",
        replaceText: "החלף טקסט",
    },
    hi: {
        translate: "अनुवाद करना",
        loading: "लोड हो रहा है...",
        auto: "ऑटो",
        copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
        replaceText: "पाठ बदलें",
    },
    hmn: {
        translate: "Txhais lus",
        loading: "Thauj khoom...",
        auto: "Pib",
        copyToClipboard: "Luam rau phaj ntawv",
        replaceText: "Hloov cov ntawv nyeem",
    },
    hu: {
        translate: "Fordít",
        loading: "Betöltés...",
        auto: "Automatikus",
        copyToClipboard: "Másolás a vágólapra",
        replaceText: "Cserélje ki a szöveget",
    },
    is: {
        translate: "Þýða",
        loading: "Hleður...",
        auto: "Sjálfvirkt",
        copyToClipboard: "Afrita í klippiborð",
        replaceText: "Skipta um texta",
    },
    ig: {
        translate: "Tụgharịa",
        loading: "Na-ebubata...",
        auto: "Akpaka",
        copyToClipboard: "Detuo na Clipboard",
        replaceText: "Dochie ederede",
    },
    id: {
        translate: "Menerjemahkan",
        loading: "Memuat...",
        auto: "Otomatis",
        copyToClipboard: "Salin ke clipboard",
        replaceText: "Ganti teks",
    },
    ga: {
        translate: "Aistrigh",
        loading: "Ag luchtú...",
        auto: "Auto",
        copyToClipboard: "Cóipeáil chuig gearrthaisce",
        replaceText: "Ionadaigh téacs",
    },
    it: {
        translate: "Tradurre",
        loading: "Caricamento...",
        auto: "Auto",
        copyToClipboard: "Copia negli appunti",
        replaceText: "Sostituisci testo",
    },
    ja: {
        translate: "翻訳する",
        loading: "読み込んでいます...",
        auto: "自動",
        copyToClipboard: "クリップボードにコピー",
        replaceText: "テキストを置き換える",
    },
    jw: {
        translate: "Nerjemahake",
        loading: "Ngundhuh...",
        auto: "Otomatis",
        copyToClipboard: "Salin menyang clipboard",
        replaceText: "Ganti teks",
    },
    kn: {
        translate: "ಅನುವಾದಿಸು",
        loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        auto: "ಆಟೋ",
        copyToClipboard: "ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸು",
        replaceText: "ಪಠ್ಯವನ್ನು ಬದಲಿಸು",
    },
    kk: {
        translate: "Аудару",
        loading: "Жүктелуде...",
        auto: "Авто",
        copyToClipboard: "Алмасу буферіне көшіру",
        replaceText: "Мәтінді ауыстыру",
    },
    km: {
        translate: "បកប្រែ",
        loading: "កំពុងផ្ទុក...",
        auto: "ស្វ័យប្រវត្តិ",
        copyToClipboard: "ចម្លងទៅកាន់ក្តារតំលើង",
        replaceText: "ជំនួសអត្ថបទ",
    },
    rw: {
        translate: "Hindura",
        loading: "Birimo...",
        auto: "Auto",
        copyToClipboard: "Kopera kuri clipboard",
        replaceText: "Hindura inyandiko",
    },
    ko: {
        translate: "번역하다",
        loading: "로드 중...",
        auto: "자동",
        copyToClipboard: "클립보드에 복사",
        replaceText: "텍스트 대체",
    },
    ku: {
        translate: "Wergerrîn",
        loading: "Bar dike...",
        auto: "Otomatîk",
        copyToClipboard: "Kopîyeke û clipboard",
        replaceText: "Navnîşeyê guherîn",
    },
    ky: {
        translate: "Которуу",
        loading: "Жүктөлүүдө...",
        auto: "Авто",
        copyToClipboard: "Буферге көчүрүү",
        replaceText: "Текстти алмаштыруу",
    },
    lo: {
        translate: "ປ່ຽນພາສາ",
        loading: "ກຳລັງໂຫຼດ...",
        auto: "ອັດຕະໂນມັດ",
        copyToClipboard: "ສຳເນົາໃສ່ບອດ",
        replaceText: "ແທນຂໍ້ຄວາມ",
    },
    la: {
        translate: "Transferre",
        loading: "Loading...",
        auto: "Auto",
        copyToClipboard: "Copia in tabula",
        replaceText: "Textum reponere",
    },
    lv: {
        translate: "Tulkot",
        loading: "Notiek ielāde...",
        auto: "Auto",
        copyToClipboard: "Kopēt uz starpliktuvi",
        replaceText: "Aizstāt tekstu",
    },
    lt: {
        translate: "Išversti",
        loading: "Įkeliama...",
        auto: "Automatinis",
        copyToClipboard: "Kopijuoti į mainų sritį",
        replaceText: "Pakeisti tekstą",
    },
    lb: {
        translate: "Iwwersetzen",
        loading: "Lueden...",
        auto: "Auto",
        copyToClipboard: "An d'Zwëschenoflag kopéieren",
        replaceText: "Text ersetzen",
    },
    mk: {
        translate: "Преведи",
        loading: "Се вчитува...",
        auto: "Автоматски",
        copyToClipboard: "Копирај во привремена меморија",
        replaceText: "Заменете го текстот",
    },
    mg: {
        translate: "Adika",
        loading: "Alohaina...",
        auto: "Auto",
        copyToClipboard: "Adika amin'ny clipboards",
        replaceText: "Hanova lahatsoratra",
    },
    ms: {
        translate: "Menterjemah",
        loading: "Memuatkan...",
        auto: "Auto",
        copyToClipboard: "Salin ke papan klip",
        replaceText: "Ganti teks",
    },
    ml: {
        translate: "പരിഭാഷിക്കുക",
        loading: "ലോഡാകുന്നു...",
        auto: "ഓട്ടോ",
        copyToClipboard: "ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തുക",
        replaceText: "വാചകം മാറ്റുക",
    },
    mt: {
        translate: "Irranġar",
        loading: "Tagħbija...",
        auto: "Auto",
        copyToClipboard: "Kopja għall-clipboard",
        replaceText: "Sostitwixxi t-test",
    },
    mi: {
        translate: "Whakamaoritia",
        loading: "Kei te utaina...",
        auto: "Aunoa",
        copyToClipboard: "Kape ki te papapātuhi",
        replaceText: "Whakakapihia te tuhinga",
    },
    mr: {
        translate: "भाषांतर",
        loading: "लोड करत आहे...",
        auto: "स्वयंचलित",
        copyToClipboard: "क्लिपबोर्डवर कॉपी करा",
        replaceText: "मजकूर बदला",
    },
    mn: {
        translate: "Орчуулах",
        loading: "Ачааллаж байна...",
        auto: "Автомат",
        copyToClipboard: "Хуулах самбар руу",
        replaceText: "Текстийг солих",
    },
    my: {
        translate: "ဘာသာပြန်ဆို",
        loading: "ဖိုင်များအား ဖွင့်နေသည်...",
        auto: "အလိုအလျောက်",
        copyToClipboard: "ကလစ်ဘုတ်သို့ကူးရန်",
        replaceText: "စာသားကိုအစားထိုးပါ",
    },
    ne: {
        translate: "अनुवाद",
        loading: "लोड हुँदैछ...",
        auto: "स्वचालित",
        copyToClipboard: "क्लिपबोर्डमा प्रतिलिपि गर्नुहोस्",
        replaceText: "पाठ प्रतिस्थापन गर्नुहोस्",
    },
    no: {
        translate: "Oversette",
        loading: "Laster...",
        auto: "Auto",
        copyToClipboard: "Kopier til utklippstavle",
        replaceText: "Erstatt tekst",
    },
    ny: {
        translate: "Tanthauzirani",
        loading: "Ikukweza...",
        auto: "Auto",
        copyToClipboard: "Lembani ku clipboard",
        replaceText: "Sinthani zolemba",
    },
    or: {
        translate: "ଅନୁବାଦ",
        loading: "ଲୋଡ୍‌ ହେଉଛି...",
        auto: "ସ୍ୱୟଂଚାଳିତ",
        copyToClipboard: "କ୍ଲିପବୋର୍ଡ୍କୁ କପି କରନ୍ତୁ",
        replaceText: "ପାଠ୍ୟ ପରିବର୍ତ୍ତନ କରନ୍ତୁ",
    },
    ps: {
        translate: "ژباړه کول",
        loading: "بارول...",
        auto: "اتومات",
        copyToClipboard: "کاپي کولو ته کاپي کړئ",
        replaceText: "متن بدل کړئ",
    },
    fa: {
        translate: "ترجمه کردن",
        loading: "در حال بارگذاری...",
        auto: "خودکار",
        copyToClipboard: "کپی به کلیپ بورد",
        replaceText: "جایگزینی متن",
    },
    pl: {
        translate: "Tłumaczyć",
        loading: "Ładowanie...",
        auto: "Auto",
        copyToClipboard: "Kopiuj do schowka",
        replaceText: "Zastąp tekst",
    },
    pt: {
        translate: "Traduzir",
        loading: "Carregando...",
        auto: "Automático",
        copyToClipboard: "Copiar para a área de transferência",
        replaceText: "Substituir texto",
    },
    pa: {
        translate: "ਅਨੁਵਾਦ",
        loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
        auto: "ਆਟੋ",
        copyToClipboard: "ਕਲਿੱਪਬੋਰਡ ਵਿੱਚ ਨਕਲ ਕਰੋ",
        replaceText: "ਪਾਠ ਬਦਲੋ",
    },
    ro: {
        translate: "Traduce",
        loading: "Se încarcă...",
        auto: "Automat",
        copyToClipboard: "Copiază în clipboard",
        replaceText: "Înlocuiți textul",
    },
    ru: {
        translate: "Переводить",
        loading: "Загрузка...",
        auto: "Авто",
        copyToClipboard: "Копировать в буфер обмена",
        replaceText: "Заменить текст",
    },
    sm: {
        translate: "Faʻaliliu",
        loading: "Utaina...",
        auto: "Auto",
        copyToClipboard: "Kopi i le papatisi",
        replaceText: "Suia le tusitusiga",
    },
    gd: {
        translate: "Eadar-theangachadh",
        loading: "A’ luchdachadh...",
        auto: "Fèin-ghluasadach",
        copyToClipboard: "Dèan lethbhreac gu bòrd-geàrr",
        replaceText: "Cuir àite air teacsa",
    },
    sr: {
        translate: "Превести",
        loading: "Учитавање...",
        auto: "Ауто",
        copyToClipboard: "Копирај у привремену меморију",
        replaceText: "Замените текст",
    },
    st: {
        translate: "Fetolela",
        loading: "Ho jarolla...",
        auto: "Auto",
        copyToClipboard: "Kopitsa ho clipboard",
        replaceText: "Nka sebaka sengolo",
    },
    sn: {
        translate: "Dudziro",
        loading: "Kurodha...",
        auto: "Auto",
        copyToClipboard: "Kopa ku clipboard",
        replaceText: "Tsanangura zvinyorwa",
    },
    sd: {
        translate: "ترجمو",
        loading: "لوڊ ٿي رهيو آهي...",
        auto: "خود",
        copyToClipboard: "ڪاپي بورڊ تي ڪاپي ڪريو",
        replaceText: "متن مٽايو",
    },
    si: {
        translate: "පරිවර්තනය",
        loading: "පූරණය වෙමින්...",
        auto: "ස්වයංක්‍රිය",
        copyToClipboard: "කොපි පුවරුවට පිටපත් කරන්න",
        replaceText: "පෙළ ප්‍රතිස්ථාපනය කරන්න",
    },
    sk: {
        translate: "Preložiť",
        loading: "Načítava...",
        auto: "Auto",
        copyToClipboard: "Kopírovať do schránky",
        replaceText: "Nahradiť text",
    },
    sl: {
        translate: "Prevesti",
        loading: "Nalaganje...",
        auto: "Samodejno",
        copyToClipboard: "Kopiraj v odložišče",
        replaceText: "Zamenjaj besedilo",
    },
    so: {
        translate: "Tarjum",
        loading: "Raritaanka...",
        auto: "Auto",
        copyToClipboard: "Nuqul ku dheji clipboard-ka",
        replaceText: "Bedel qoraalka",
    },
    es: {
        translate: "Traducir",
        loading: "Cargando...",
        auto: "Auto",
        copyToClipboard: "Copiar al portapapeles",
        replaceText: "Reemplazar texto",
    },
    su: {
        translate: "Nerjemahkeun",
        loading: "Ngamuat...",
        auto: "Otomatis",
        copyToClipboard: "Salin ka clipboard",
        replaceText: "Ganti téks",
    },
    sw: {
        translate: "Tafsiri",
        loading: "Inapakia...",
        auto: "Auto",
        copyToClipboard: "Nakili kwenye ubao wa kunakili",
        replaceText: "Badilisha maandishi",
    },
    sv: {
        translate: "Översätta",
        loading: "Läser in...",
        auto: "Auto",
        copyToClipboard: "Kopiera till urklipp",
        replaceText: "Ersätt text",
    },
    tl: {
        translate: "Isalin",
        loading: "Naglo-load...",
        auto: "Auto",
        copyToClipboard: "Kopyahin sa clipboard",
        replaceText: "Palitan ang teksto",
    },
    tg: {
        translate: "Тарҷума",
        loading: "Боргузорӣ...",
        auto: "Авто",
        copyToClipboard: "Нусхабардорӣ ба буфер",
        replaceText: "Матни ивазкунӣ",
    },
    ta: {
        translate: "மொழிபெயர்",
        loading: "ஏற்றுகிறது...",
        auto: "தானியங்கி",
        copyToClipboard: "கிளிப்போர்டுக்கு நகலெடுக்கவும்",
        replaceText: "உரை மாற்றவும்",
    },
    tt: {
        translate: "Тәрҗемә итәргә",
        loading: "Йөкләнә...",
        auto: "Авто",
        copyToClipboard: "Буферга күчерергә",
        replaceText: "Текстны алыштыру",
    },
    te: {
        translate: "అనువదించు",
        loading: "లోడ్ అవుతోంది...",
        auto: "ఆటో",
        copyToClipboard: "క్లిప్‌బోర్డ్‌కు కాపీ చేయండి",
        replaceText: "పాఠ్యాన్ని మారించు",
    },
    th: {
        translate: "แปล",
        loading: "กำลังโหลด...",
        auto: "อัตโนมัติ",
        copyToClipboard: "คัดลอกไปยังคลิปบอร์ด",
        replaceText: "แทนที่ข้อความ",
    },
    tr: {
        translate: "Çevir",
        loading: "Yükleniyor...",
        auto: "Otomatik",
        copyToClipboard: "Panoya kopyala",
        replaceText: "Metni değiştir",
    },
    tk: {
        translate: "Terjime etmek",
        loading: "Ýüklenýär...",
        auto: "Awtomat",
        copyToClipboard: "Clipboarda göçüriň",
        replaceText: "Teksti çalyş",
    },
    uk: {
        translate: "Перекласти",
        loading: "Завантаження...",
        auto: "Авто",
        copyToClipboard: "Скопіювати в буфер обміну",
        replaceText: "Замінити текст",
    },
    ur: {
        translate: "ترجمہ کریں",
        loading: "لوڈ ہو رہا ہے...",
        auto: "خود",
        copyToClipboard: "کلپ بورڈ پر کاپی کریں",
        replaceText: "متن کو تبدیل کریں",
    },
    ug: {
        translate: "تەرجمە",
        loading: "يۈكلەۋاتىدۇ...",
        auto: "ئاپتوماتىك",
        copyToClipboard: "كېسىش تاختىسىغا كۆچۈرۈش",
        replaceText: "مۇندەرىجىنى ئورۇنلاشتۇر",
    },
    uz: {
        translate: "Tarjima qilish",
        loading: "Yuklanmoqda...",
        auto: "Avto",
        copyToClipboard: "Clipboardga nusxalash",
        replaceText: "Matnni almashtirish",
    },
    vi: {
        translate: "Dịch",
        loading: "Đang tải...",
        auto: "Tự động",
        copyToClipboard: "Sao chép vào bảng nhớ tạm",
        replaceText: "Thay thế văn bản",
    },
    cy: {
        translate: "Cyfieithu",
        loading: "Yn llwytho...",
        auto: "Auto",
        copyToClipboard: "Copïo i'r clipfwrdd",
        replaceText: "Amnewid testun",
    },
    xh: {
        translate: "Guqulela",
        loading: "Iyalayisha...",
        auto: "Auto",
        copyToClipboard: "Kopa kwi-clipboard",
        replaceText: "Tshintsha umbhalo",
    },
    yi: {
        translate: "זייַ געזונט",
        loading: "לאָודינג...",
        auto: "אָטאָ",
        copyToClipboard: "קאַפּי צו קליפּבאָרד",
        replaceText: "טעקסט פאַרבייַט",
    },
    yo: {
        translate: "Itumọ",
        loading: "Ikojọpọ...",
        auto: "Aifọwọyi",
        copyToClipboard: "Daakọ si igbimọ",
        replaceText: "Rọpo ọrọ",
    },
    zu: {
        translate: "Humusha",
        loading: "Kulayisha...",
        auto: "Okuzenzakalelayo",
        copyToClipboard: "Kopisha kubhodi lokunameka",
        replaceText: "Faka esikhundleni umbhalo",
    },
};

function getTranslation(key: string): string {
    const lang = targetLang.value;
    return translations[lang]?.[key] || translations["en"][key];
}

function closePopup() {
    emit("close");
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
        closePopup();
    }
}

// function replaceText() {
//     emit("replace", translatedText.value);
// }

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(translatedText.value);
        copied.value = true;

        setTimeout(() => (copied.value = false), 3000);
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
}

// Watch targetLang for changes and save to chrome.storage
watch(
    () => targetLang.value,
    (newValue) => {
        chrome.storage.sync.set({ targetLang: newValue }, () => {
            console.log("Target language saved:", newValue);
        });
    }
);

// Define types for changes and areaName
type StorageAreaName = "sync" | "local" | "managed" | "session";
type StorageChange = {
    oldValue?: string;
    newValue?: string;
};

// Function to handle changes in chrome.storage
const handleStorageChange = (
    changes: { [key: string]: StorageChange },
    areaName: StorageAreaName
) => {
    if (areaName === "sync" && changes.targetLang) {
        targetLang.value = changes.targetLang.newValue!;
        console.log(
            "Target language updated from storage:",
            changes.targetLang.newValue
        );
    }
};

onMounted(async () => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);

    // Load targetLang from chrome.storage when the component mounts
    chrome.storage.sync.get(["targetLang"], (result) => {
        if (result.targetLang) {
            targetLang.value = result.targetLang;
            console.log("Loaded target language:", result.targetLang);
        }
    });

    // Add the storage change listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    fetchTranslation();
});

// Clean up the listener when the component is unmounted
onBeforeUnmount(() => {
    chrome.storage.onChanged.removeListener(handleStorageChange);
});

onUnmounted(() => {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
});

async function fetchTranslation(): Promise<void> {
    loading.value = true;

    try {
        const queryParams = {
            client: "gtx",
            dt: "t",
            dj: "1",
            sl: "auto",
            tl: targetLang.value,
            q: props.selectedText,
        };

        const queryString = new URLSearchParams(queryParams).toString();

        const _response = await fetch(
            `https://translate.googleapis.com/translate_a/single?${queryString}`
        );

        const data: TranslateApiResponse = await _response.json();

        response.value = data;
        translatedText.value = data.sentences
            .map((sentence: Sentence) => sentence.trans)
            .join(" ");
    } catch (error) {
        response.value = defaultResponse;
        translatedText.value = "Failed to translate. Please try again.";
    } finally {
        loading.value = false;
    }
}

watch(targetLang, fetchTranslation);
</script>

<style scoped>
@import "../index.css";
</style>
