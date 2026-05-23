export const t = {
  // Auth
  login: {
    title: 'Beelive',
    subtitle: 'Intră în cont',
    cnpLabel: 'CNP',
    cnpPlaceholder: '1234567890123',
    passwordLabel: 'Parolă',
    submit: 'Intră în cont',
    errors: {
      invalid_credentials: 'CNP sau parolă greșite.',
      validation_failed: 'Verifică datele introduse.',
      rate_limited: 'Prea multe încercări. Așteaptă puțin.',
      internal: 'Eroare de server. Reîncearcă.',
    },
  },
  twoFa: {
    title: 'Verificare în doi pași',
    subtitle: (dest: string) => `Codul a fost trimis la ${dest}`,
    codePlaceholder: 'Cod din 6 cifre',
    submit: 'Verifică codul',
    switchChannel: 'Schimbă metoda',
    errors: {
      invalid_2fa_code: 'Cod greșit. Reîncearcă.',
    },
  },
  // Roles
  roles: {
    apicultor: 'Apicultor',
    fermier: 'Fermier',
    inspector: 'Inspector ANF',
  },
  // Cascade
  cascade: {
    offlineBanner: 'Ești offline. Statusul se va actualiza când revii pe net.',
    retrying: 'Reîncerc...',
    unconfirmedWarning: (phone: string) => `Apicultorul nu a confirmat. Sună-l direct: ${phone}`,
    techError: 'Eroare tehnică',
    settled: 'Confirmat',
    skipped: 'Sărit',
    channelLabels: {
      push: 'Notificare',
      call: 'Apel',
      sms: 'SMS',
    },
    finalStatus: {
      confirmed_call: 'Confirmat prin apel',
      confirmed_sms: 'Confirmat prin SMS',
      confirmed_app: 'Confirmat în aplicație',
      unconfirmed: 'Neconfirmat',
      failed: 'Eșuat',
    },
  },
  // BzzBzzCard
  bzz: {
    title: 'Alertă stropire!',
    distance: 'Distanță',
    eta: 'Ora stropire',
    wind: 'Vânt',
    toxicity: 'Toxicitate',
    substance: 'Substanță',
    moveHives: 'Mut stupii',
    sealInPlace: 'Sigilez',
    confirmed: (via: string) => `Confirmat prin ${via}`,
    ledgerVerify: 'Verifică integritatea',
    noAlerts: 'Nicio alertă activă. Stupii tăi sunt în siguranță.',
  },
  // Forms
  form: {
    spray: {
      title: 'Raport de stropire',
      parcel: 'Parcelă',
      surface: 'Suprafață (ha)',
      crop: 'Cultură',
      substance: 'Substanță fitosanitară',
      scheduledAt: 'Data și ora stropire',
      duration: 'Durată estimată (ore)',
      notes: 'Observații (opțional)',
      riskPreview: (n: number) => `~${n} apicultori afectați`,
      submit: 'Notifică apicultorii',
    },
  },
  // Navigation
  nav: {
    apicultor: ['Acasă', 'Stupine', 'Alerte', 'Profil'],
    fermier: ['Acasă', 'Parcele', 'Rapoarte', 'Profil'],
    inspector: ['Acasă', 'Hartă', 'Pagube', 'Profil'],
    logout: 'Ieși din cont',
    settings: 'Setări',
  },
  // General
  loading: 'Se încarcă...',
  error: 'A apărut o eroare.',
  retry: 'Reîncearcă',
  empty: 'Nimic de afișat.',
  cancel: 'Anulează',
  save: 'Salvează',
  back: 'Înapoi',
  downwind: 'Favorizat de vânt',
} as const
