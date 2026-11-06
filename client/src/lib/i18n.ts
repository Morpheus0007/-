export type Lang = 'ky' | 'ru'

export interface Translations {
    pageTitle: string
    openBtn: string
    coverLabel: string
    eyebrow1: string
    brideSub: string
    weekDay: string
    month: string
    calMonth: string
    inviteHead: string
    inviteBody1: string
    inviteBody2: string
    venueEyebrow: string
    venueName: string
    venueAddress: string
    mapBtn: string
    schedEyebrow: string
    sched1Title: string
    sched1Sub: string
    sched2Title: string
    sched2Sub: string
    sched3Title: string
    sched3Sub: string
    rsvpEyebrow: string
    rsvpHead: string
    rsvpName: string
    rsvpPhone: string
    rsvpQ: string
    rsvpCome: string
    rsvpDecline: string
    rsvpCount: string
    rsvpNames: string
    rsvpNeeds: string
    rsvpWishPlaceholder: string
    rsvpSubmit: string
    rsvpThanks: string
    rsvpError: string
    rsvpFallback: string
    closingText: string
    closingSubtext: string
    letterEyebrow: string
    letterTitle: string
    calWeek: string[]
    addCalBtn: string
    scrollDown: string
    skip: string
    atmosphereEyebrow: string
    atmosphereTitle: string
    timeRemaining: string
    shareLabel: string
    dateEyebrow: string
    venueLocationEyebrow: string
    faqEyebrow: string
    faq1Q: string
    faq1A: string
    faq2Q: string
    faq2A: string
    faq3Q: string
    faq3A: string
    saturday: string
    august: string
}

export const i18n: Record<Lang, Translations> = {
    ky: {
        pageTitle: 'Кыз Узатуу · Elena',
        openBtn: 'Ачуу',
        coverLabel: 'Кыз узатууга чакыруу',
        eyebrow1: 'Кыз узатуу · 2026',
        brideSub: 'Кыз Узатуу',
        weekDay: 'Ишемби',
        month: 'Август',
        calMonth: 'Август 2026',
        inviteHead: 'Урматтуу коноктор!',
        inviteBody1: 'Сиздерди кызыбыз Еленанын кыз узатуу тоюна арналган салтанаттуу кечеге келип, ак дасторкон устундо бата берип,',
        inviteBody2: 'кадырлуу коногубуз болуп кетууго чакырабыз!',
        venueEyebrow: 'Дареги',
        venueName: 'Банкет залы',
        venueAddress: 'Бишкек, Кыргызстан',
        mapBtn: 'Картаны ачуу',
        schedEyebrow: 'Кеченин планы',
        sched1Title: 'Коноктор жыйыны',
        sched1Sub: 'Келгиле, тосуп алабыз!',
        sched2Title: 'Банкет',
        sched2Sub: 'Дасторкон, тамак-аш',
        sched3Title: 'Кеченин аякташы',
        sched3Sub: 'Жакшы тилектер',
        rsvpEyebrow: 'Коноктор анкетасы',
        rsvpHead: 'Катышасызбы?',
        rsvpName: 'Аты жөнү (ФИО)',
        rsvpPhone: 'Телефон номери',
        rsvpQ: 'Катышасызбы?',
        rsvpCome: 'Келем ✓',
        rsvpDecline: 'Келбейм ✗',
        rsvpCount: 'Канча киши?',
        rsvpNames: 'Коноктордун аты-жөнү',
        rsvpNeeds: 'Өзгөчө суроолор',
        rsvpWishPlaceholder: 'Той-той куттуктоо (милдеттүү эмес)',
        rsvpSubmit: 'Жибер',
        rsvpThanks: 'Жооп үчүн рахмат!',
        rsvpError: 'Ката кетти, кайра аракет кылыңыз',
        rsvpFallback: 'Байланыш серверге жетпей калды — жообуңузду WhatsApp аркылуу жиберип жатабыз.',
        closingText: 'Терең урматтоо менен,',
        closingSubtext: 'Коногубуз болуп, кубанычыбызды тең бөлүшүңүздөр!',
        letterEyebrow: 'Чакыруу',
        letterTitle: 'Кыз Узатууга',
        calWeek: ['Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш', 'Жш'],
        addCalBtn: 'Календарга кошуу',
        scrollDown: 'Листерди ылдый жылдырыңыз',
        skip: 'Өткөрүп жибер',
        atmosphereEyebrow: 'Той өткөрүлүүчү жер',
        atmosphereTitle: 'Атмосфера',
        timeRemaining: 'Калган убакыт',
        shareLabel: 'Бөлүшүү',
        dateEyebrow: 'Дата',
        venueLocationEyebrow: 'Жер',
        faqEyebrow: 'Суроолор',
        faq1Q: 'Балдар менен келсе болобу?',
        faq1A: 'Ооба, балдар менен келсе болот — биз сизди кошо кубаттайбыз!',
        faq2Q: 'Кайда токтоо болот?',
        faq2A: 'Ресторандын жанында акысыз паркинг бар, орун жетиштүү.',
        faq3Q: 'Канча убакытта келгеним дурус?',
        faq3A: '15:00дан 15:30га чейин келсеңиз идеалдуу — коноктор топтолуп, той башталат.',
        saturday: 'Ишемби',
        august: 'Август',
    },
    ru: {
        pageTitle: 'Проводы невесты · Elena',
        openBtn: 'Открыть',
        coverLabel: 'Приглашение на проводы невесты',
        eyebrow1: 'Проводы невесты · 2026',
        brideSub: 'Проводы невесты',
        weekDay: 'Суббота',
        month: 'Август',
        calMonth: 'Август 2026',
        inviteHead: 'Уважаемые гости!',
        inviteBody1: 'Приглашаем Вас посетить торжественный вечер, посвященный нашей дочке Елене, благословить ее',
        inviteBody2: 'и стать нашим почетным гостем!',
        venueEyebrow: 'Адрес',
        venueName: 'Банкетный зал',
        venueAddress: 'Бишкек, Кыргызстан',
        mapBtn: 'Открыть карту',
        schedEyebrow: 'План вечера',
        sched1Title: 'Сбор гостей',
        sched1Sub: 'Приходите, будем ждать!',
        sched2Title: 'Банкет',
        sched2Sub: 'Праздничный ужин',
        sched3Title: 'Завершение вечера',
        sched3Sub: 'Пожелания и проводы',
        rsvpEyebrow: 'Анкета гостей',
        rsvpHead: 'Вы придёте?',
        rsvpName: 'ФИО',
        rsvpPhone: 'Номер телефона',
        rsvpQ: 'Вы придёте?',
        rsvpCome: 'Приду ✓',
        rsvpDecline: 'Не приду ✗',
        rsvpCount: 'Сколько человек?',
        rsvpNames: 'Имена гостей (если их несколько)',
        rsvpNeeds: 'Особые пожелания',
        rsvpWishPlaceholder: 'Пожелание молодожёнам (необязательно)',
        rsvpSubmit: 'Отправить',
        rsvpThanks: 'Спасибо за ответ!',
        rsvpError: 'Произошла ошибка, попробуйте ещё раз',
        rsvpFallback: 'Не удалось связаться с сервером — отправляем ваш ответ через WhatsApp.',
        closingText: 'С глубоким уважением,',
        closingSubtext: 'Будем рады разделить этот счастливый день вместе с вами!',
        letterEyebrow: 'Приглашение',
        letterTitle: 'На Кыз Узатуу',
        calWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        addCalBtn: 'Добавить в календарь',
        scrollDown: 'Листайте вниз',
        skip: 'Пропустить',
        atmosphereEyebrow: 'Место проведения',
        atmosphereTitle: 'Атмосфера',
        timeRemaining: 'До события',
        shareLabel: 'Поделиться',
        dateEyebrow: 'Дата',
        venueLocationEyebrow: 'Место',
        faqEyebrow: 'Вопросы',
        faq1Q: 'Можно ли с детьми?',
        faq1A: 'Да, с детьми приходить можно — мы рады всей семье!',
        faq2Q: 'Где парковка?',
        faq2A: 'Рядом с рестораном есть бесплатная парковка, мест достаточно.',
        faq3Q: 'Во сколько лучше приехать?',
        faq3A: 'Идеально приехать с 15:00 до 15:30 — гости собираются, и праздник начнётся вовремя.',
        saturday: 'Суббота',
        august: 'Август',
    },
}
