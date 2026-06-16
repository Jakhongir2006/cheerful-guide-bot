import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "ru" | "en" | "uz" | "ko";
export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "uz", label: "UZ", flag: "🇺🇿" },
  { code: "ko", label: "KO", flag: "🇰🇷" },
];

type Dict = Record<string, Record<Lang, string>>;

export const DICT: Dict = {
  nav_home: { ru: "Главная", en: "Home", uz: "Bosh sahifa", ko: "홈" },
  nav_rooms: { ru: "Номера", en: "Rooms", uz: "Xonalar", ko: "객실" },
  nav_about: { ru: "О нас", en: "About", uz: "Biz haqimizda", ko: "소개" },
  nav_conference: { ru: "Конференц-залы", en: "Conference", uz: "Konferensiya", ko: "회의실" },
  nav_spa: { ru: "СПА и фитнес", en: "SPA & Fitness", uz: "SPA va fitnes", ko: "스파 & 피트니스" },
  nav_restaurant: { ru: "Ресторан", en: "Restaurant", uz: "Restoran", ko: "레스토랑" },
  nav_contacts: { ru: "Контакты", en: "Contacts", uz: "Aloqa", ko: "연락처" },
  cta_book: { ru: "Забронировать", en: "Book Now", uz: "Bron qilish", ko: "예약하기" },
  cta_book_room: { ru: "Забронировать номер", en: "Book a room", uz: "Xona bron qilish", ko: "객실 예약" },
  cta_reservation: { ru: "Резервация", en: "Reservation", uz: "Rezervatsiya", ko: "예약" },
  cta_view_rooms: { ru: "Посмотреть номера", en: "View rooms", uz: "Xonalarni ko'rish", ko: "객실 보기" },
  cta_find_room: { ru: "Найти номер", en: "Find a room", uz: "Xona topish", ko: "객실 찾기" },
  cta_request: { ru: "Оставить заявку", en: "Request", uz: "So'rov yuborish", ko: "문의하기" },
  cta_call: { ru: "Позвонить", en: "Call", uz: "Qo'ng'iroq", ko: "전화" },
  cta_open_map: { ru: "Открыть на Яндекс.Картах", en: "Open in Yandex Maps", uz: "Yandex xaritada ochish", ko: "지도에서 보기" },
  cta_book_table: { ru: "Забронировать столик", en: "Book a table", uz: "Stol bron qilish", ko: "테이블 예약" },
  cta_get_price: { ru: "Узнать цену", en: "Get price", uz: "Narxni bilish", ko: "가격 문의" },

  hero_kicker: { ru: "4★ Отель · Ташкент", en: "4★ Hotel · Tashkent", uz: "4★ Mehmonxona · Toshkent", ko: "4★ 호텔 · 타슈켄트" },
  hero_desc: {
    ru: "Современный гостиничный комплекс премиум класса в 1 км от Международного аэропорта Ташкента имени Ислама Каримова.",
    en: "A modern premium-class hotel complex 1 km from Tashkent International Airport.",
    uz: "Toshkent xalqaro aeroportidan 1 km masofada joylashgan zamonaviy premium darajadagi mehmonxona majmuasi.",
    ko: "타슈켄트 국제공항에서 1km 거리에 위치한 현대적인 프리미엄 호텔.",
  },
  booking_online: { ru: "Онлайн-бронирование", en: "Online booking", uz: "Onlayn bron qilish", ko: "온라인 예약" },
  guaranteed: { ru: "Гарантированное заселение", en: "Guaranteed check-in", uz: "Kafolatlangan joylashtirish", ko: "보장된 체크인" },

  checkin: { ru: "Заезд", en: "Check-in", uz: "Kirish", ko: "체크인" },
  checkout: { ru: "Выезд", en: "Check-out", uz: "Chiqish", ko: "체크아웃" },
  guests: { ru: "Гости", en: "Guests", uz: "Mehmonlar", ko: "투숙객" },
  nights: { ru: "Ночей", en: "Nights", uz: "Tunlar", ko: "박" },

  step_dates: { ru: "Даты", en: "Dates", uz: "Sanalar", ko: "날짜" },
  step_room: { ru: "Номер", en: "Room", uz: "Xona", ko: "객실" },
  step_upgrade: { ru: "Апгрейд", en: "Upgrade", uz: "Yangilash", ko: "업그레이드" },
  step_details: { ru: "Детали", en: "Details", uz: "Tafsilotlar", ko: "정보" },
  step_done: { ru: "Готово", en: "Done", uz: "Tayyor", ko: "완료" },

  included_badge: {
    ru: "Включено: завтрак + СПА + бассейн",
    en: "Included: breakfast + SPA + pool",
    uz: "Kiritilgan: nonushta + SPA + basseyn",
    ko: "포함: 조식 + 스파 + 수영장",
  },
  room_left: { ru: "Осталось 2 номера!", en: "Only 2 rooms left!", uz: "2 ta xona qoldi!", ko: "2개 객실만 남음!" },
  continue_with_selected: {
    ru: "Продолжить с выбранным номером",
    en: "Continue with selected room",
    uz: "Tanlangan xona bilan davom etish",
    ko: "선택한 객실로 계속",
  },
  upgrade_room: { ru: "Улучшить номер", en: "Upgrade room", uz: "Xonani yaxshilash", ko: "객실 업그레이드" },

  first_name: { ru: "Имя", en: "First Name", uz: "Ism", ko: "이름" },
  last_name: { ru: "Фамилия", en: "Last Name", uz: "Familiya", ko: "성" },
  patronymic: { ru: "Отчество", en: "Patronymic", uz: "Otasining ismi", ko: "부칭" },
  phone: { ru: "Телефон", en: "Phone", uz: "Telefon", ko: "전화번호" },
  email: { ru: "Email", en: "Email", uz: "Email", ko: "이메일" },
  citizenship: { ru: "Гражданство", en: "Citizenship", uz: "Fuqarolik", ko: "국적" },
  consent_offers: {
    ru: "Согласие на спецпредложения",
    en: "I agree to receive special offers",
    uz: "Maxsus takliflarni olishga roziman",
    ko: "특별 혜택 수신 동의",
  },
  consent_data: {
    ru: "Согласие на обработку данных",
    en: "I consent to data processing",
    uz: "Ma'lumotlarni qayta ishlashga roziman",
    ko: "개인정보 처리에 동의",
  },
  best_price_badge: {
    ru: "Лучшая цена на официальном сайте",
    en: "Best price on the official site",
    uz: "Rasmiy saytda eng yaxshi narx",
    ko: "공식 사이트 최저가",
  },
  tourist_tax_note: {
    ru: "Туристический сбор не включён, оплачивается в отеле",
    en: "Tourist tax not included, paid at the hotel",
    uz: "Turistik yig'im kiritilmagan, mehmonxonada to'lanadi",
    ko: "관광세 미포함, 호텔에서 결제",
  },
  subtotal: { ru: "Подытог", en: "Subtotal", uz: "Oraliq jami", ko: "소계" },
  total: { ru: "Итого", en: "Total", uz: "Jami", ko: "합계" },
  price_per_night: { ru: "Цена за ночь", en: "Price per night", uz: "Bir tunlik narx", ko: "1박 가격" },
  continue: { ru: "Продолжить", en: "Continue", uz: "Davom etish", ko: "계속" },
  back: { ru: "Назад", en: "Back", uz: "Orqaga", ko: "뒤로" },
  select: { ru: "Выбрать", en: "Select", uz: "Tanlash", ko: "선택" },

  confirm_title: {
    ru: "Ваша бронь успешно создана!",
    en: "Your booking has been created!",
    uz: "Sizning broningiz muvaffaqiyatli yaratildi!",
    ko: "예약이 성공적으로 생성되었습니다!",
  },
  booking_number: { ru: "Номер брони", en: "Booking number", uz: "Bron raqami", ko: "예약 번호" },
  conf_sent_to: { ru: "Подтверждение отправлено на", en: "Confirmation sent to", uz: "Tasdiq yuborildi", ko: "확인 이메일 발송됨" },
  download_pdf: {
    ru: "Скачать подтверждение (PDF)",
    en: "Download confirmation (PDF)",
    uz: "Tasdiqlashni yuklab olish (PDF)",
    ko: "확인서 다운로드 (PDF)",
  },
  change_dates: { ru: "Изменить даты", en: "Change dates", uz: "Sanalarni o'zgartirish", ko: "날짜 변경" },
  cancel_booking: { ru: "Отмена бронирования", en: "Cancel booking", uz: "Bronni bekor qilish", ko: "예약 취소" },

  rooms_h1: { ru: "100 современных номеров", en: "100 modern rooms", uz: "100 ta zamonaviy xona", ko: "100개의 현대식 객실" },
  rooms_kicker: { ru: "Номера", en: "Rooms", uz: "Xonalar", ko: "객실" },
  about_kicker: { ru: "О нас", en: "About", uz: "Biz haqimizda", ko: "소개" },
  about_h2: {
    ru: "Современный отель премиум класса рядом с аэропортом",
    en: "A modern premium-class hotel near the airport",
    uz: "Aeroport yaqinidagi zamonaviy premium mehmonxona",
    ko: "공항 인근 현대식 프리미엄 호텔",
  },
  about_p1: {
    ru: "Afrosiyob Regency предлагает 100 современных и комфортабельных номеров, а также универсальные конференц-залы для проведения мероприятий различного формата.",
    en: "Afrosiyob Regency offers 100 modern and comfortable rooms as well as versatile conference halls for events of any format.",
    uz: "Afrosiyob Regency 100 ta zamonaviy va qulay xonalar, shuningdek, har xil tadbirlar uchun universal konferensiya zallarini taklif etadi.",
    ko: "Afrosiyob Regency는 100개의 현대적이고 편안한 객실과 다양한 행사를 위한 회의실을 제공합니다.",
  },
  about_p2: {
    ru: "К услугам гостей рестораны, лобби-бар, СПА-зона и фитнес-центр, создающие все условия для комфортного и продуктивного пребывания.",
    en: "Guests enjoy restaurants, a lobby bar, SPA area and fitness centre that ensure a comfortable and productive stay.",
    uz: "Mehmonlar uchun restoranlar, lobbi-bar, SPA va fitnes markazi qulay va samarali dam olish uchun barcha sharoitlarni yaratadi.",
    ko: "레스토랑, 로비 바, 스파, 피트니스 센터로 편안하고 생산적인 숙박을 제공합니다.",
  },

  conf_kicker: { ru: "Конференц-залы", en: "Conference halls", uz: "Konferensiya zallari", ko: "회의실" },
  conf_h2: {
    ru: "Бизнес-отель с конференц-залами в Ташкенте",
    en: "Business hotel with conference halls in Tashkent",
    uz: "Toshkentdagi konferensiya zalli biznes-mehmonxona",
    ko: "타슈켄트의 회의실을 갖춘 비즈니스 호텔",
  },
  conf_desc: {
    ru: "Мультимедийное оборудование, проектор, экран, звуковая система, рассадка, кофе-брейки и банкетное обслуживание.",
    en: "Multimedia equipment, projector, screen, sound system, seating, coffee breaks and banquet service.",
    uz: "Multimedia uskunalari, proyektor, ekran, ovoz tizimi, joylashuv, kofe-tanaffuslari va banket xizmati.",
    ko: "멀티미디어 장비, 프로젝터, 스크린, 음향 시스템, 좌석, 커피 브레이크 및 연회 서비스.",
  },
  spa_kicker: { ru: "СПА и фитнес", en: "SPA & Fitness", uz: "SPA va fitnes", ko: "스파 & 피트니스" },
  spa_h2: {
    ru: "Восстановление сил после перелёта",
    en: "Recover after your flight",
    uz: "Parvozdan keyin kuch tiklash",
    ko: "비행 후 휴식과 회복",
  },
  spa_desc: {
    ru: "Крытый бассейн, современный фитнес-клуб, сауна и турецкий хаммам — в Afrosiyob Regency вас ждёт полноценная СПА-зона.",
    en: "Indoor pool, modern fitness club, sauna and Turkish hammam — Afrosiyob Regency offers a complete SPA experience.",
    uz: "Yopiq basseyn, zamonaviy fitnes-klub, sauna va turk hammomi — Afrosiyob Regency'da to'liq SPA hududi sizni kutmoqda.",
    ko: "실내 수영장, 최신 피트니스 클럽, 사우나, 터키식 하맘 — Afrosiyob Regency의 완벽한 스파.",
  },
  rest_kicker: { ru: "Ресторан Ko'hna", en: "Ko'hna Restaurant", uz: "Ko'hna restorani", ko: "Ko'hna 레스토랑" },
  rest_h2: {
    ru: "Национальная и европейская кухня",
    en: "National and European cuisine",
    uz: "Milliy va Yevropa oshxonasi",
    ko: "현지 및 유럽 요리",
  },
  rest_desc: {
    ru: "В отеле работает ресторан, подходящий для деловых ужинов и корпоративных мероприятий.",
    en: "The hotel restaurant is ideal for business dinners and corporate events.",
    uz: "Mehmonxonadagi restoran ish kechki ovqatlari va korporativ tadbirlar uchun mos.",
    ko: "비즈니스 디너 및 기업 행사에 적합한 호텔 레스토랑.",
  },
  loc_kicker: { ru: "Локация", en: "Location", uz: "Joylashuv", ko: "위치" },
  loc_h2: {
    ru: "Улица Абдулла Каххара 150A, Ташкент",
    en: "Abdulla Kakhar Street 150A, Tashkent",
    uz: "Abdulla Qahhor ko'chasi 150A, Toshkent",
    ko: "압둘라 카하르 거리 150A, 타슈켄트",
  },
  why_kicker: { ru: "Преимущества", en: "Advantages", uz: "Afzalliklar", ko: "장점" },
  why_h2: {
    ru: "Почему выбирают Afrosiyob Regency Hotel?",
    en: "Why choose Afrosiyob Regency Hotel?",
    uz: "Nima uchun Afrosiyob Regency Hotelni tanlash kerak?",
    ko: "왜 Afrosiyob Regency Hotel을 선택해야 할까요?",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afr_lang") as Lang | null;
      if (saved && LANGS.some((l) => l.code === saved)) setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("afr_lang", l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = DICT[key];
      if (!entry) return key;
      return entry[lang] || entry.ru || key;
    },
    [lang],
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}