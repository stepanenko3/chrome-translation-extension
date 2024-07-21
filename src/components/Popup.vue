<template>
    <div
        class="fixed z-[9999999] bg-black bg-opacity-50 inset-0 flex flex-col items-center justify-center p-3"
        @click.self="closePopup"
    >
        <div
            class="bg-gray-100 dark:bg-gray-700 rounded-xl p-5 w-[500px] max-w-full shadow-lg text-gray-900 dark:text-gray-100 overflow-auto relative"
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

            <div class="relative mt-2 bg-white dark:bg-gray-900 p-3 text-sm rounded-lg">
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
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, defineEmits } from "vue";

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

const emit = defineEmits(["close"]);

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
    af: { translate: "Vertaal", loading: "Laai...", auto: "Auto" },
    sq: { translate: "Përkthe", loading: "Duke u ngarkuar...", auto: "Auto" },
    am: { translate: "አስተርጓሚ", loading: "በመጫን ላይ...", auto: "አውቶ" },
    ar: { translate: "ترجمة", loading: "جارٍ التحميل...", auto: "تلقائي" },
    hy: { translate: "Թարգմանել", loading: "Բեռնում...", auto: "Ավտո" },
    az: { translate: "Tərcümə et", loading: "Yüklənir...", auto: "Avto" },
    eu: { translate: "Itzuli", loading: "Kargatzen...", auto: "Auto" },
    be: { translate: "Перакласці", loading: "Загрузка...", auto: "Аўто" },
    bn: { translate: "অনুবাদ", loading: "লোড হচ্ছে...", auto: "অটো" },
    bs: { translate: "Prevedi", loading: "Učitavanje...", auto: "Auto" },
    bg: { translate: "Превеждам", loading: "Зареждане...", auto: "Авто" },
    ca: { translate: "Traduir", loading: "Carregant...", auto: "Automàtic" },
    ceb: { translate: "Hubaron", loading: "Nag-load...", auto: "Auto" },
    zh: { translate: "翻译", loading: "加载中...", auto: "自动" },
    "zh-CN": { translate: "翻译", loading: "加载中...", auto: "自动" },
    "zh-TW": { translate: "翻譯", loading: "載入中...", auto: "自動" },
    co: { translate: "Traduci", loading: "Caricamentu...", auto: "Auto" },
    hr: { translate: "Prevedi", loading: "Učitavanje...", auto: "Auto" },
    cs: { translate: "Přeložit", loading: "Načítání...", auto: "Auto" },
    da: { translate: "Oversæt", loading: "Indlæser...", auto: "Auto" },
    nl: { translate: "Vertalen", loading: "Laden...", auto: "Auto" },
    en: { translate: "Translate", loading: "Loading...", auto: "Auto" },
    eo: { translate: "Traduki", loading: "Ŝargado...", auto: "Aŭtomata" },
    et: { translate: "Tõlkida", loading: "Laadimine...", auto: "Auto" },
    fi: { translate: "Kääntää", loading: "Ladataan...", auto: "Auto" },
    fr: { translate: "Traduire", loading: "Chargement...", auto: "Auto" },
    fy: { translate: "Oersette", loading: "Lade...", auto: "Auto" },
    gl: { translate: "Traducir", loading: "Cargando...", auto: "Auto" },
    ka: { translate: "თარგმნა", loading: "ჩატვირთვა...", auto: "ავტო" },
    de: { translate: "Übersetzen", loading: "Laden...", auto: "Auto" },
    el: { translate: "Μετάφραση", loading: "Φόρτωση...", auto: "Αυτόματο" },
    gu: { translate: "અનુવાદ", loading: "લોડ કરી રહ્યું છે...", auto: "ઓટો" },
    ht: { translate: "Tradui", loading: "Chaje...", auto: "Auto" },
    ha: { translate: "Fassara", loading: "Ana loda...", auto: "Atomatik" },
    haw: { translate: "Unuhi", loading: "Ke hoʻouka nei...", auto: "Aka" },
    he: { translate: "לתרגם", loading: "טוען...", auto: "אוטו" },
    hi: { translate: "अनुवाद करना", loading: "लोड हो रहा है...", auto: "ऑटो" },
    hmn: { translate: "Txhais lus", loading: "Thauj khoom...", auto: "Pib" },
    hu: { translate: "Fordít", loading: "Betöltés...", auto: "Automatikus" },
    is: { translate: "Þýða", loading: "Hleður...", auto: "Sjálfvirkt" },
    ig: { translate: "Tụgharịa", loading: "Na-ebubata...", auto: "Akpaka" },
    id: { translate: "Menerjemahkan", loading: "Memuat...", auto: "Otomatis" },
    ga: { translate: "Aistrigh", loading: "Ag luchtú...", auto: "Auto" },
    it: { translate: "Tradurre", loading: "Caricamento...", auto: "Auto" },
    ja: { translate: "翻訳する", loading: "読み込んでいます...", auto: "自動" },
    jw: { translate: "Nerjemahake", loading: "Ngundhuh...", auto: "Otomatis" },
    kn: { translate: "ಅನುವಾದಿಸು", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", auto: "ಆಟೋ" },
    kk: { translate: "Аудару", loading: "Жүктелуде...", auto: "Авто" },
    km: {
        translate: "បកប្រែ",
        loading: "កំពុងផ្ទុក...",
        auto: "ស្វ័យប្រវត្តិ",
    },
    rw: { translate: "Hindura", loading: "Birimo...", auto: "Auto" },
    ko: { translate: "번역하다", loading: "로드 중...", auto: "자동" },
    ku: { translate: "Wergerrîn", loading: "Bar dike...", auto: "Otomatîk" },
    ky: { translate: "Которуу", loading: "Жүктөлүүдө...", auto: "Авто" },
    lo: { translate: "ປ່ຽນພາສາ", loading: "ກຳລັງໂຫຼດ...", auto: "ອັດຕະໂນມັດ" },
    la: { translate: "Transferre", loading: "Loading...", auto: "Auto" },
    lv: { translate: "Tulkot", loading: "Notiek ielāde...", auto: "Auto" },
    lt: { translate: "Išversti", loading: "Įkeliama...", auto: "Automatinis" },
    lb: { translate: "Iwwersetzen", loading: "Lueden...", auto: "Auto" },
    mk: { translate: "Преведи", loading: "Се вчитува...", auto: "Автоматски" },
    mg: { translate: "Adika", loading: "Alohaina...", auto: "Auto" },
    ms: { translate: "Menterjemah", loading: "Memuatkan...", auto: "Auto" },
    ml: { translate: "പരിഭാഷിക്കുക", loading: "ലോഡാകുന്നു...", auto: "ഓട്ടോ" },
    mt: { translate: "Irranġar", loading: "Tagħbija...", auto: "Auto" },
    mi: {
        translate: "Whakamaoritia",
        loading: "Kei te utaina...",
        auto: "Aunoa",
    },
    mr: { translate: "भाषांतर", loading: "लोड करत आहे...", auto: "स्वयंचलित" },
    mn: {
        translate: "Орчуулах",
        loading: "Ачааллаж байна...",
        auto: "Автомат",
    },
    my: {
        translate: "ဘာသာပြန်ဆို",
        loading: "ဖိုင်များအား ဖွင့်နေသည်...",
        auto: "အလိုအလျောက်",
    },
    ne: { translate: "अनुवाद", loading: "लोड हुँदैछ...", auto: "स्वचालित" },
    no: { translate: "Oversette", loading: "Laster...", auto: "Auto" },
    ny: { translate: "Tanthauzirani", loading: "Ikukweza...", auto: "Auto" },
    or: { translate: "ଅନୁବାଦ", loading: "ଲୋଡ୍‌ ହେଉଛି...", auto: "ସ୍ୱୟଂଚାଳିତ" },
    ps: { translate: "ژباړه کول", loading: "بارول...", auto: "اتومات" },
    fa: {
        translate: "ترجمه کردن",
        loading: "در حال بارگذاری...",
        auto: "خودکار",
    },
    pl: { translate: "Tłumaczyć", loading: "Ładowanie...", auto: "Auto" },
    pt: { translate: "Traduzir", loading: "Carregando...", auto: "Automático" },
    pa: { translate: "ਅਨੁਵਾਦ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", auto: "ਆਟੋ" },
    ro: { translate: "Traduce", loading: "Se încarcă...", auto: "Automat" },
    ru: { translate: "Переводить", loading: "Загрузка...", auto: "Авто" },
    sm: { translate: "Faʻaliliu", loading: "Utaina...", auto: "Auto" },
    gd: {
        translate: "Eadar-theangachadh",
        loading: "A’ luchdachadh...",
        auto: "Fèin-ghluasadach",
    },
    sr: { translate: "Превести", loading: "Учитавање...", auto: "Ауто" },
    st: { translate: "Fetolela", loading: "Ho jarolla...", auto: "Auto" },
    sn: { translate: "Dudziro", loading: "Kurodha...", auto: "Auto" },
    sd: { translate: "ترجمو", loading: "لوڊ ٿي رهيو آهي...", auto: "خود" },
    si: {
        translate: "පරිවර්තනය",
        loading: "පූරණය වෙමින්...",
        auto: "ස්වයංක්‍රිය",
    },
    sk: { translate: "Preložiť", loading: "Načítava...", auto: "Auto" },
    sl: { translate: "Prevesti", loading: "Nalaganje...", auto: "Samodejno" },
    so: { translate: "Tarjum", loading: "Raritaanka...", auto: "Auto" },
    es: { translate: "Traducir", loading: "Cargando...", auto: "Auto" },
    su: { translate: "Nerjemahkeun", loading: "Ngamuat...", auto: "Otomatis" },
    sw: { translate: "Tafsiri", loading: "Inapakia...", auto: "Auto" },
    sv: { translate: "Översätta", loading: "Läser in...", auto: "Auto" },
    tl: { translate: "Isalin", loading: "Naglo-load...", auto: "Auto" },
    tg: { translate: "Тарҷума", loading: "Боргузорӣ...", auto: "Авто" },
    ta: { translate: "மொழிபெயர்", loading: "ஏற்றுகிறது...", auto: "தானியங்கி" },
    tt: { translate: "Тәрҗемә итәргә", loading: "Йөкләнә...", auto: "Авто" },
    te: { translate: "అనువదించు", loading: "లోడ్ అవుతోంది...", auto: "ఆటో" },
    th: { translate: "แปล", loading: "กำลังโหลด...", auto: "อัตโนมัติ" },
    tr: { translate: "Çevir", loading: "Yükleniyor...", auto: "Otomatik" },
    tk: {
        translate: "Terjime etmek",
        loading: "Ýüklenýär...",
        auto: "Awtomat",
    },
    uk: { translate: "Перекласти", loading: "Завантаження...", auto: "Авто" },
    ur: { translate: "ترجمہ کریں", loading: "لوڈ ہو رہا ہے...", auto: "خود" },
    ug: { translate: "تەرجمە", loading: "يۈكلەۋاتىدۇ...", auto: "ئاپتوماتىك" },
    uz: {
        translate: "Tarjima qilish",
        loading: "Yuklanmoqda...",
        auto: "Avto",
    },
    vi: { translate: "Dịch", loading: "Đang tải...", auto: "Tự động" },
    cy: { translate: "Cyfieithu", loading: "Yn llwytho...", auto: "Auto" },
    xh: { translate: "Guqulela", loading: "Iyalayisha...", auto: "Auto" },
    yi: { translate: "זייַ געזונט", loading: "לאָודינג...", auto: "אָטאָ" },
    yo: { translate: "Itumọ", loading: "Ikojọpọ...", auto: "Aifọwọyi" },
    zu: {
        translate: "Humusha",
        loading: "Kulayisha...",
        auto: "Okuzenzakalelayo",
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

onMounted(async () => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);

    fetchTranslation();
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
