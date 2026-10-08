"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  LayoutDashboard,
  Swords,
  Trophy,
  Wallet,
  Settings,
  Bell,
  ChevronDown,
  Search,
  Lock,
  Lightbulb,
  CheckCircle2,
  X,
  Terminal as TerminalIcon,
  Flag,
  ArrowLeft,
  Zap,
  Sun,
  Moon,
  Laptop,
  SlidersHorizontal,
  ShieldCheck,
  RefreshCw,
  LogOut,
  User as UserIcon,
  Check,
  Eye,
  EyeOff,
  Globe,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";

/**
 * CyberEarn — Dashboard & Sandbox (single-file build)
 * -----------------------------------------------------------------------
 * Everything — i18n, theme tokens, mock data, context, and every
 * sub-component (Header, Sidebar, AuthModal, SettingsModal,
 * ChallengeCatalog, SandboxView, SuccessModal, panels) — lives in this one
 * file so it can be dropped straight into app/dashboard/page.tsx and run
 * with zero other local imports (only "react" and "lucide-react" are
 * external dependencies).
 *
 * This is the same code as the modular version, concatenated in
 * dependency order (data/i18n/theme → context → small controls → modals →
 * header/sidebar → landing → catalog/sandbox/success → panels → page).
 * For anything beyond a quick test, splitting this back into the
 * multi-file structure is still the better long-term setup.
 * -----------------------------------------------------------------------
 */

/* ---------------------------------------------------------------------------- */
/*  INTERNATIONALIZATION (i18n) — languages, translations, translate()
    (source: lib/i18n.ts)  */
/* ---------------------------------------------------------------------------- */

type LangCode =
  | "en-US"
  | "en-GB"
  | "az"
  | "tr"
  | "ru"
  | "zh"
  | "de"
  | "es";

const LANGUAGES: { code: LangCode; flag: string; label: string }[] = [
  { code: "en-US", flag: "🇺🇸", label: "English (US)" },
  { code: "en-GB", flag: "🇬🇧", label: "English (UK)" },
  { code: "az", flag: "🇦🇿", label: "Azərbaycan" },
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

const DEFAULT_LANG: LangCode = "en-US";

/**
 * NOTE ON SCOPE:
 * This dictionary covers all product "chrome" — nav, header, auth, modals,
 * labels, empty states. Mock challenge content (titles, descriptions, hints,
 * terminal output) is intentionally left in English, since in production
 * that content would come from a CMS/backend with its own per-locale fields
 * rather than being hardcoded in the frontend.
 */

const en_US = {
  common: { search: "Search challenges…", success: "Done successfully!" },
  nav: {
    dashboard: "Dashboard",
    challenges: "Challenges / Sandboxes",
    leaderboard: "Leaderboard",
    wallet: "Wallet & Cashout",
    settings: "Settings",
  },
  header: { signIn: "Sign in", getStarted: "Get started" },
  auth: {
    loginTitle: "Welcome back",
    registerTitle: "Create your account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    username: "Username",
    loginButton: "Sign in",
    registerButton: "Create account",
    continueGuest: "Continue as guest",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    orDivider: "or",
    error: "Please fill in all fields.",
    mismatch: "Passwords don't match.",
  },
  profile: {
    profileSettings: "Profile settings",
    settings: "Settings",
    signOut: "Sign out",
  },
  notifications: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    item1:
      'Your "Auth Log Hunt" submission was verified — $15.00 USDT credited.',
    item2: "New sponsor bounty added to the Smart Contracts track.",
    item3: "You climbed to rank #412 on the global leaderboard.",
    item4: "Weekly payout batch processed successfully.",
  },
  language: { select: "Language" },
  landing: {
    badge: "Learn cybersecurity. Get paid to practice.",
    title: "Master real-world hacking. In your browser.",
    subtitle:
      "Solve live sandbox challenges across Linux, web security, smart contracts, and Python — and earn real USDT for every one you crack.",
    ctaPrimary: "Get started",
    ctaSecondary: "Sign in",
  },
  catalog: {
    title: "Challenges",
    subtitle:
      "Pick a sandbox, solve it live, and get paid the moment it's verified.",
  },
  filters: { all: "All", linux: "Linux", web: "Web Security", smart: "Smart Contracts", python: "Python" },
  difficulty: { easy: "Easy", medium: "Medium", hard: "Hard" },
  challenge: { start: "Start challenge" },
  sandbox: {
    back: "Back to challenges",
    objectives: "Objectives",
    hintShow: "Show hint",
    hintHide: "Hide hint",
    submitLabel: "Submit flag / solution",
    verify: "Verify & claim reward",
    wrongFlag: "That's not the right flag — check your output and try again.",
  },
  terminal: { live: "live", placeholder: "type a command…", send: "Send" },
  success: {
    title: "Challenge completed!",
    usdt: "added to your balance",
    xp: "XP earned",
    back: "Back to challenges",
  },
  overview: {
    welcome: "Welcome back",
    subtitle: "Here's how your progress looks this week.",
    statBalance: "Wallet balance",
    statXp: "Total XP",
    statSolved: "Challenges solved",
    statRank: "Global rank",
  },
  placeholder: {
    leaderboardTitle: "Leaderboard",
    leaderboardNote: "Season 3 rankings refresh every Monday at 00:00 UTC.",
    walletTitle: "Wallet & Cashout",
    walletNote: "Cashouts settle within 24 hours.",
    settingsTitle: "Settings",
    settingsNote:
      "Profile, notification, and security preferences live here.",
  },
  settingsModal: {
    title: "Settings",
    tabAccount: "Account",
    tabPreferences: "App Preferences",
    tabSecurity: "Security",
    accountName: "Display name",
    accountEmail: "Email",
    accountRank: "Rank",
    accountAvatar: "Profile picture",
    accountAvatarChange: "Change avatar",
    accountSave: "Save changes",
    accountSaved: "Changes saved",
    languageHint: "Choose the language used across menus, buttons, and messages.",
    prefThemeLabel: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    themeSystem: "System",
    prefNotifLabel: "Notifications",
    notifEmailLabel: "Email notifications",
    notifBrowserLabel: "Browser notifications",
    done: "Done",
    accountFirstName: "First name",
    accountLastName: "Last name",
    accountAvatarRemove: "Remove",
    accountAvatarHint: "PNG, JPG or WebP, up to 2 MB.",
    accountAvatarInvalid: "Choose a PNG, JPG or WebP image up to 2 MB.",
    accountEmailInvalid: "Enter a valid email address.",
    accountNameRequired: "First name is required.",
  },
  security: {
    title: "Security",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    updateButton: "Update password",
    mismatch: "New passwords don't match.",
    weakPassword: "New password must be at least 8 characters.",
    success: "Password updated.",
    twoFactor: "Two-factor authentication",
    twoFactorOn: "Enabled",
    twoFactorOff: "Disabled",
    enableButton: "Enable 2FA",
    disableButton: "Disable 2FA",
  },
  sidebar: {
    nextTierTitle: "Next payout tier",
    nextTierNote: "Reach level 15 to unlock $50+ sponsor bounties.",
  },
  twoFa: {
    title: "Enable two-factor authentication",
    guestEmailNote: "You can use any email address you have access to.",
    intro: "We'll send a 6-digit code to the email address you registered with.",
    sendCode: "Send code",
    sending: "Sending…",
    sentTo: "We sent a 6-digit code to",
    codeLabel: "Verification code",
    verify: "Verify & enable",
    resend: "Resend code",
    resendIn: "Resend in",
    invalidCode: "That code isn't correct. Try again.",
    tooMany: "Too many attempts. Request a new code.",
    cancel: "Cancel",
    back: "Back",
    demoNote: "Demo mode — no server connected. Your code:",
    enabledToast: "Two-factor authentication enabled!",
  },
  walletModal: {
    title: "Wallet",
    totalBalance: "Total balance",
    withdraw: "Withdraw funds",
    amount: "Amount (USDT)",
    method: "Payout method",
    methodUsdt: "Crypto (USDT)",
    methodCard: "Bank card",
    submit: "Request withdrawal",
    historyTitle: "Transaction history",
    historyEmpty: "No transactions yet.",
    insufficientBalance: "You don't have enough balance for this withdrawal.",
    invalidAmount: "Enter a valid amount.",
    withdrawSuccess: "Withdrawal request sent!",
    tabWithdraw: "Withdraw",
    tabDeposit: "Deposit",
    tabHistory: "History",
    walletAddress: "Wallet address",
    walletAddressCard: "Card number",
    network: "Network",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "Min. withdrawal: $10.00",
    addressRequired: "Enter a wallet address or card number.",
    belowMinimum: "Minimum withdrawal is $10.00.",
    depositTitle: "Balance top-up",
    depositAmount: "Amount (USDT)",
    depositButton: "Add funds",
    depositNote: "Demo top-up — instantly adds funds to your balance for testing.",
    depositSuccess: "Balance topped up!",
    statusCompleted: "Completed",
    statusPending: "Pending",
  },
  xpModal: {
    title: "Level & XP",
    nextRewardTitle: "Next level reward",
    nextRewardLabel: "Reach level {level}: +${amount} bonus & VIP badge",
    currentLevel: "Current level",
    nextLevel: "Next level",
    progressLabel: "{cur} / {goal} XP to next level",
    historyTitle: "XP earned",
    historyEmpty: "Solve a challenge to start earning XP.",
  },
  leaderboardModal: {
    title: "Top 100 leaderboard",
    yourRank: "Your rank",
    periodWeekly: "Weekly",
    periodMonthly: "Monthly",
    periodAll: "All-time",
  },
  rank: {
    redTeamer: "Red Teamer",
    bugHunter: "Bug Hunter",
    pentester: "Pentester",
    rookie: "Rookie",
    eliteHacker: "Elite Hacker",
  },
};

// en-GB mirrors en-US almost exactly; only a couple of words differ in real
// products (e.g. "customise"), none of which appear in this string set yet.
const en_GB: typeof en_US = { ...en_US };

const de: typeof en_US = {
  common: { search: "Challenges suchen…", success: "Erfolgreich ausgeführt!" },
  nav: {
    dashboard: "Dashboard",
    challenges: "Challenges / Sandboxes",
    leaderboard: "Bestenliste",
    wallet: "Wallet & Auszahlung",
    settings: "Einstellungen",
  },
  header: { signIn: "Anmelden", getStarted: "Loslegen" },
  auth: {
    loginTitle: "Willkommen zurück",
    registerTitle: "Konto erstellen",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    username: "Benutzername",
    loginButton: "Anmelden",
    registerButton: "Konto erstellen",
    continueGuest: "Als Gast fortfahren",
    noAccount: "Noch kein Konto?",
    haveAccount: "Bereits ein Konto?",
    orDivider: "oder",
    error: "Bitte fülle alle Felder aus.",
    mismatch: "Die Passwörter stimmen nicht überein.",
  },
  profile: {
    profileSettings: "Profileinstellungen",
    settings: "Einstellungen",
    signOut: "Abmelden",
  },
  notifications: {
    title: "Benachrichtigungen",
    markAllRead: "Alle als gelesen markieren",
    item1:
      'Deine Einsendung „Auth Log Hunt" wurde verifiziert — 15,00 USDT gutgeschrieben.',
    item2: "Neue Sponsor-Prämie im Bereich Smart Contracts.",
    item3: "Du bist auf Rang #412 der globalen Bestenliste aufgestiegen.",
    item4: "Wöchentliche Auszahlung erfolgreich verarbeitet.",
  },
  language: { select: "Sprache" },
  landing: {
    badge: "Cybersicherheit lernen. Fürs Üben bezahlt werden.",
    title: "Echtes Hacking meistern. Direkt im Browser.",
    subtitle:
      "Löse Live-Sandbox-Challenges zu Linux, Websicherheit, Smart Contracts und Python — und verdiene echtes USDT für jede gelöste Aufgabe.",
    ctaPrimary: "Loslegen",
    ctaSecondary: "Anmelden",
  },
  catalog: {
    title: "Challenges",
    subtitle:
      "Wähle eine Sandbox, löse sie live und werde sofort nach der Verifizierung bezahlt.",
  },
  filters: { all: "Alle", linux: "Linux", web: "Websicherheit", smart: "Smart Contracts", python: "Python" },
  difficulty: { easy: "Leicht", medium: "Mittel", hard: "Schwer" },
  challenge: { start: "Challenge starten" },
  sandbox: {
    back: "Zurück zu den Challenges",
    objectives: "Ziele",
    hintShow: "Hinweis anzeigen",
    hintHide: "Hinweis ausblenden",
    submitLabel: "Flag / Lösung einreichen",
    verify: "Prüfen & Belohnung einlösen",
    wrongFlag:
      "Das ist nicht die richtige Flag — überprüfe deine Ausgabe und versuche es erneut.",
  },
  terminal: { live: "live", placeholder: "Befehl eingeben…", send: "Senden" },
  success: {
    title: "Challenge abgeschlossen!",
    usdt: "deinem Guthaben gutgeschrieben",
    xp: "XP erhalten",
    back: "Zurück zu den Challenges",
  },
  overview: {
    welcome: "Willkommen zurück",
    subtitle: "So sieht dein Fortschritt diese Woche aus.",
    statBalance: "Wallet-Guthaben",
    statXp: "Gesamt-XP",
    statSolved: "Gelöste Challenges",
    statRank: "Globaler Rang",
  },
  placeholder: {
    leaderboardTitle: "Bestenliste",
    leaderboardNote:
      "Die Season-3-Rangliste wird jeden Montag um 00:00 UTC aktualisiert.",
    walletTitle: "Wallet & Auszahlung",
    walletNote: "Auszahlungen werden innerhalb von 24 Stunden abgewickelt.",
    settingsTitle: "Einstellungen",
    settingsNote:
      "Profil-, Benachrichtigungs- und Sicherheitseinstellungen findest du hier.",
  },
  settingsModal: {
    title: "Einstellungen",
    tabAccount: "Konto",
    tabPreferences: "App-Einstellungen",
    tabSecurity: "Sicherheit",
    accountName: "Anzeigename",
    accountEmail: "E-Mail",
    accountRank: "Rang",
    accountAvatar: "Profilbild",
    accountAvatarChange: "Avatar ändern",
    accountSave: "Änderungen speichern",
    accountSaved: "Änderungen gespeichert",
    languageHint: "Wähle die Sprache für Menüs, Schaltflächen und Meldungen.",
    prefThemeLabel: "Erscheinungsbild",
    themeDark: "Dunkel",
    themeLight: "Hell",
    themeSystem: "System",
    prefNotifLabel: "Benachrichtigungen",
    notifEmailLabel: "E-Mail-Benachrichtigungen",
    notifBrowserLabel: "Browser-Benachrichtigungen",
    done: "Fertig",
    accountFirstName: "Vorname",
    accountLastName: "Nachname",
    accountAvatarRemove: "Entfernen",
    accountAvatarHint: "PNG, JPG oder WebP, bis 2 MB.",
    accountAvatarInvalid: "Wähle ein PNG-, JPG- oder WebP-Bild bis 2 MB.",
    accountEmailInvalid: "Gib eine gültige E-Mail-Adresse ein.",
    accountNameRequired: "Der Vorname ist erforderlich.",
  },
  security: {
    title: "Sicherheit",
    changePassword: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Neues Passwort bestätigen",
    updateButton: "Passwort aktualisieren",
    mismatch: "Die neuen Passwörter stimmen nicht überein.",
    weakPassword: "Das neue Passwort muss mindestens 8 Zeichen haben.",
    success: "Passwort aktualisiert.",
    twoFactor: "Zwei-Faktor-Authentifizierung",
    twoFactorOn: "Aktiviert",
    twoFactorOff: "Deaktiviert",
    enableButton: "2FA aktivieren",
    disableButton: "2FA deaktivieren",
  },
  sidebar: {
    nextTierTitle: "Nächste Auszahlungsstufe",
    nextTierNote: "Erreiche Level 15, um Sponsor-Prämien ab 50 $ freizuschalten.",
  },
  twoFa: {
    title: "Zwei-Faktor-Authentifizierung aktivieren",
    guestEmailNote: "Du kannst eine beliebige E-Mail-Adresse verwenden, auf die du Zugriff hast.",
    intro: "Wir senden einen 6-stelligen Code an die E-Mail-Adresse, mit der du dich registriert hast.",
    sendCode: "Code senden",
    sending: "Wird gesendet…",
    sentTo: "Wir haben einen 6-stelligen Code gesendet an",
    codeLabel: "Bestätigungscode",
    verify: "Bestätigen & aktivieren",
    resend: "Code erneut senden",
    resendIn: "Erneut senden in",
    invalidCode: "Der Code ist falsch. Versuche es erneut.",
    tooMany: "Zu viele Versuche. Fordere einen neuen Code an.",
    cancel: "Abbrechen",
    back: "Zurück",
    demoNote: "Demo-Modus — kein Server verbunden. Dein Code:",
    enabledToast: "Zwei-Faktor-Authentifizierung aktiviert!",
  },
  walletModal: {
    title: "Wallet",
    totalBalance: "Gesamtguthaben",
    withdraw: "Geld auszahlen",
    amount: "Betrag (USDT)",
    method: "Auszahlungsmethode",
    methodUsdt: "Krypto (USDT)",
    methodCard: "Bankkarte",
    submit: "Auszahlung beantragen",
    historyTitle: "Transaktionsverlauf",
    historyEmpty: "Noch keine Transaktionen.",
    insufficientBalance: "Dein Guthaben reicht für diese Auszahlung nicht aus.",
    invalidAmount: "Gib einen gültigen Betrag ein.",
    withdrawSuccess: "Auszahlungsanfrage gesendet!",
    tabWithdraw: "Auszahlen",
    tabDeposit: "Einzahlen",
    tabHistory: "Verlauf",
    walletAddress: "Wallet-Adresse",
    walletAddressCard: "Kartennummer",
    network: "Netzwerk",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "Min. Auszahlung: 10,00 $",
    addressRequired: "Gib eine Wallet-Adresse oder Kartennummer ein.",
    belowMinimum: "Die Mindestauszahlung beträgt 10,00 $.",
    depositTitle: "Guthaben aufladen",
    depositAmount: "Betrag (USDT)",
    depositButton: "Guthaben hinzufügen",
    depositNote: "Demo-Aufladung — fügt zu Testzwecken sofort Guthaben hinzu.",
    depositSuccess: "Guthaben aufgeladen!",
    statusCompleted: "Abgeschlossen",
    statusPending: "Ausstehend",
  },
  xpModal: {
    title: "Level & XP",
    nextRewardTitle: "Belohnung für nächstes Level",
    nextRewardLabel: "Erreiche Level {level}: +{amount} $ Bonus & VIP-Abzeichen",
    currentLevel: "Aktuelles Level",
    nextLevel: "Nächstes Level",
    progressLabel: "{cur} / {goal} XP bis zum nächsten Level",
    historyTitle: "Erhaltene XP",
    historyEmpty: "Löse eine Challenge, um XP zu sammeln.",
  },
  leaderboardModal: {
    title: "Top-100-Bestenliste",
    yourRank: "Dein Rang",
    periodWeekly: "Wöchentlich",
    periodMonthly: "Monatlich",
    periodAll: "Gesamt",
  },
  rank: {
    redTeamer: "Red Teamer",
    bugHunter: "Bug Hunter",
    pentester: "Pentester",
    rookie: "Anfänger",
    eliteHacker: "Elite-Hacker",
  },
};

const es: typeof en_US = {
  common: { search: "Buscar desafíos…", success: "¡Hecho con éxito!" },
  nav: {
    dashboard: "Panel",
    challenges: "Desafíos / Sandboxes",
    leaderboard: "Clasificación",
    wallet: "Billetera y retiros",
    settings: "Ajustes",
  },
  header: { signIn: "Iniciar sesión", getStarted: "Comenzar" },
  auth: {
    loginTitle: "Bienvenido de nuevo",
    registerTitle: "Crea tu cuenta",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    username: "Nombre de usuario",
    loginButton: "Iniciar sesión",
    registerButton: "Crear cuenta",
    continueGuest: "Continuar como invitado",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    orDivider: "o",
    error: "Por favor completa todos los campos.",
    mismatch: "Las contraseñas no coinciden.",
  },
  profile: {
    profileSettings: "Ajustes de perfil",
    settings: "Ajustes",
    signOut: "Cerrar sesión",
  },
  notifications: {
    title: "Notificaciones",
    markAllRead: "Marcar todo como leído",
    item1:
      'Tu envío "Auth Log Hunt" fue verificado — se acreditaron $15.00 USDT.',
    item2: "Nueva recompensa de patrocinador añadida a Smart Contracts.",
    item3: "Subiste al puesto #412 en la clasificación global.",
    item4: "El pago semanal se procesó correctamente.",
  },
  language: { select: "Idioma" },
  landing: {
    badge: "Aprende ciberseguridad. Cobra por practicar.",
    title: "Domina el hacking real. Desde tu navegador.",
    subtitle:
      "Resuelve desafíos de sandbox en vivo de Linux, seguridad web, contratos inteligentes y Python — y gana USDT real por cada uno que resuelvas.",
    ctaPrimary: "Comenzar",
    ctaSecondary: "Iniciar sesión",
  },
  catalog: {
    title: "Desafíos",
    subtitle: "Elige un sandbox, resuélvelo en vivo y cobra en cuanto se verifique.",
  },
  filters: { all: "Todos", linux: "Linux", web: "Seguridad web", smart: "Contratos inteligentes", python: "Python" },
  difficulty: { easy: "Fácil", medium: "Medio", hard: "Difícil" },
  challenge: { start: "Iniciar desafío" },
  sandbox: {
    back: "Volver a los desafíos",
    objectives: "Objetivos",
    hintShow: "Mostrar pista",
    hintHide: "Ocultar pista",
    submitLabel: "Enviar flag / solución",
    verify: "Verificar y reclamar recompensa",
    wrongFlag: "Esa no es la flag correcta — revisa tu salida e inténtalo de nuevo.",
  },
  terminal: { live: "en vivo", placeholder: "escribe un comando…", send: "Enviar" },
  success: {
    title: "¡Desafío completado!",
    usdt: "añadido a tu saldo",
    xp: "XP obtenidos",
    back: "Volver a los desafíos",
  },
  overview: {
    welcome: "Bienvenido de nuevo",
    subtitle: "Así va tu progreso esta semana.",
    statBalance: "Saldo de billetera",
    statXp: "XP total",
    statSolved: "Desafíos resueltos",
    statRank: "Ranking global",
  },
  placeholder: {
    leaderboardTitle: "Clasificación",
    leaderboardNote: "La clasificación de la temporada 3 se actualiza cada lunes a las 00:00 UTC.",
    walletTitle: "Billetera y retiros",
    walletNote: "Los retiros se procesan en un plazo de 24 horas.",
    settingsTitle: "Ajustes",
    settingsNote: "Aquí se encuentran las preferencias de perfil, notificaciones y seguridad.",
  },
  settingsModal: {
    title: "Ajustes",
    tabAccount: "Cuenta",
    tabPreferences: "Preferencias de la app",
    tabSecurity: "Seguridad",
    accountName: "Nombre visible",
    accountEmail: "Correo electrónico",
    accountRank: "Rango",
    accountAvatar: "Foto de perfil",
    accountAvatarChange: "Cambiar avatar",
    accountSave: "Guardar cambios",
    accountSaved: "Cambios guardados",
    languageHint: "Elige el idioma usado en los menús, botones y mensajes.",
    prefThemeLabel: "Tema",
    themeDark: "Oscuro",
    themeLight: "Claro",
    themeSystem: "Sistema",
    prefNotifLabel: "Notificaciones",
    notifEmailLabel: "Notificaciones por correo",
    notifBrowserLabel: "Notificaciones del navegador",
    done: "Listo",
    accountFirstName: "Nombre",
    accountLastName: "Apellido",
    accountAvatarRemove: "Quitar",
    accountAvatarHint: "PNG, JPG o WebP, hasta 2 MB.",
    accountAvatarInvalid: "Elige una imagen PNG, JPG o WebP de hasta 2 MB.",
    accountEmailInvalid: "Introduce un correo electrónico válido.",
    accountNameRequired: "El nombre es obligatorio.",
  },
  security: {
    title: "Seguridad",
    changePassword: "Cambiar contraseña",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    updateButton: "Actualizar contraseña",
    mismatch: "Las nuevas contraseñas no coinciden.",
    weakPassword: "La nueva contraseña debe tener al menos 8 caracteres.",
    success: "Contraseña actualizada.",
    twoFactor: "Autenticación de dos factores",
    twoFactorOn: "Activada",
    twoFactorOff: "Desactivada",
    enableButton: "Activar 2FA",
    disableButton: "Desactivar 2FA",
  },
  sidebar: {
    nextTierTitle: "Siguiente nivel de pago",
    nextTierNote: "Alcanza el nivel 15 para desbloquear recompensas de patrocinadores de $50+.",
  },
  twoFa: {
    title: "Activar la autenticación de dos factores",
    guestEmailNote: "Puedes usar cualquier correo electrónico al que tengas acceso.",
    intro: "Enviaremos un código de 6 dígitos al correo con el que te registraste.",
    sendCode: "Enviar código",
    sending: "Enviando…",
    sentTo: "Enviamos un código de 6 dígitos a",
    codeLabel: "Código de verificación",
    verify: "Verificar y activar",
    resend: "Reenviar código",
    resendIn: "Reenviar en",
    invalidCode: "El código no es correcto. Inténtalo de nuevo.",
    tooMany: "Demasiados intentos. Solicita un código nuevo.",
    cancel: "Cancelar",
    back: "Atrás",
    demoNote: "Modo demo — sin servidor conectado. Tu código:",
    enabledToast: "¡Autenticación de dos factores activada!",
  },
  walletModal: {
    title: "Billetera",
    totalBalance: "Saldo total",
    withdraw: "Retirar fondos",
    amount: "Importe (USDT)",
    method: "Método de pago",
    methodUsdt: "Cripto (USDT)",
    methodCard: "Tarjeta bancaria",
    submit: "Solicitar retiro",
    historyTitle: "Historial de transacciones",
    historyEmpty: "Aún no hay transacciones.",
    insufficientBalance: "No tienes saldo suficiente para este retiro.",
    invalidAmount: "Introduce un importe válido.",
    withdrawSuccess: "¡Solicitud de retiro enviada!",
    tabWithdraw: "Retirar",
    tabDeposit: "Depositar",
    tabHistory: "Historial",
    walletAddress: "Dirección de la wallet",
    walletAddressCard: "Número de tarjeta",
    network: "Red",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "Retiro mínimo: $10.00",
    addressRequired: "Introduce una dirección de wallet o número de tarjeta.",
    belowMinimum: "El retiro mínimo es de $10.00.",
    depositTitle: "Recarga de saldo",
    depositAmount: "Importe (USDT)",
    depositButton: "Añadir fondos",
    depositNote: "Recarga de demostración: añade fondos a tu saldo al instante para pruebas.",
    depositSuccess: "¡Saldo recargado!",
    statusCompleted: "Completado",
    statusPending: "Pendiente",
  },
  xpModal: {
    title: "Nivel y XP",
    nextRewardTitle: "Recompensa del siguiente nivel",
    nextRewardLabel: "Alcanza el nivel {level}: +${amount} de bono e insignia VIP",
    currentLevel: "Nivel actual",
    nextLevel: "Siguiente nivel",
    progressLabel: "{cur} / {goal} XP para el siguiente nivel",
    historyTitle: "XP obtenidos",
    historyEmpty: "Resuelve un desafío para empezar a ganar XP.",
  },
  leaderboardModal: {
    title: "Top 100 de la clasificación",
    yourRank: "Tu posición",
    periodWeekly: "Semanal",
    periodMonthly: "Mensual",
    periodAll: "Total",
  },
  rank: {
    redTeamer: "Red Teamer",
    bugHunter: "Cazador de errores",
    pentester: "Pentester",
    rookie: "Novato",
    eliteHacker: "Hacker de élite",
  },
};

const ru: typeof en_US = {
  common: { search: "Поиск заданий…", success: "Успешно выполнено!" },
  nav: {
    dashboard: "Панель",
    challenges: "Задания / Песочницы",
    leaderboard: "Рейтинг",
    wallet: "Кошелёк и вывод",
    settings: "Настройки",
  },
  header: { signIn: "Войти", getStarted: "Начать" },
  auth: {
    loginTitle: "С возвращением",
    registerTitle: "Создать аккаунт",
    email: "Эл. почта",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    username: "Имя пользователя",
    loginButton: "Войти",
    registerButton: "Создать аккаунт",
    continueGuest: "Продолжить как гость",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    orDivider: "или",
    error: "Пожалуйста, заполните все поля.",
    mismatch: "Пароли не совпадают.",
  },
  profile: {
    profileSettings: "Настройки профиля",
    settings: "Настройки",
    signOut: "Выйти",
  },
  notifications: {
    title: "Уведомления",
    markAllRead: "Отметить все как прочитанные",
    item1: "Ваше решение «Auth Log Hunt» проверено — начислено $15.00 USDT.",
    item2: "Новый спонсорский грант добавлен в раздел Smart Contracts.",
    item3: "Вы поднялись на #412 место в глобальном рейтинге.",
    item4: "Еженедельная выплата успешно обработана.",
  },
  language: { select: "Язык" },
  landing: {
    badge: "Изучай кибербезопасность. Получай оплату за практику.",
    title: "Осваивай реальный хакинг. Прямо в браузере.",
    subtitle:
      "Решай живые задания в песочницах по Linux, веб-безопасности, смарт-контрактам и Python — и получай настоящие USDT за каждое решённое.",
    ctaPrimary: "Начать",
    ctaSecondary: "Войти",
  },
  catalog: {
    title: "Задания",
    subtitle: "Выберите песочницу, решите её в реальном времени и получите оплату сразу после проверки.",
  },
  filters: { all: "Все", linux: "Linux", web: "Веб-безопасность", smart: "Смарт-контракты", python: "Python" },
  difficulty: { easy: "Лёгкий", medium: "Средний", hard: "Сложный" },
  challenge: { start: "Начать задание" },
  sandbox: {
    back: "Назад к заданиям",
    objectives: "Цели",
    hintShow: "Показать подсказку",
    hintHide: "Скрыть подсказку",
    submitLabel: "Отправить флаг / решение",
    verify: "Проверить и получить награду",
    wrongFlag: "Это неверный флаг — проверьте вывод и попробуйте снова.",
  },
  terminal: { live: "в эфире", placeholder: "введите команду…", send: "Отправить" },
  success: {
    title: "Задание выполнено!",
    usdt: "зачислено на ваш баланс",
    xp: "получено XP",
    back: "Назад к заданиям",
  },
  overview: {
    welcome: "С возвращением",
    subtitle: "Вот как выглядит ваш прогресс на этой неделе.",
    statBalance: "Баланс кошелька",
    statXp: "Всего XP",
    statSolved: "Решено заданий",
    statRank: "Место в рейтинге",
  },
  placeholder: {
    leaderboardTitle: "Рейтинг",
    leaderboardNote: "Рейтинг 3 сезона обновляется каждый понедельник в 00:00 UTC.",
    walletTitle: "Кошелёк и вывод",
    walletNote: "Вывод средств обрабатывается в течение 24 часов.",
    settingsTitle: "Настройки",
    settingsNote: "Здесь находятся настройки профиля, уведомлений и безопасности.",
  },
  settingsModal: {
    title: "Настройки",
    tabAccount: "Аккаунт",
    tabPreferences: "Настройки приложения",
    tabSecurity: "Безопасность",
    accountName: "Отображаемое имя",
    accountEmail: "Эл. почта",
    accountRank: "Ранг",
    accountAvatar: "Фото профиля",
    accountAvatarChange: "Изменить аватар",
    accountSave: "Сохранить изменения",
    accountSaved: "Изменения сохранены",
    languageHint: "Выберите язык меню, кнопок и сообщений.",
    prefThemeLabel: "Тема",
    themeDark: "Тёмная",
    themeLight: "Светлая",
    themeSystem: "Системная",
    prefNotifLabel: "Уведомления",
    notifEmailLabel: "Уведомления по почте",
    notifBrowserLabel: "Уведомления в браузере",
    done: "Готово",
    accountFirstName: "Имя",
    accountLastName: "Фамилия",
    accountAvatarRemove: "Удалить",
    accountAvatarHint: "PNG, JPG или WebP, до 2 МБ.",
    accountAvatarInvalid: "Выберите изображение PNG, JPG или WebP до 2 МБ.",
    accountEmailInvalid: "Введите корректный адрес эл. почты.",
    accountNameRequired: "Укажите имя.",
  },
  security: {
    title: "Безопасность",
    changePassword: "Сменить пароль",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите новый пароль",
    updateButton: "Обновить пароль",
    mismatch: "Новые пароли не совпадают.",
    weakPassword: "Новый пароль должен содержать не менее 8 символов.",
    success: "Пароль обновлён.",
    twoFactor: "Двухфакторная аутентификация",
    twoFactorOn: "Включена",
    twoFactorOff: "Отключена",
    enableButton: "Включить 2FA",
    disableButton: "Отключить 2FA",
  },
  sidebar: {
    nextTierTitle: "Следующий уровень выплат",
    nextTierNote: "Достигните 15 уровня, чтобы открыть спонсорские награды от $50.",
  },
  twoFa: {
    title: "Включить двухфакторную аутентификацию",
    guestEmailNote: "Вы можете использовать любой адрес эл. почты, к которому у вас есть доступ.",
    intro: "Мы отправим 6-значный код на адрес эл. почты, указанный при регистрации.",
    sendCode: "Отправить код",
    sending: "Отправка…",
    sentTo: "Мы отправили 6-значный код на",
    codeLabel: "Код подтверждения",
    verify: "Подтвердить и включить",
    resend: "Отправить код повторно",
    resendIn: "Повторно через",
    invalidCode: "Неверный код. Попробуйте снова.",
    tooMany: "Слишком много попыток. Запросите новый код.",
    cancel: "Отмена",
    back: "Назад",
    demoNote: "Демо-режим — сервер не подключён. Ваш код:",
    enabledToast: "Двухфакторная аутентификация включена!",
  },
  walletModal: {
    title: "Кошелёк",
    totalBalance: "Общий баланс",
    withdraw: "Вывести средства",
    amount: "Сумма (USDT)",
    method: "Способ вывода",
    methodUsdt: "Крипто (USDT)",
    methodCard: "Банковская карта",
    submit: "Запросить вывод",
    historyTitle: "История операций",
    historyEmpty: "Операций пока нет.",
    insufficientBalance: "Недостаточно средств для этого вывода.",
    invalidAmount: "Введите корректную сумму.",
    withdrawSuccess: "Заявка на вывод отправлена!",
    tabWithdraw: "Вывод",
    tabDeposit: "Пополнение",
    tabHistory: "История",
    walletAddress: "Адрес кошелька",
    walletAddressCard: "Номер карты",
    network: "Сеть",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "Мин. сумма вывода: $10.00",
    addressRequired: "Введите адрес кошелька или номер карты.",
    belowMinimum: "Минимальная сумма вывода — $10.00.",
    depositTitle: "Пополнение баланса",
    depositAmount: "Сумма (USDT)",
    depositButton: "Пополнить",
    depositNote: "Демо-пополнение — мгновенно добавляет средства на баланс для тестирования.",
    depositSuccess: "Баланс пополнен!",
    statusCompleted: "Завершено",
    statusPending: "В обработке",
  },
  xpModal: {
    title: "Уровень и XP",
    nextRewardTitle: "Награда за следующий уровень",
    nextRewardLabel: "Достигните уровня {level}: +${amount} бонус и VIP-значок",
    currentLevel: "Текущий уровень",
    nextLevel: "Следующий уровень",
    progressLabel: "{cur} / {goal} XP до следующего уровня",
    historyTitle: "Полученный опыт",
    historyEmpty: "Решите задание, чтобы начать получать XP.",
  },
  leaderboardModal: {
    title: "Топ-100 рейтинга",
    yourRank: "Ваше место",
    periodWeekly: "За неделю",
    periodMonthly: "За месяц",
    periodAll: "За всё время",
  },
  rank: {
    redTeamer: "Red Teamer",
    bugHunter: "Баг-хантер",
    pentester: "Пентестер",
    rookie: "Новичок",
    eliteHacker: "Элитный хакер",
  },
};

const zh: typeof en_US = {
  common: { search: "搜索挑战…", success: "操作成功！" },
  nav: {
    dashboard: "仪表盘",
    challenges: "挑战 / 沙盒",
    leaderboard: "排行榜",
    wallet: "钱包与提现",
    settings: "设置",
  },
  header: { signIn: "登录", getStarted: "开始使用" },
  auth: {
    loginTitle: "欢迎回来",
    registerTitle: "创建账户",
    email: "邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    username: "用户名",
    loginButton: "登录",
    registerButton: "创建账户",
    continueGuest: "以访客身份继续",
    noAccount: "还没有账户？",
    haveAccount: "已经有账户？",
    orDivider: "或",
    error: "请填写所有字段。",
    mismatch: "两次输入的密码不一致。",
  },
  profile: {
    profileSettings: "个人资料设置",
    settings: "设置",
    signOut: "退出登录",
  },
  notifications: {
    title: "通知",
    markAllRead: "全部标记为已读",
    item1: "你提交的「Auth Log Hunt」已通过验证 — 已入账 15.00 USDT。",
    item2: "智能合约赛道新增赞助商悬赏。",
    item3: "你在全球排行榜上升至第 412 名。",
    item4: "每周结算批次已成功处理。",
  },
  language: { select: "语言" },
  landing: {
    badge: "学习网络安全，边练习边赚钱。",
    title: "在浏览器中掌握真实黑客技术。",
    subtitle:
      "在 Linux、Web 安全、智能合约和 Python 等实时沙盒挑战中一展身手 — 每攻克一题即可获得真实的 USDT 奖励。",
    ctaPrimary: "开始使用",
    ctaSecondary: "登录",
  },
  catalog: {
    title: "挑战",
    subtitle: "选择一个沙盒，现场解题，验证通过即刻获得奖励。",
  },
  filters: { all: "全部", linux: "Linux", web: "Web 安全", smart: "智能合约", python: "Python" },
  difficulty: { easy: "简单", medium: "中等", hard: "困难" },
  challenge: { start: "开始挑战" },
  sandbox: {
    back: "返回挑战列表",
    objectives: "目标",
    hintShow: "显示提示",
    hintHide: "隐藏提示",
    submitLabel: "提交 flag / 解答",
    verify: "验证并领取奖励",
    wrongFlag: "flag 不正确 — 请检查输出后重试。",
  },
  terminal: { live: "直播中", placeholder: "输入命令…", send: "发送" },
  success: {
    title: "挑战完成！",
    usdt: "已存入你的余额",
    xp: "获得经验值",
    back: "返回挑战列表",
  },
  overview: {
    welcome: "欢迎回来",
    subtitle: "这是你本周的进展情况。",
    statBalance: "钱包余额",
    statXp: "总经验值",
    statSolved: "已解决挑战数",
    statRank: "全球排名",
  },
  placeholder: {
    leaderboardTitle: "排行榜",
    leaderboardNote: "第三赛季排名每周一 00:00 UTC 更新。",
    walletTitle: "钱包与提现",
    walletNote: "提现将在 24 小时内完成结算。",
    settingsTitle: "设置",
    settingsNote: "个人资料、通知与安全偏好设置均在此处管理。",
  },
  settingsModal: {
    title: "设置",
    tabAccount: "账户",
    tabPreferences: "应用偏好",
    tabSecurity: "安全",
    accountName: "显示名称",
    accountEmail: "邮箱",
    accountRank: "等级",
    accountAvatar: "头像",
    accountAvatarChange: "更换头像",
    accountSave: "保存更改",
    accountSaved: "更改已保存",
    languageHint: "选择菜单、按钮和消息中使用的语言。",
    prefThemeLabel: "主题",
    themeDark: "深色",
    themeLight: "浅色",
    themeSystem: "跟随系统",
    prefNotifLabel: "通知",
    notifEmailLabel: "邮件通知",
    notifBrowserLabel: "浏览器通知",
    done: "完成",
    accountFirstName: "名字",
    accountLastName: "姓氏",
    accountAvatarRemove: "移除",
    accountAvatarHint: "PNG、JPG 或 WebP，最大 2 MB。",
    accountAvatarInvalid: "请选择不超过 2 MB 的 PNG、JPG 或 WebP 图片。",
    accountEmailInvalid: "请输入有效的邮箱地址。",
    accountNameRequired: "名字为必填项。",
  },
  security: {
    title: "安全",
    changePassword: "修改密码",
    currentPassword: "当前密码",
    newPassword: "新密码",
    confirmPassword: "确认新密码",
    updateButton: "更新密码",
    mismatch: "两次输入的新密码不一致。",
    weakPassword: "新密码长度至少为 8 位。",
    success: "密码已更新。",
    twoFactor: "双重验证",
    twoFactorOn: "已开启",
    twoFactorOff: "已关闭",
    enableButton: "开启双重验证",
    disableButton: "关闭双重验证",
  },
  sidebar: {
    nextTierTitle: "下一档奖励等级",
    nextTierNote: "达到 15 级即可解锁 50 美元以上的赞助商悬赏。",
  },
  twoFa: {
    title: "开启双重验证",
    guestEmailNote: "你可以使用任何你能访问的邮箱地址。",
    intro: "我们会向你注册时使用的邮箱发送 6 位验证码。",
    sendCode: "发送验证码",
    sending: "发送中…",
    sentTo: "我们已向以下地址发送 6 位验证码：",
    codeLabel: "验证码",
    verify: "验证并开启",
    resend: "重新发送验证码",
    resendIn: "重新发送倒计时",
    invalidCode: "验证码不正确，请重试。",
    tooMany: "尝试次数过多，请重新获取验证码。",
    cancel: "取消",
    back: "返回",
    demoNote: "演示模式 — 未连接服务器。你的验证码：",
    enabledToast: "双重验证已开启！",
  },
  walletModal: {
    title: "钱包",
    totalBalance: "总余额",
    withdraw: "提现",
    amount: "金额（USDT）",
    method: "提现方式",
    methodUsdt: "加密货币（USDT）",
    methodCard: "银行卡",
    submit: "申请提现",
    historyTitle: "交易记录",
    historyEmpty: "暂无交易记录。",
    insufficientBalance: "余额不足，无法完成此次提现。",
    invalidAmount: "请输入有效金额。",
    withdrawSuccess: "提现请求已发送！",
    tabWithdraw: "提现",
    tabDeposit: "充值",
    tabHistory: "记录",
    walletAddress: "钱包地址",
    walletAddressCard: "卡号",
    network: "网络",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "最低提现金额：$10.00",
    addressRequired: "请输入钱包地址或卡号。",
    belowMinimum: "最低提现金额为 $10.00。",
    depositTitle: "余额充值",
    depositAmount: "金额（USDT）",
    depositButton: "充值",
    depositNote: "演示充值 — 用于测试，会立即增加你的余额。",
    depositSuccess: "余额已充值！",
    statusCompleted: "已完成",
    statusPending: "处理中",
  },
  xpModal: {
    title: "等级与经验值",
    nextRewardTitle: "下一等级奖励",
    nextRewardLabel: "达到 {level} 级：额外获得 ${amount} 奖金和 VIP 徽章",
    currentLevel: "当前等级",
    nextLevel: "下一等级",
    progressLabel: "距下一等级还需 {cur} / {goal} XP",
    historyTitle: "获得的经验值",
    historyEmpty: "解决一个挑战即可开始获得经验值。",
  },
  leaderboardModal: {
    title: "前 100 名排行榜",
    yourRank: "你的排名",
    periodWeekly: "本周",
    periodMonthly: "本月",
    periodAll: "总榜",
  },
  rank: {
    redTeamer: "红队成员",
    bugHunter: "漏洞猎人",
    pentester: "渗透测试员",
    rookie: "新手",
    eliteHacker: "精英黑客",
  },
};

const az: typeof en_US = {
  common: { search: "Tapşırıqları axtar…", success: "Uğurla icra olundu!" },
  nav: {
    dashboard: "İdarə paneli",
    challenges: "Tapşırıqlar / Sandboxlar",
    leaderboard: "Reytinq cədvəli",
    wallet: "Cüzdan və çıxarış",
    settings: "Tənzimləmələr",
  },
  header: { signIn: "Daxil ol", getStarted: "Başla" },
  auth: {
    loginTitle: "Yenidən xoş gəldin",
    registerTitle: "Hesab yarat",
    email: "E-poçt",
    password: "Şifrə",
    confirmPassword: "Şifrəni təsdiqlə",
    username: "İstifadəçi adı",
    loginButton: "Daxil ol",
    registerButton: "Hesab yarat",
    continueGuest: "Qonaq kimi davam et",
    noAccount: "Hesabın yoxdur?",
    haveAccount: "Artıq hesabın var?",
    orDivider: "və ya",
    error: "Zəhmət olmasa bütün sahələri doldurun.",
    mismatch: "Şifrələr uyğun gəlmir.",
  },
  profile: {
    profileSettings: "Profil tənzimləmələri",
    settings: "Tənzimləmələr",
    signOut: "Çıxış et",
  },
  notifications: {
    title: "Bildirişlər",
    markAllRead: "Hamısını oxunmuş kimi işarələ",
    item1: '"Auth Log Hunt" təqdimatın təsdiqləndi — 15.00 USDT balansına əlavə edildi.',
    item2: "Smart Contracts bölməsinə yeni sponsor mükafatı əlavə olundu.",
    item3: "Qlobal reytinq cədvəlində #412 pilləsinə yüksəldin.",
    item4: "Həftəlik ödəniş toplusu uğurla emal olundu.",
  },
  language: { select: "Dil" },
  landing: {
    badge: "Kibertəhlükəsizliyi öyrən. Təcrübə etdikcə qazan.",
    title: "Real hacking bacarıqlarına yiyələn. Birbaşa brauzerdə.",
    subtitle:
      "Linux, veb təhlükəsizliyi, smart müqavilələr və Python üzrə canlı sandbox tapşırıqlarını həll et — hər həll etdiyin tapşırığa görə real USDT qazan.",
    ctaPrimary: "Başla",
    ctaSecondary: "Daxil ol",
  },
  catalog: {
    title: "Tapşırıqlar",
    subtitle: "Bir sandbox seç, onu canlı həll et və təsdiqləndiyi anda ödənişini al.",
  },
  filters: { all: "Hamısı", linux: "Linux", web: "Veb Təhlükəsizliyi", smart: "Smart Müqavilələr", python: "Python" },
  difficulty: { easy: "Asan", medium: "Orta", hard: "Çətin" },
  challenge: { start: "Tapşırığa başla" },
  sandbox: {
    back: "Tapşırıqlara qayıt",
    objectives: "Məqsədlər",
    hintShow: "İpucunu göstər",
    hintHide: "İpucunu gizlət",
    submitLabel: "Flag / həll təqdim et",
    verify: "Yoxla və mükafatı al",
    wrongFlag: "Bu doğru flag deyil — çıxışını yoxla və yenidən cəhd et.",
  },
  terminal: { live: "canlı", placeholder: "əmr yaz…", send: "Göndər" },
  success: {
    title: "Tapşırıq tamamlandı!",
    usdt: "balansına əlavə edildi",
    xp: "qazanılan XP",
    back: "Tapşırıqlara qayıt",
  },
  overview: {
    welcome: "Yenidən xoş gəldin",
    subtitle: "Bu həftəki irəliləyişin belə görünür.",
    statBalance: "Cüzdan balansı",
    statXp: "Ümumi XP",
    statSolved: "Həll edilmiş tapşırıqlar",
    statRank: "Qlobal reytinq",
  },
  placeholder: {
    leaderboardTitle: "Reytinq cədvəli",
    leaderboardNote: "3-cü mövsümün reytinqi hər bazar ertəsi saat 00:00 UTC-də yenilənir.",
    walletTitle: "Cüzdan və çıxarış",
    walletNote: "Çıxarışlar 24 saat ərzində həyata keçirilir.",
    settingsTitle: "Tənzimləmələr",
    settingsNote: "Profil, bildiriş və təhlükəsizlik seçimləri burada yerləşir.",
  },
  settingsModal: {
    title: "Tənzimləmələr",
    tabAccount: "Hesab",
    tabPreferences: "Tətbiq seçimləri",
    tabSecurity: "Təhlükəsizlik",
    accountName: "Görünən ad",
    accountEmail: "E-poçt",
    accountRank: "Rütbə",
    accountAvatar: "Profil şəkli",
    accountAvatarChange: "Avatarı dəyiş",
    accountSave: "Dəyişiklikləri yadda saxla",
    accountSaved: "Dəyişikliklər yadda saxlanıldı",
    languageHint: "Menyularda, düymələrdə və mesajlarda istifadə olunan dili seç.",
    prefThemeLabel: "Görünüş",
    themeDark: "Tünd",
    themeLight: "Açıq",
    themeSystem: "Sistem",
    prefNotifLabel: "Bildirişlər",
    notifEmailLabel: "E-poçt bildirişləri",
    notifBrowserLabel: "Brauzer bildirişləri",
    done: "Hazırdır",
    accountFirstName: "Ad",
    accountLastName: "Soyad",
    accountAvatarRemove: "Sil",
    accountAvatarHint: "PNG, JPG və ya WebP, 2 MB-a qədər.",
    accountAvatarInvalid: "2 MB-a qədər PNG, JPG və ya WebP şəkil seç.",
    accountEmailInvalid: "Düzgün e-poçt ünvanı daxil et.",
    accountNameRequired: "Ad mütləqdir.",
  },
  security: {
    title: "Təhlükəsizlik",
    changePassword: "Şifrəni dəyiş",
    currentPassword: "Cari şifrə",
    newPassword: "Yeni şifrə",
    confirmPassword: "Yeni şifrəni təsdiqlə",
    updateButton: "Şifrəni yenilə",
    mismatch: "Yeni şifrələr uyğun gəlmir.",
    weakPassword: "Yeni şifrə ən azı 8 simvoldan ibarət olmalıdır.",
    success: "Şifrə yeniləndi.",
    twoFactor: "İki mərhələli doğrulama",
    twoFactorOn: "Aktivdir",
    twoFactorOff: "Deaktivdir",
    enableButton: "2FA-nı aktivləşdir",
    disableButton: "2FA-nı deaktiv et",
  },
  sidebar: {
    nextTierTitle: "Növbəti ödəniş pilləsi",
    nextTierNote: "50 $+ sponsor mükafatlarını açmaq üçün 15-ci səviyyəyə çat.",
  },
  twoFa: {
    title: "İki mərhələli doğrulamanı aktivləşdir",
    guestEmailNote: "Girişin olan istənilən e-poçt ünvanından istifadə edə bilərsən.",
    intro: "6 rəqəmli kodu qeydiyyatdan keçdiyin e-poçt ünvanına göndərəcəyik.",
    sendCode: "Kod göndər",
    sending: "Göndərilir…",
    sentTo: "6 rəqəmli kodu bura göndərdik:",
    codeLabel: "Doğrulama kodu",
    verify: "Təsdiqlə və aktivləşdir",
    resend: "Kodu yenidən göndər",
    resendIn: "Yenidən göndər:",
    invalidCode: "Kod düzgün deyil. Yenidən cəhd et.",
    tooMany: "Həddindən çox cəhd. Yeni kod tələb et.",
    cancel: "Ləğv et",
    back: "Geri",
    demoNote: "Demo rejim — server qoşulmayıb. Kodun:",
    enabledToast: "2FA uğurla aktivləşdirildi!",
  },
  walletModal: {
    title: "Cüzdan",
    totalBalance: "Ümumi balans",
    withdraw: "Vəsait çıxar",
    amount: "Məbləğ (USDT)",
    method: "Ödəniş metodu",
    methodUsdt: "Kripto (USDT)",
    methodCard: "Bank kartı",
    submit: "Çıxarış tələb et",
    historyTitle: "Əməliyyat tarixçəsi",
    historyEmpty: "Hələ heç bir əməliyyat yoxdur.",
    insufficientBalance: "Bu çıxarış üçün balansın kifayət etmir.",
    invalidAmount: "Düzgün məbləğ daxil et.",
    withdrawSuccess: "Tələb göndərildi!",
    tabWithdraw: "Çıxarış",
    tabDeposit: "Artır",
    tabHistory: "Tarixçə",
    walletAddress: "Cüzdan ünvanı",
    walletAddressCard: "Kart nömrəsi",
    network: "Şəbəkə",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "Min. çıxarış $10.00",
    addressRequired: "Cüzdan ünvanı və ya kart nömrəsi daxil et.",
    belowMinimum: "Minimum çıxarış məbləği $10.00-dır.",
    depositTitle: "Balansın artırılması",
    depositAmount: "Məbləğ (USDT)",
    depositButton: "Balansı artır",
    depositNote: "Demo artırma — test üçün balansına dərhal vəsait əlavə edir.",
    depositSuccess: "Balans artırıldı!",
    statusCompleted: "Tamamlandı",
    statusPending: "Gözləmədə",
  },
  xpModal: {
    title: "Səviyyə və XP",
    nextRewardTitle: "Növbəti səviyyə mükafatı",
    nextRewardLabel: "Səviyyə {level}-yə keçdikdə: +${amount} Bonus və VIP Nişan",
    currentLevel: "Cari səviyyə",
    nextLevel: "Növbəti səviyyə",
    progressLabel: "Növbəti səviyyəyə qədər {cur} / {goal} XP",
    historyTitle: "Qazanılan XP",
    historyEmpty: "XP qazanmaq üçün bir tapşırığı həll et.",
  },
  leaderboardModal: {
    title: "İlk 100 liderlər lövhəsi",
    yourRank: "Sənin reytinqin",
    periodWeekly: "Həftəlik",
    periodMonthly: "Aylıq",
    periodAll: "Ümumi",
  },
  rank: {
    redTeamer: "Red Teamer",
    bugHunter: "Bug Hunter",
    pentester: "Pentester",
    rookie: "Yeni başlayan",
    eliteHacker: "Elit Haker",
  },
};

const tr: typeof en_US = {
  common: { search: "Görevlerde ara…", success: "Başarıyla tamamlandı!" },
  nav: {
    dashboard: "Panel",
    challenges: "Görevler / Sandbox'lar",
    leaderboard: "Liderlik tablosu",
    wallet: "Cüzdan ve para çekme",
    settings: "Ayarlar",
  },
  header: { signIn: "Giriş yap", getStarted: "Başla" },
  auth: {
    loginTitle: "Tekrar hoş geldin",
    registerTitle: "Hesap oluştur",
    email: "E-posta",
    password: "Şifre",
    confirmPassword: "Şifreyi onayla",
    username: "Kullanıcı adı",
    loginButton: "Giriş yap",
    registerButton: "Hesap oluştur",
    continueGuest: "Misafir olarak devam et",
    noAccount: "Hesabın yok mu?",
    haveAccount: "Zaten hesabın var mı?",
    orDivider: "veya",
    error: "Lütfen tüm alanları doldurun.",
    mismatch: "Şifreler eşleşmiyor.",
  },
  profile: {
    profileSettings: "Profil ayarları",
    settings: "Ayarlar",
    signOut: "Çıkış yap",
  },
  notifications: {
    title: "Bildirimler",
    markAllRead: "Tümünü okundu işaretle",
    item1: '"Auth Log Hunt" gönderimin doğrulandı — 15.00 USDT bakiyene eklendi.',
    item2: "Smart Contracts parkuruna yeni bir sponsor ödülü eklendi.",
    item3: "Küresel liderlik tablosunda #412 sıraya yükseldin.",
    item4: "Haftalık ödeme grubu başarıyla işlendi.",
  },
  language: { select: "Dil" },
  landing: {
    badge: "Siber güvenliği öğren. Pratik yaparak kazan.",
    title: "Gerçek dünya hacking becerilerinde ustalaş. Tarayıcında.",
    subtitle:
      "Linux, web güvenliği, akıllı sözleşmeler ve Python üzerinde canlı sandbox görevlerini çöz — çözdüğün her görev için gerçek USDT kazan.",
    ctaPrimary: "Başla",
    ctaSecondary: "Giriş yap",
  },
  catalog: {
    title: "Görevler",
    subtitle: "Bir sandbox seç, canlı olarak çöz, doğrulanır doğrulanmaz ödemeni al.",
  },
  filters: { all: "Tümü", linux: "Linux", web: "Web Güvenliği", smart: "Akıllı Sözleşmeler", python: "Python" },
  difficulty: { easy: "Kolay", medium: "Orta", hard: "Zor" },
  challenge: { start: "Göreve başla" },
  sandbox: {
    back: "Görevlere dön",
    objectives: "Hedefler",
    hintShow: "İpucunu göster",
    hintHide: "İpucunu gizle",
    submitLabel: "Flag / çözüm gönder",
    verify: "Doğrula ve ödülü al",
    wrongFlag: "Bu doğru flag değil — çıktını kontrol edip tekrar dene.",
  },
  terminal: { live: "canlı", placeholder: "bir komut yaz…", send: "Gönder" },
  success: {
    title: "Görev tamamlandı!",
    usdt: "bakiyene eklendi",
    xp: "kazanılan XP",
    back: "Görevlere dön",
  },
  overview: {
    welcome: "Tekrar hoş geldin",
    subtitle: "Bu haftaki ilerlemen böyle görünüyor.",
    statBalance: "Cüzdan bakiyesi",
    statXp: "Toplam XP",
    statSolved: "Çözülen görevler",
    statRank: "Küresel sıralama",
  },
  placeholder: {
    leaderboardTitle: "Liderlik tablosu",
    leaderboardNote: "3. sezon sıralaması her Pazartesi 00:00 UTC'de yenilenir.",
    walletTitle: "Cüzdan ve para çekme",
    walletNote: "Para çekme işlemleri 24 saat içinde tamamlanır.",
    settingsTitle: "Ayarlar",
    settingsNote: "Profil, bildirim ve güvenlik tercihleri burada bulunur.",
  },
  settingsModal: {
    title: "Ayarlar",
    tabAccount: "Hesap",
    tabPreferences: "Uygulama tercihleri",
    tabSecurity: "Güvenlik",
    accountName: "Görünen ad",
    accountEmail: "E-posta",
    accountRank: "Rütbe",
    accountAvatar: "Profil resmi",
    accountAvatarChange: "Avatarı değiştir",
    accountSave: "Değişiklikleri kaydet",
    accountSaved: "Değişiklikler kaydedildi",
    languageHint: "Menülerde, düğmelerde ve mesajlarda kullanılan dili seç.",
    prefThemeLabel: "Tema",
    themeDark: "Koyu",
    themeLight: "Açık",
    themeSystem: "Sistem",
    prefNotifLabel: "Bildirimler",
    notifEmailLabel: "E-posta bildirimleri",
    notifBrowserLabel: "Tarayıcı bildirimleri",
    done: "Bitti",
    accountFirstName: "Ad",
    accountLastName: "Soyad",
    accountAvatarRemove: "Kaldır",
    accountAvatarHint: "PNG, JPG veya WebP, en fazla 2 MB.",
    accountAvatarInvalid: "En fazla 2 MB boyutunda PNG, JPG veya WebP görsel seç.",
    accountEmailInvalid: "Geçerli bir e-posta adresi gir.",
    accountNameRequired: "Ad zorunludur.",
  },
  security: {
    title: "Güvenlik",
    changePassword: "Şifreyi değiştir",
    currentPassword: "Mevcut şifre",
    newPassword: "Yeni şifre",
    confirmPassword: "Yeni şifreyi onayla",
    updateButton: "Şifreyi güncelle",
    mismatch: "Yeni şifreler eşleşmiyor.",
    weakPassword: "Yeni şifre en az 8 karakter olmalı.",
    success: "Şifre güncellendi.",
    twoFactor: "İki faktörlü doğrulama",
    twoFactorOn: "Etkin",
    twoFactorOff: "Devre dışı",
    enableButton: "2FA'yı etkinleştir",
    disableButton: "2FA'yı devre dışı bırak",
  },
  sidebar: {
    nextTierTitle: "Sıradaki ödeme kademesi",
    nextTierNote: "50$+ sponsor ödüllerinin kilidini açmak için 15. seviyeye ulaş.",
  },
  twoFa: {
    title: "İki faktörlü doğrulamayı etkinleştir",
    guestEmailNote: "Erişimin olan herhangi bir e-posta adresini kullanabilirsin.",
    intro: "6 haneli kodu kayıt olduğun e-posta adresine göndereceğiz.",
    sendCode: "Kod gönder",
    sending: "Gönderiliyor…",
    sentTo: "6 haneli kodu şuraya gönderdik:",
    codeLabel: "Doğrulama kodu",
    verify: "Doğrula ve etkinleştir",
    resend: "Kodu tekrar gönder",
    resendIn: "Tekrar gönder:",
    invalidCode: "Kod yanlış. Tekrar dene.",
    tooMany: "Çok fazla deneme. Yeni kod iste.",
    cancel: "İptal",
    back: "Geri",
    demoNote: "Demo modu — sunucu bağlı değil. Kodun:",
    enabledToast: "İki faktörlü doğrulama etkinleştirildi!",
  },
  walletModal: {
    title: "Cüzdan",
    totalBalance: "Toplam bakiye",
    withdraw: "Para çek",
    amount: "Tutar (USDT)",
    method: "Ödeme yöntemi",
    methodUsdt: "Kripto (USDT)",
    methodCard: "Banka kartı",
    submit: "Çekim talep et",
    historyTitle: "İşlem geçmişi",
    historyEmpty: "Henüz işlem yok.",
    insufficientBalance: "Bu çekim için bakiyen yeterli değil.",
    invalidAmount: "Geçerli bir tutar gir.",
    withdrawSuccess: "Talep gönderildi!",
    tabWithdraw: "Çekim",
    tabDeposit: "Yatırma",
    tabHistory: "Geçmiş",
    walletAddress: "Cüzdan adresi",
    walletAddressCard: "Kart numarası",
    network: "Ağ",
    networkTrc20: "TRC20",
    networkErc20: "ERC20",
    networkBep20: "BEP20",
    minWithdraw: "Min. çekim: $10.00",
    addressRequired: "Bir cüzdan adresi veya kart numarası gir.",
    belowMinimum: "Minimum çekim tutarı $10.00'dır.",
    depositTitle: "Bakiye yükleme",
    depositAmount: "Tutar (USDT)",
    depositButton: "Bakiye ekle",
    depositNote: "Demo yükleme — test amaçlı bakiyene anında fon ekler.",
    depositSuccess: "Bakiye yüklendi!",
    statusCompleted: "Tamamlandı",
    statusPending: "Beklemede",
  },
  xpModal: {
    title: "Seviye ve XP",
    nextRewardTitle: "Sonraki seviye ödülü",
    nextRewardLabel: "Seviye {level}'e ulaştığında: +${amount} Bonus ve VIP Rozeti",
    currentLevel: "Mevcut seviye",
    nextLevel: "Sonraki seviye",
    progressLabel: "Sonraki seviyeye {cur} / {goal} XP",
    historyTitle: "Kazanılan XP",
    historyEmpty: "XP kazanmaya başlamak için bir görevi çöz.",
  },
  leaderboardModal: {
    title: "İlk 100 liderlik tablosu",
    yourRank: "Senin sıran",
    periodWeekly: "Haftalık",
    periodMonthly: "Aylık",
    periodAll: "Tüm zamanlar",
  },
  rank: {
    redTeamer: "Red Teamer",
    bugHunter: "Bug Hunter",
    pentester: "Pentester",
    rookie: "Acemi",
    eliteHacker: "Elit Hacker",
  },
};

const TRANSLATIONS: Record<LangCode, typeof en_US> = {
  "en-US": en_US,
  "en-GB": en_GB,
  az,
  tr,
  ru,
  zh,
  de,
  es,
};

function getTranslation(lang: LangCode): typeof en_US {
  return TRANSLATIONS[lang] ?? TRANSLATIONS[DEFAULT_LANG];
}

/* ---------------------------------------------------------------------------- */
/*  THEME TOKENS
    (source: lib/theme.ts)  */
/* ---------------------------------------------------------------------------- */

type ThemeMode = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeTokens {
  appBg: string;
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  text: string;
  subtext: string;
  mutedText: string;
  accent: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  inputBg: string;
  inputBorder: string;
  terminalBg: string;
  terminalText: string;
  danger: string;
  hoverText: string;
  placeholder: string;
  accentSoft: string;
}

const THEME_TOKENS: Record<ResolvedTheme, ThemeTokens> = {
  dark: {
    appBg: "bg-slate-950",
    panelBg: "bg-slate-900/70",
    panelBorder: "border-slate-800",
    cardBg: "bg-slate-900",
    cardBorder: "border-slate-800",
    cardHover: "hover:border-emerald-500/50",
    text: "text-slate-100",
    subtext: "text-slate-400",
    mutedText: "text-slate-500",
    accent: "text-emerald-400",
    accentText: "text-slate-950",
    accentBg: "bg-emerald-500",
    accentBorder: "border-emerald-500",
    inputBg: "bg-slate-950",
    inputBorder: "border-slate-700",
    terminalBg: "bg-black",
    terminalText: "text-emerald-400",
    danger: "text-red-400",
    hoverText: "hover:text-white",
    placeholder: "placeholder:text-slate-500",
    accentSoft: "bg-emerald-500/10",
  },
  light: {
    appBg: "bg-slate-50",
    panelBg: "bg-white/80",
    panelBorder: "border-slate-200",
    cardBg: "bg-white",
    cardBorder: "border-slate-200",
    cardHover: "hover:border-emerald-500/60",
    text: "text-slate-900",
    subtext: "text-slate-600",
    mutedText: "text-slate-400",
    accent: "text-emerald-600",
    accentText: "text-white",
    accentBg: "bg-emerald-600",
    accentBorder: "border-emerald-600",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-300",
    terminalBg: "bg-slate-950",
    terminalText: "text-emerald-400",
    danger: "text-red-600",
    hoverText: "hover:text-slate-900",
    placeholder: "placeholder:text-slate-400",
    accentSoft: "bg-emerald-600/10",
  },
};

/* ---------------------------------------------------------------------------- */
/*  MOCK DATA
    (source: lib/mock-data.ts)  */
/* ---------------------------------------------------------------------------- */

type Track = "linux" | "web" | "smart" | "python";
type Difficulty = "easy" | "medium" | "hard";

interface Challenge {
  id: string;
  track: Track;
  difficulty: Difficulty;
  title: string;
  description: string;
  objectives: string[];
  hint: string;
  rewardUsdt: number;
  xp: number;
  flag: string;
  terminalIntro: string[];
  terminalResponses: Record<string, string[]>;
}

const CHALLENGES: Challenge[] = [
  {
    id: "auth-log-hunt",
    track: "linux",
    difficulty: "easy",
    title: "Auth Log Hunt",
    description:
      "A shared box has been fielding brute-force attempts. Dig through the auth log and pull out the flag left behind by the last successful login.",
    objectives: [
      "Inspect /var/log/auth.log for successful logins",
      "Identify the session opened from an unfamiliar IP",
      "Recover the flag embedded in that session's comment",
    ],
    hint: "grep for \"Accepted password\" and look at the line right after the last failed attempt streak.",
    rewardUsdt: 15,
    xp: 120,
    flag: "CE{auth_log_9f21}",
    terminalIntro: [
      "Connected to sandbox: auth-log-hunt-01",
      "Type `ls` to see what's here.",
    ],
    terminalResponses: {
      ls: ["auth.log", "notes.txt"],
      "cat notes.txt": ["Someone got in around 03:14 UTC. Check auth.log."],
      "cat auth.log": [
        "03:11:02 Failed password for root from 185.22.14.9",
        "03:11:04 Failed password for root from 185.22.14.9",
        "03:14:51 Accepted password for root from 185.22.14.9",
        "# session-comment: CE{auth_log_9f21}",
      ],
      "grep Accepted auth.log": [
        "03:14:51 Accepted password for root from 185.22.14.9",
        "# session-comment: CE{auth_log_9f21}",
      ],
      whoami: ["ce-sandbox-user"],
    },
  },
  {
    id: "reflected-xss",
    track: "web",
    difficulty: "easy",
    title: "Reflected Input",
    description:
      "The sandbox's feedback form echoes your input straight back onto the page. Prove you can make the page execute something it didn't expect, and read the flag from the admin's cookie note.",
    objectives: [
      "Find the parameter that gets reflected without escaping",
      "Confirm you can break out of the surrounding HTML",
      "Recover the flag left in the admin notice",
    ],
    hint: "Try submitting a value containing angle brackets and see what comes back in the response.",
    rewardUsdt: 20,
    xp: 150,
    flag: "CE{reflected_7cd0}",
    terminalIntro: [
      "Connected to sandbox: reflected-input-01",
      "Type `curl /feedback?msg=test` to inspect the endpoint.",
    ],
    terminalResponses: {
      "curl /feedback?msg=test": [
        '<div class="msg">test</div>',
        "<!-- admin note: flag ships once you prove reflection -->",
      ],
      "curl /feedback?msg=<b>hi</b>": [
        "<div class=\"msg\"><b>hi</b></div>",
        "<!-- unescaped! admin note updated -->",
        "<!-- CE{reflected_7cd0} -->",
      ],
      ls: ["feedback.php", "admin_notes.txt"],
      "cat admin_notes.txt": ["Reminder: sanitize msg param before next release."],
    },
  },
  {
    id: "vault-reentrancy",
    track: "smart",
    difficulty: "hard",
    title: "Vault Reentrancy",
    description:
      "A toy vault contract lets you withdraw before it updates your balance. Drain it in the sandbox network to prove the exploit and reveal the flag stored in the deployer's log.",
    objectives: [
      "Read the Vault contract's withdraw() function",
      "Identify the missing checks-effects-interactions ordering",
      "Trigger a reentrant withdrawal via the attacker contract",
    ],
    hint: "The balance is only zeroed out after the external call sends funds — call back in before that line runs.",
    rewardUsdt: 45,
    xp: 300,
    flag: "CE{vault_reentry_3af9}",
    terminalIntro: [
      "Connected to sandbox: vault-reentrancy-01",
      "Type `cat Vault.sol` to read the contract.",
    ],
    terminalResponses: {
      "cat vault.sol": [
        "function withdraw() public {",
        "  (bool ok, ) = msg.sender.call{value: balances[msg.sender]}(\"\");",
        "  require(ok);",
        "  balances[msg.sender] = 0;",
        "}",
      ],
      "cat vault.sol -v": [
        "// deployer log:",
        "// vault drained successfully -> CE{vault_reentry_3af9}",
      ],
      "deploy attacker.sol": ["Attacker contract deployed at 0xATT...01"],
      "attacker.attack()": [
        "Reentrant call #1 succeeded",
        "Reentrant call #2 succeeded",
        "Vault balance: 0 ETH",
        "// CE{vault_reentry_3af9}",
      ],
    },
  },
  {
    id: "pickled-secrets",
    track: "python",
    difficulty: "medium",
    title: "Pickled Secrets",
    description:
      "A internal tool deserializes user-supplied data with pickle. Work out what that lets you do, and recover the flag the process was hiding in its environment.",
    objectives: [
      "Understand why unpickling untrusted input is dangerous",
      "Craft a payload that runs during deserialization",
      "Read the flag out of the process environment",
    ],
    hint: "__reduce__ lets a class control exactly what runs when it's unpickled.",
    rewardUsdt: 25,
    xp: 180,
    flag: "CE{pickle_env_5b6e}",
    terminalIntro: [
      "Connected to sandbox: pickled-secrets-01",
      "Type `cat service.py` to see what's running.",
    ],
    terminalResponses: {
      "cat service.py": [
        "import pickle",
        "def handle(data):",
        "    return pickle.loads(data)  # trusts caller input",
      ],
      "python3 exploit.py": [
        "Sending crafted payload…",
        "Payload deserialized on target",
        "os.environ dump captured",
      ],
      "cat leaked_env.txt": ["FLAG=CE{pickle_env_5b6e}", "PATH=/usr/bin:/bin"],
      env: ["FLAG=CE{pickle_env_5b6e}", "PATH=/usr/bin:/bin"],
    },
  },
  {
    id: "cron-privesc",
    track: "linux",
    difficulty: "medium",
    title: "Cron Privesc",
    description:
      "A world-writable script runs on a schedule as root. Work out how to ride it to a higher-privileged shell and collect the flag it drops.",
    objectives: [
      "Find the cron job running with elevated privileges",
      "Confirm the script it calls is writable by your user",
      "Use it to read the root-only flag file",
    ],
    hint: "`ls -la` on the script referenced in the crontab tells you everything you need.",
    rewardUsdt: 30,
    xp: 220,
    flag: "CE{cron_privesc_1d4a}",
    terminalIntro: [
      "Connected to sandbox: cron-privesc-01",
      "Type `crontab -l` to see scheduled jobs.",
    ],
    terminalResponses: {
      "crontab -l": ["*/5 * * * * root /opt/scripts/cleanup.sh"],
      "ls -la /opt/scripts/cleanup.sh": [
        "-rwxrwxrwx 1 root root 214 cleanup.sh",
      ],
      "cat /root/flag.txt": ["Permission denied"],
      "echo 'cat /root/flag.txt > /tmp/out' >> /opt/scripts/cleanup.sh": [
        "Waiting for the next cron tick…",
      ],
      "cat /tmp/out": ["CE{cron_privesc_1d4a}"],
    },
  },
  {
    id: "broken-jwt",
    track: "web",
    difficulty: "medium",
    title: "Broken JWT",
    description:
      "This API trusts the alg field of the JWT it's handed. Forge a token that gets you admin access and reveals the flag on the admin endpoint.",
    objectives: [
      "Decode the JWT and inspect the header and payload",
      "Switch the algorithm to none or forge a matching signature",
      "Hit /admin with the forged token",
    ],
    hint: "Some JWT libraries will happily accept alg: none if the server never enforces an allow-list.",
    rewardUsdt: 28,
    xp: 200,
    flag: "CE{jwt_alg_none_88c2}",
    terminalIntro: [
      "Connected to sandbox: broken-jwt-01",
      "Type `curl /me -H \"Authorization: Bearer <token>\"` to check your session.",
    ],
    terminalResponses: {
      "decode token": [
        '{"alg":"HS256","typ":"JWT"}',
        '{"user":"guest","admin":false}',
      ],
      "forge token": [
        "Header alg set to none, signature stripped",
        "New token ready",
      ],
      "curl /admin -H forged-token": [
        "200 OK",
        "Welcome, admin.",
        "flag: CE{jwt_alg_none_88c2}",
      ],
    },
  },
];

interface LeaderboardEntry {
  rank: number;
  name: string;
  country: string;
  xp: number;
  solved: number;
}

const LB_ADJ = [
  "Shadow", "Null", "Cipher", "Ghost", "Byte", "Root", "Neon", "Vortex", "Static", "Phantom",
  "Quantum", "Silent", "Crimson", "Obsidian", "Glitch", "Frost", "Iron", "Solar", "Lunar", "Vector",
];
const LB_NOUN = [
  "Fox", "Wolf", "Hawk", "Serpent", "Raven", "Falcon", "Viper", "Panther", "Cobra", "Tiger",
  "Eagle", "Lynx", "Drake", "Shark", "Owl",
];
const LB_FLAGS = [
  "🇩🇪", "🇹🇷", "🇪🇸", "🇦🇿", "🇷🇺", "🇨🇳", "🇺🇸", "🇬🇧", "🇫🇷", "🇮🇹",
  "🇧🇷", "🇮🇳", "🇯🇵", "🇰🇷", "🇨🇦", "🇦🇺", "🇳🇱", "🇸🇪", "🇵🇱", "🇺🇦",
];

/** Top 5 are curated; 6-100 are generated deterministically (same list on every load). */
function buildTop100(): LeaderboardEntry[] {
  const curated: LeaderboardEntry[] = [
    { rank: 1, name: "n0xroot", country: "🇩🇪", xp: 48210, solved: 214 },
    { rank: 2, name: "kismet_", country: "🇹🇷", xp: 46980, solved: 201 },
    { rank: 3, name: "0xSalty", country: "🇪🇸", xp: 44510, solved: 197 },
    { rank: 4, name: "gulnara.az", country: "🇦🇿", xp: 41200, solved: 183 },
    { rank: 5, name: "reentry_king", country: "🇷🇺", xp: 39870, solved: 176 },
  ];
  const generated: LeaderboardEntry[] = [];
  for (let rank = 6; rank <= 100; rank++) {
    const i = rank - 6;
    const name = `${LB_ADJ[i % LB_ADJ.length]}${LB_NOUN[(i * 3 + 1) % LB_NOUN.length]}${100 + rank}`;
    const xp = Math.max(600, 39400 - (rank - 5) * 365);
    const solved = Math.max(6, Math.round(xp / 205));
    const country = LB_FLAGS[i % LB_FLAGS.length];
    generated.push({ rank, name, country, xp, solved });
  }
  return [...curated, ...generated];
}

const TOP_100: LeaderboardEntry[] = buildTop100();

const XP_PER_LEVEL = 1000;
/** Flat demo bonus paid out for reaching the next level, shown in the XP modal. */
const NEXT_LEVEL_BONUS_USDT = 5;

/** Time-period filter for the leaderboard: purely cosmetic scaling of the same mock data. */
type LeaderboardPeriod = "weekly" | "monthly" | "all";
const LB_PERIOD_SCALE: Record<LeaderboardPeriod, number> = { weekly: 0.06, monthly: 0.25, all: 1 };

/** Rank badge shown next to a player's name, derived from their XP. */
type RankTierKey = "eliteHacker" | "redTeamer" | "bugHunter" | "pentester" | "rookie";
function rankTierKey(xp: number): RankTierKey {
  if (xp >= 40000) return "eliteHacker";
  if (xp >= 20000) return "redTeamer";
  if (xp >= 8000) return "bugHunter";
  if (xp >= 2000) return "pentester";
  return "rookie";
}

const AVATAR_PALETTE = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#0ea5e9", "#a855f7", "#ec4899", "#14b8a6"];
function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
function MiniAvatar({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        background: colorForName(name),
        fontSize: size * 0.5,
      }}
      className="inline-flex shrink-0 items-center justify-center font-bold text-white"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

interface HistoryEntry {
  id: string;
  kind: "reward" | "withdrawal" | "deposit";
  title: string;
  amount: number;
  xp: number;
  at: number;
  status: "completed" | "pending";
}

type WithdrawMethod = "usdt" | "card";
type WithdrawNetwork = "trc20" | "erc20" | "bep20";

const MIN_WITHDRAW_USDT = 10;

function maskAddress(value: string): string {
  const v = value.trim();
  if (v.length <= 10) return v;
  return `${v.slice(0, 6)}…${v.slice(-4)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function composeName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "U";
}

interface AppUser {
  firstName: string;
  lastName: string;
  name: string; // display name = firstName + lastName
  email: string;
  avatarUrl: string | null;
  avatarInitial: string;
  guest: boolean;
  balanceUsdt: number;
  xp: number;
  solvedIds: string[];
  history: HistoryEntry[];
  level: number;
  rank: number;
  twoFactorEnabled: boolean;
  twoFactorTarget: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
}

function makeGuestUser(name: string, email: string, guest = false): AppUser {
  const [first, ...rest] = name.trim().split(/\s+/);
  const firstName = first || "User";
  const lastName = rest.join(" ");
  const displayName = composeName(firstName, lastName);
  return {
    firstName,
    lastName,
    name: displayName,
    email,
    avatarUrl: null,
    avatarInitial: initialOf(displayName),
    guest,
    balanceUsdt: 0,
    xp: 0,
    solvedIds: [],
    history: [],
    level: 1,
    rank: 8213,
    twoFactorEnabled: false,
    twoFactorTarget: "",
    emailNotifications: true,
    browserNotifications: true,
  };
}


/* ---------------------------------------------------------------------------- */
/*  APP CONTEXT
    (source: lib/app-context.tsx)  */
/* ---------------------------------------------------------------------------- */

type DashboardTab = "overview" | "challenges" | "sandbox" | "leaderboard" | "wallet";
type AuthMode = "login" | "register" | null;

const PREFS_KEY = "cyberearn:prefs";
const avatarKey = (email: string) => `cyberearn:avatar:${email.trim().toLowerCase()}`;

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage full / unavailable — ignore
  }
}
function storageRemove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
function readStoredPrefs(): Partial<Pick<AppUser, "emailNotifications" | "browserNotifications">> {
  const raw = storageGet(PREFS_KEY);
  if (!raw) return {};
  try {
    const p = JSON.parse(raw);
    return {
      ...(typeof p.emailNotifications === "boolean" ? { emailNotifications: p.emailNotifications } : {}),
      ...(typeof p.browserNotifications === "boolean" ? { browserNotifications: p.browserNotifications } : {}),
    };
  } catch {
    return {};
  }
}

type MenuName = "lang" | "notif" | "profile";
type CategoryFilter = "all" | Track;

type StatModal = "wallet" | "xp" | "leaderboard" | null;

interface AppContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: typeof en_US;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
  tokens: ThemeTokens;
  user: AppUser | null;
  isGuest: boolean;
  login: (email: string, _password: string) => void;
  register: (username: string, email: string, _password: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
  updateUser: (patch: Partial<AppUser>) => void;
  markSolved: (challenge: Challenge) => void;
  withdraw: (amount: number, method: WithdrawMethod, detail: string) => { ok: boolean; error?: string };
  deposit: (amount: number) => { ok: boolean; error?: string };
  authMode: AuthMode;
  openAuth: (mode: Exclude<AuthMode, null>) => void;
  closeAuth: () => void;
  settingsOpen: boolean;
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  /** Only one header dropdown can be open at a time. */
  activeMenu: MenuName | null;
  setActiveMenu: (menu: MenuName | null) => void;
  /** Only one stat-card popup (wallet / XP / leaderboard) can be open at a time. */
  statModal: StatModal;
  openStatModal: (modal: Exclude<StatModal, null>) => void;
  closeStatModal: () => void;
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
  view: "landing" | "dashboard";
  goToDashboard: () => void;
  goToLanding: () => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  /** Lives in context (not in the catalog) so the filter bar never depends on which tab was visited. */
  categoryFilter: CategoryFilter;
  setCategoryFilter: (filter: CategoryFilter) => void;
  activeChallengeId: string | null;
  openChallenge: (id: string) => void;
  successPayload: { rewardUsdt: number; xp: number } | null;
  clearSuccess: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}

function usePrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener?.("change", listener);
    return () => mq.removeEventListener?.("change", listener);
  }, []);
  return prefersDark;
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [user, setUser] = useState<AppUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("account");
  const [activeMenu, setActiveMenu] = useState<MenuName | null>(null);
  const [statModal, setStatModal] = useState<StatModal>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [view, setView] = useState<"landing" | "dashboard">("landing");
  const [dashboardTab, setDashboardTabRaw] = useState<DashboardTab>("challenges");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [successPayload, setSuccessPayload] = useState<{ rewardUsdt: number; xp: number } | null>(null);

  const prefersDark = usePrefersDark();
  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  // Toast auto-dismisses after 3 seconds; a later toast simply resets the timer.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast((cur) => (cur && cur.id === toast.id ? null : cur)), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const showToast = (message: string) => setToast({ id: Date.now(), message });

  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem("cyberearn:lang") as LangCode | null;
      const savedTheme = window.localStorage.getItem("cyberearn:theme") as ThemeMode | null;
      if (savedLang && TRANSLATIONS[savedLang]) setLangState(savedLang);
      if (savedTheme) setThemeState(savedTheme);
    } catch {
      // localStorage unavailable — fall back to defaults silently
    }
  }, []);

  // Persist notification switches and the avatar so they survive reloads / re-login.
  useEffect(() => {
    if (!user) return;
    storageSet(
      PREFS_KEY,
      JSON.stringify({
        emailNotifications: user.emailNotifications,
        browserNotifications: user.browserNotifications,
      })
    );
  }, [user?.emailNotifications, user?.browserNotifications]);

  useEffect(() => {
    if (!user) return;
    if (user.avatarUrl) storageSet(avatarKey(user.email), user.avatarUrl);
    else storageRemove(avatarKey(user.email));
  }, [user?.email, user?.avatarUrl]);

  const setLang = (next: LangCode) => {
    setLangState(next);
    try {
      window.localStorage.setItem("cyberearn:lang", next);
    } catch {
      // ignore persistence failures
    }
  };

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    try {
      window.localStorage.setItem("cyberearn:theme", next);
    } catch {
      // ignore persistence failures
    }
    showToast(getTranslation(lang).common.success);
  };

  const enterDashboard = (base: AppUser) => {
    const nextUser: AppUser = {
      ...base,
      ...readStoredPrefs(),
      avatarUrl: storageGet(avatarKey(base.email)) ?? base.avatarUrl,
    };
    setUser(nextUser);
    setAuthMode(null);
    setActiveMenu(null);
    setActiveChallengeId(null);
    setDashboardTabRaw("challenges");
    setView("dashboard");
  };

  const login: AppContextValue["login"] = (email) => {
    enterDashboard(makeGuestUser(email.split("@")[0] || "agent", email));
  };

  const register: AppContextValue["register"] = (username, email) => {
    enterDashboard(makeGuestUser(username, email));
  };

  const continueAsGuest = () => {
    enterDashboard(makeGuestUser("Guest", "guest@cyberearn.local", true));
  };

  const logout = () => {
    setActiveMenu(null);
    setSettingsOpen(false);
    setStatModal(null);
    setUser(null);
    setView("landing");
    setDashboardTabRaw("challenges");
    setCategoryFilter("all");
    setActiveChallengeId(null);
  };

  const updateUser = (patch: Partial<AppUser>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const markSolved = (challenge: Challenge) => {
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.solvedIds.includes(challenge.id)) return prev;
      const nextXp = prev.xp + challenge.xp;
      const entry: HistoryEntry = {
        id: `reward-${challenge.id}-${Date.now()}`,
        kind: "reward",
        title: challenge.title,
        amount: challenge.rewardUsdt,
        xp: challenge.xp,
        at: Date.now(),
        status: "completed",
      };
      return {
        ...prev,
        solvedIds: [...prev.solvedIds, challenge.id],
        history: [entry, ...prev.history],
        balanceUsdt: Math.round((prev.balanceUsdt + challenge.rewardUsdt) * 100) / 100,
        xp: nextXp,
        level: Math.max(1, Math.floor(nextXp / XP_PER_LEVEL) + 1),
      };
    });
    setSuccessPayload({ rewardUsdt: challenge.rewardUsdt, xp: challenge.xp });
  };

  const withdraw: AppContextValue["withdraw"] = (amount, method, detail) => {
    const currentT = getTranslation(lang);
    if (!user) return { ok: false, error: currentT.walletModal.invalidAmount };
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: currentT.walletModal.invalidAmount };
    }
    if (amount < MIN_WITHDRAW_USDT) {
      return { ok: false, error: currentT.walletModal.belowMinimum };
    }
    if (amount > user.balanceUsdt) {
      return { ok: false, error: currentT.walletModal.insufficientBalance };
    }
    const methodLabel = method === "usdt" ? currentT.walletModal.methodUsdt : currentT.walletModal.methodCard;
    const entry: HistoryEntry = {
      id: `withdrawal-${Date.now()}`,
      kind: "withdrawal",
      title: detail ? `${methodLabel} · ${detail}` : methodLabel,
      amount: -amount,
      xp: 0,
      at: Date.now(),
      // Real payouts take time to settle; shown as "pending" until an operator confirms it.
      status: "pending",
    };
    setUser((prev) =>
      prev
        ? {
            ...prev,
            balanceUsdt: Math.round((prev.balanceUsdt - amount) * 100) / 100,
            history: [entry, ...prev.history],
          }
        : prev
    );
    showToast(currentT.walletModal.withdrawSuccess);
    return { ok: true };
  };

  const deposit: AppContextValue["deposit"] = (amount) => {
    const currentT = getTranslation(lang);
    if (!user) return { ok: false, error: currentT.walletModal.invalidAmount };
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: currentT.walletModal.invalidAmount };
    }
    const entry: HistoryEntry = {
      id: `deposit-${Date.now()}`,
      kind: "deposit",
      title: currentT.walletModal.depositTitle,
      amount,
      xp: 0,
      at: Date.now(),
      status: "completed",
    };
    setUser((prev) =>
      prev
        ? {
            ...prev,
            balanceUsdt: Math.round((prev.balanceUsdt + amount) * 100) / 100,
            history: [entry, ...prev.history],
          }
        : prev
    );
    showToast(currentT.walletModal.depositSuccess);
    return { ok: true };
  };

  const value: AppContextValue = {
    lang,
    setLang,
    t: getTranslation(lang),
    theme,
    setTheme,
    resolvedTheme,
    tokens: THEME_TOKENS[resolvedTheme],
    user,
    isGuest: !!user && user.guest,
    login,
    register,
    continueAsGuest,
    logout,
    updateUser,
    markSolved,
    withdraw,
    deposit,
    authMode,
    // Opening one overlay always closes the others, so they can never stack or block each other.
    openAuth: (mode) => {
      setActiveMenu(null);
      setSettingsOpen(false);
      setAuthMode(mode);
    },
    closeAuth: () => setAuthMode(null),
    settingsOpen,
    settingsTab,
    setSettingsTab,
    openSettings: (tab = "account") => {
      setActiveMenu(null);
      setAuthMode(null);
      setSettingsTab(tab);
      setSettingsOpen(true);
    },
    closeSettings: () => setSettingsOpen(false),
    activeMenu,
    setActiveMenu,
    statModal,
    openStatModal: (modal) => {
      setActiveMenu(null);
      setStatModal(modal);
    },
    closeStatModal: () => setStatModal(null),
    toast,
    showToast,
    view,
    goToDashboard: () => setView("dashboard"),
    goToLanding: () => {
      setActiveMenu(null);
      setView("landing");
    },
    dashboardTab,
    setDashboardTab: (tab) => {
      setDashboardTabRaw(tab);
      if (tab !== "sandbox") setActiveChallengeId(null);
    },
    categoryFilter,
    setCategoryFilter,
    activeChallengeId,
    openChallenge: (id) => {
      setActiveChallengeId(id);
      setDashboardTabRaw("sandbox");
    },
    successPayload,
    clearSuccess: () => setSuccessPayload(null),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}


/* ---------------------------------------------------------------------------- */
/*  SMALL CONTROLS
    (source: components/controls.tsx)  */
/* ---------------------------------------------------------------------------- */

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: 44,
        height: 24,
        flexShrink: 0,
        border: 0,
        borderRadius: 9999,
        cursor: "pointer",
        transition: "background-color .2s",
        backgroundColor: checked ? "#10b981" : "rgba(100,116,139,0.5)",
      }}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 20,
          height: 20,
          borderRadius: 9999,
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.3)",
          transform: checked ? "translateX(20px)" : "translateX(0)",
          transition: "transform .2s",
        }}
      />
    </button>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  tokens,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  tokens: ThemeTokens;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border ${tokens.inputBorder} ${tokens.inputBg} ${tokens.text} px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className={`absolute inset-y-0 right-2 flex items-center ${tokens.mutedText} ${tokens.hoverText}`}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { t } = useApp();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[difficulty]}`}
    >
      {t.difficulty[difficulty]}
    </span>
  );
}

function TrackPill({ track }: { track: Track }) {
  const { t, tokens } = useApp();
  const label =
    track === "linux"
      ? t.filters.linux
      : track === "web"
      ? t.filters.web
      : track === "smart"
      ? t.filters.smart
      : t.filters.python;
  return (
    <span className={`rounded-md border ${tokens.panelBorder} px-2 py-0.5 text-xs ${tokens.subtext}`}>
      {label}
    </span>
  );
}

/**
 * Single-open dropdown behaviour: the open menu lives in context (activeMenu),
 * so two menus can never be open together. Outside click / Escape closes it.
 */
function useMenu(name: MenuName) {
  const { activeMenu, setActiveMenu } = useApp();
  const open = activeMenu === name;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setActiveMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setActiveMenu]);

  return {
    open,
    ref,
    toggle: () => setActiveMenu(open ? null : name),
    close: () => setActiveMenu(null),
  };
}

function Avatar({ initial, url, size = 32 }: { initial: string; url?: string | null; size?: number }) {
  const { tokens } = useApp();
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full ${tokens.accentBg} ${tokens.accentText} text-sm font-semibold`}
    >
      {initial}
    </div>
  );
}

/**
 * Shared modal shell. One z-index scale for every overlay:
 *   header 30 → header dropdowns 40 → modals 60 → nested modals / success 70.
 * Handles backdrop click, Escape (topmost modal only) and body scroll lock.
 */
const modalStack: symbol[] = [];

function ModalShell({
  onClose,
  children,
  z = 100,
  closeOnBackdrop = true,
}: {
  onClose: () => void;
  children: React.ReactNode;
  z?: number;
  closeOnBackdrop?: boolean;
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const id = Symbol("modal");
    modalStack.push(id);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStack[modalStack.length - 1] === id) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const idx = modalStack.indexOf(id);
      if (idx >= 0) modalStack.splice(idx, 1);
      document.body.style.overflow = modalStack.length === 0 ? "" : "hidden";
    };
  }, []);

  // Rendered inline (no portal). It is a sibling of <Header/> under the page root, and its
  // z-index (100 / 110 nested) sits far above the header (30) and header dropdowns (40).
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: z,
        background: "rgba(0,0,0,0.7)",
      }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}


/* ---------------------------------------------------------------------------- */
/*  DROPDOWN MENUS (notifications, profile, language)
    (source: components/menus.tsx)  */
/* ---------------------------------------------------------------------------- */

function LanguageMenu() {
  const { lang, setLang, tokens, t } = useApp();
  const { open, ref, toggle, close } = useMenu("lang");
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label={t.language.select}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-lg border ${tokens.panelBorder} px-2.5 py-1.5 text-sm ${tokens.text} ${tokens.cardHover}`}
      >
        <Globe size={15} className={tokens.subtext} />
        <span>{current.flag}</span>
        <ChevronDown size={14} className={tokens.subtext} />
      </button>
      {open && (
        <div
          className={`absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-xl`}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code);
                close();
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${tokens.text} hover:bg-emerald-500/10`}
            >
              <span className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {l.code === lang && <Check size={14} className={tokens.accent} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsMenu() {
  const { t, tokens } = useApp();
  const { open, ref, toggle } = useMenu("notif");
  const [unread, setUnread] = useState(3);
  const items = [t.notifications.item1, t.notifications.item2, t.notifications.item3, t.notifications.item4];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label={t.notifications.title}
        aria-expanded={open}
        className={`relative rounded-lg border ${tokens.panelBorder} p-2 ${tokens.text} ${tokens.cardHover}`}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-semibold text-white" style={{ fontSize: 10 }}>
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{ maxWidth: "calc(100vw - 2rem)" }}
          className={`absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-xl`}
        >
          <div className={`flex items-center justify-between border-b ${tokens.panelBorder} px-4 py-3`}>
            <span className={`text-sm font-semibold ${tokens.text}`}>{t.notifications.title}</span>
            <button
              type="button"
              onClick={() => setUnread(0)}
              className={`text-xs ${tokens.accent} hover:underline`}
            >
              {t.notifications.markAllRead}
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={i}
                className={`border-b ${tokens.panelBorder} px-4 py-3 text-sm ${tokens.subtext} last:border-b-0`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { user, t, tokens, logout, openSettings } = useApp();
  const { open, ref, toggle, close } = useMenu("profile");
  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg border ${tokens.panelBorder} py-1 pl-1 pr-2 ${tokens.cardHover}`}
      >
        <Avatar initial={user.avatarInitial} url={user.avatarUrl} size={28} />
        <ChevronDown size={14} className={tokens.subtext} />
      </button>
      {open && (
        <div
          className={`absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-xl`}
        >
          <div className={`border-b ${tokens.panelBorder} px-4 py-3`}>
            <p className={`truncate text-sm font-semibold ${tokens.text}`}>{user.name}</p>
            <p className={`truncate text-xs ${tokens.mutedText}`}>{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => openSettings("account")}
            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm ${tokens.text} hover:bg-emerald-500/10`}
          >
            <UserIcon size={15} />
            {t.profile.profileSettings}
          </button>
          <button
            type="button"
            onClick={() => openSettings("preferences")}
            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm ${tokens.text} hover:bg-emerald-500/10`}
          >
            <Settings size={15} />
            {t.profile.settings}
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={15} />
            {t.profile.signOut}
          </button>
        </div>
      )}
    </div>
  );
}



/* ---------------------------------------------------------------------------- */
/*  AUTH MODAL
    (source: components/auth-modal.tsx)  */
/* ---------------------------------------------------------------------------- */

function AuthModal() {
  const { authMode, closeAuth, openAuth, t, tokens, login, register, continueAsGuest } = useApp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, [authMode]);

  if (!authMode) return null;
  const isLogin = authMode === "login";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) {
      if (!email || !password) {
        setError(t.auth.error);
        return;
      }
      login(email, password);
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setError(t.auth.error);
        return;
      }
      if (password !== confirmPassword) {
        setError(t.auth.mismatch);
        return;
      }
      register(username, email, password);
    }
  }

  return (
    <ModalShell onClose={closeAuth}>
      <div className={`w-full max-w-sm rounded-2xl border ${tokens.panelBorder} ${tokens.cardBg} p-6 shadow-2xl`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${tokens.text}`}>
            {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
          </h2>
          <button type="button" onClick={closeAuth} className={tokens.mutedText} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div>
              <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.auth.username}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-lg border ${tokens.inputBorder} ${tokens.inputBg} ${tokens.text} px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40`}
              />
            </div>
          )}
          <div>
            <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.auth.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border ${tokens.inputBorder} ${tokens.inputBg} ${tokens.text} px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40`}
            />
          </div>
          <div>
            <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.auth.password}</label>
            <PasswordInput value={password} onChange={setPassword} placeholder="" tokens={tokens} />
          </div>
          {!isLogin && (
            <div>
              <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>
                {t.auth.confirmPassword}
              </label>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="" tokens={tokens} />
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className={`w-full rounded-lg ${tokens.accentBg} ${tokens.accentText} py-2.5 text-sm font-semibold transition hover:opacity-90`}
          >
            {isLogin ? t.auth.loginButton : t.auth.registerButton}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className={`h-px flex-1 ${tokens.panelBorder} border-t`} />
          <span className={`text-xs ${tokens.mutedText}`}>{t.auth.orDivider}</span>
          <div className={`h-px flex-1 ${tokens.panelBorder} border-t`} />
        </div>

        <button
          type="button"
          onClick={continueAsGuest}
          className={`w-full rounded-lg border ${tokens.panelBorder} py-2.5 text-sm font-medium ${tokens.text} ${tokens.cardHover}`}
        >
          {t.auth.continueGuest}
        </button>

        <p className={`mt-4 text-center text-xs ${tokens.mutedText}`}>
          {isLogin ? t.auth.noAccount : t.auth.haveAccount}{" "}
          <button
            type="button"
            onClick={() => openAuth(isLogin ? "register" : "login")}
            className={`font-medium ${tokens.accent} hover:underline`}
          >
            {isLogin ? t.auth.registerButton : t.auth.loginButton}
          </button>
        </p>
      </div>
    </ModalShell>
  );
}


/* ---------------------------------------------------------------------------- */
/*  SETTINGS MODAL
    (source: components/settings-modal.tsx)  */
/* ---------------------------------------------------------------------------- */

type SettingsTab = "account" | "preferences" | "security";

function SettingsModal() {
  const { settingsOpen, user } = useApp();
  // The dialog only mounts while open, so its form state is initialised from the
  // current user every time (no stale values, no empty first frame).
  if (!settingsOpen || !user) return null;
  return <SettingsDialog user={user} />;
}

/* --- 2FA: OTP flow -------------------------------------------------------------
   requestOtp() is a client-side stub. In production, call your backend, which
   sends the code by email/SMS and NEVER returns it to the browser; verification
   also happens server-side. Set DEMO_SHOW_OTP to false once that is wired up. */

const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 30;
const OTP_MAX_ATTEMPTS = 5;
const DEMO_SHOW_OTP = true;

async function requestOtp(_email: string): Promise<{ demoCode: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 900000;
  return { demoCode: String(100000 + n) };
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  return domain ? `${name.slice(0, 1)}***@${domain}` : email;
}

function resizeAvatar(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable");
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/webp", 0.9));
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Invalid image"));
    };
    img.src = objectUrl;
  });
}

function TwoFactorSetup({
  onClose,
  onVerified,
}: {
  onClose: () => void;
  onVerified: (email: string) => void;
}) {
  const { t, tokens, user } = useApp();
  // The user can type any email they have access to — it does not have to match their account email.
  const [email, setEmail] = useState(user?.email ?? "");
  const canSend = EMAIL_RE.test(email.trim());

  const [step, setStep] = useState<"intro" | "code">("intro");
  const [code, setCode] = useState("");
  const [expected, setExpected] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function sendCode() {
    if (!canSend) return;
    setError("");
    setSending(true);
    try {
      const { demoCode } = await requestOtp(email.trim());
      setExpected(demoCode);
      setCode("");
      setAttempts(0);
      setCooldown(OTP_RESEND_SECONDS);
      setStep("code");
    } finally {
      setSending(false);
    }
  }

  // Explicit click handler for "Verify & enable": checks the 6-digit code against the demo
  // code, and only on a match does it flip 2FA on (via onVerified) and close the dialog.
  function handleVerifyClick() {
    if (!expected || attempts >= OTP_MAX_ATTEMPTS) {
      setError(t.twoFa.tooMany);
      return;
    }
    if (!code.trim() || code.length !== OTP_LENGTH || code !== expected) {
      const next = attempts + 1;
      setAttempts(next);
      setError(next >= OTP_MAX_ATTEMPTS ? t.twoFa.tooMany : t.twoFa.invalidCode);
      return;
    }
    setError("");
    onVerified(email.trim());
  }

  return (
    <ModalShell onClose={onClose} z={110}>
      <div className={`w-full max-w-sm rounded-2xl border ${tokens.panelBorder} ${tokens.cardBg} p-6 shadow-2xl`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className={tokens.accent} />
            <h2 className={`text-base font-semibold ${tokens.text}`}>{t.twoFa.title}</h2>
          </div>
          <button type="button" onClick={onClose} className={tokens.mutedText} aria-label={t.twoFa.cancel}>
            <X size={18} />
          </button>
        </div>

        {step === "intro" ? (
          <div className="space-y-4">
            <p className={`text-sm ${tokens.subtext}`}>{t.twoFa.intro}</p>
            <div>
              <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="name@gmail.com"
                autoFocus
                className={`w-full rounded-lg border ${tokens.inputBorder} ${tokens.inputBg} ${tokens.text} px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40`}
              />
            </div>
            <p className={`text-xs ${tokens.mutedText}`}>{t.twoFa.guestEmailNote}</p>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`rounded-lg border ${tokens.panelBorder} px-4 py-2 text-sm font-medium ${tokens.text} ${tokens.cardHover}`}
              >
                {t.twoFa.cancel}
              </button>
              <button
                type="button"
                onClick={sendCode}
                disabled={sending || !canSend}
                className={`flex items-center gap-2 rounded-lg ${tokens.accentBg} ${tokens.accentText} px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50`}
              >
                {sending && <RefreshCw size={14} className="animate-spin" />}
                {sending ? t.twoFa.sending : t.twoFa.sendCode}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className={`text-sm ${tokens.subtext}`}>
              {t.twoFa.sentTo} <span className={`font-medium ${tokens.text}`}>{maskEmail(email)}</span>
            </p>

            <div>
              <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.twoFa.codeLabel}</label>
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleVerifyClick();
                  }
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={OTP_LENGTH}
                placeholder="••••••"
                autoFocus
                className={`w-full rounded-lg border ${
                  error ? "border-red-500/60" : tokens.inputBorder
                } ${tokens.inputBg} ${tokens.text} px-3 py-2.5 text-center font-mono text-lg outline-none focus:ring-2 focus:ring-emerald-500/40`}
                style={{ letterSpacing: "0.5em" }}
              />
            </div>

            {DEMO_SHOW_OTP && (
              <p className={`rounded-lg border border-dashed ${tokens.panelBorder} px-3 py-2 text-xs ${tokens.mutedText}`}>
                {t.twoFa.demoNote} <span className={`font-mono font-semibold ${tokens.accent}`}>{expected}</span>
              </p>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}

            {/* Explicit onClick handler: validates the code, flips 2FA on via onVerified, and closes. */}
            <button
              type="button"
              onClick={handleVerifyClick}
              disabled={code.length !== OTP_LENGTH}
              className={`w-full rounded-lg ${tokens.accentBg} ${tokens.accentText} py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50`}
            >
              {t.twoFa.verify}
            </button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep("intro");
                  setError("");
                }}
                className={`${tokens.subtext} hover:underline`}
              >
                {t.twoFa.back}
              </button>
              <button
                type="button"
                onClick={sendCode}
                disabled={cooldown > 0 || sending}
                className={`${tokens.accent} hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline`}
              >
                {cooldown > 0 ? `${t.twoFa.resendIn} ${cooldown}s` : t.twoFa.resend}
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function SettingsDialog({ user }: { user: AppUser }) {
  const {
    closeSettings,
    settingsTab,
    setSettingsTab,
    t,
    tokens,
    updateUser,
    lang,
    setLang,
    theme,
    setTheme,
    showToast,
  } = useApp();

  // Account form
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [accountError, setAccountError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [twoFaOpen, setTwoFaOpen] = useState(false);

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setAccountError(t.settingsModal.accountAvatarInvalid);
      return;
    }
    try {
      // Cropped to a 256px square data-URL and applied to the profile immediately.
      updateUser({ avatarUrl: await resizeAvatar(file) });
      setAccountError("");
    } catch {
      setAccountError(t.settingsModal.accountAvatarInvalid);
    }
  }

  function saveAccount() {
    const first = firstName.trim();
    const last = lastName.trim();
    const mail = email.trim();
    if (!first) {
      setAccountError(t.settingsModal.accountNameRequired);
      return;
    }
    if (!EMAIL_RE.test(mail)) {
      setAccountError(t.settingsModal.accountEmailInvalid);
      return;
    }
    const name = composeName(first, last);
    const patch: Partial<AppUser> = {
      firstName: first,
      lastName: last,
      name,
      avatarInitial: initialOf(name),
      email: mail,
    };
    // A guest who enters a real address is no longer a placeholder guest.
    if (user.guest && !mail.toLowerCase().endsWith("@cyberearn.local")) patch.guest = false;
    // Keep the 2FA email target in sync. In production the backend must re-verify the new address.
    if (user.twoFactorEnabled) patch.twoFactorTarget = mail;
    updateUser(patch);
    setAccountError("");
    setSavedFlash(true);
    showToast(t.common.success);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function updatePassword() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setSecurityError(t.auth.error);
      setSecuritySuccess("");
      return;
    }
    if (newPassword.length < 8) {
      setSecurityError(t.security.weakPassword);
      setSecuritySuccess("");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSecurityError(t.security.mismatch);
      setSecuritySuccess("");
      return;
    }
    setSecurityError("");
    setSecuritySuccess(t.security.success);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  }

  const tabs: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
    { id: "account", label: t.settingsModal.tabAccount, icon: UserIcon },
    { id: "preferences", label: t.settingsModal.tabPreferences, icon: SlidersHorizontal },
    { id: "security", label: t.settingsModal.tabSecurity, icon: ShieldCheck },
  ];

  const draftName = composeName(firstName, lastName);
  const inputCls = `w-full rounded-lg border ${tokens.inputBorder} ${tokens.inputBg} ${tokens.text} px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40`;

  return (
    <>
      <ModalShell onClose={closeSettings}>
        <div
          style={{ maxHeight: "88vh" }}
          className={`flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-2xl`}
        >
          <div className="flex items-center justify-between px-5 pb-2 pt-4">
            <h2 className={`text-base font-semibold ${tokens.text}`}>{t.settingsModal.title}</h2>
            <button type="button" onClick={closeSettings} className={tokens.mutedText} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {/* [Account] | [App Preferences] | [Security] */}
          <div role="tablist" className={`flex border-b ${tokens.panelBorder} px-3`}>
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = settingsTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSettingsTab(id)}
                  className={`-mb-px flex flex-1 items-center justify-center gap-2 border-b-2 px-2 py-3 text-sm font-medium transition ${
                    active
                      ? `${tokens.accentBorder} ${tokens.accent}`
                      : `border-transparent ${tokens.subtext} ${tokens.hoverText}`
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {settingsTab === "account" && (
              <>
                <div className="flex items-center gap-4">
                  <Avatar initial={initialOf(draftName)} url={user.avatarUrl} size={64} />
                  <div className="min-w-0">
                    <p className={`mb-1.5 text-xs font-medium ${tokens.subtext}`}>{t.settingsModal.accountAvatar}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className={`rounded-lg border ${tokens.panelBorder} px-3 py-1.5 text-xs font-medium ${tokens.text} ${tokens.cardHover}`}
                      >
                        {t.settingsModal.accountAvatarChange}
                      </button>
                      {user.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => updateUser({ avatarUrl: null })}
                          className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
                        >
                          {t.settingsModal.accountAvatarRemove}
                        </button>
                      )}
                    </div>
                    <p className={`mt-1.5 text-xs ${tokens.mutedText}`}>{t.settingsModal.accountAvatarHint}</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>
                      {t.settingsModal.accountFirstName}
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setAccountError("");
                      }}
                      autoComplete="given-name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>
                      {t.settingsModal.accountLastName}
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>
                    {t.settingsModal.accountEmail}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAccountError("");
                    }}
                    autoComplete="email"
                    placeholder="name@gmail.com"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>
                    {t.settingsModal.accountRank}
                  </label>
                  <input
                    value={t.rank.redTeamer}
                    disabled
                    className={`${inputCls} ${tokens.mutedText} opacity-70`}
                  />
                </div>

                {accountError && <p className="text-xs text-red-400">{accountError}</p>}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveAccount}
                    className={`rounded-lg ${tokens.accentBg} ${tokens.accentText} px-4 py-2 text-sm font-semibold hover:opacity-90`}
                  >
                    {t.settingsModal.accountSave}
                  </button>
                  {savedFlash && (
                    <span className={`flex items-center gap-1 text-xs ${tokens.accent}`}>
                      <CheckCircle2 size={14} />
                      {t.settingsModal.accountSaved}
                    </span>
                  )}
                </div>
              </>
            )}

            {settingsTab === "preferences" && (
              <>
                <div>
                  <p className={`mb-1 text-sm font-medium ${tokens.text}`}>{t.language.select}</p>
                  <p className={`mb-2 text-xs ${tokens.mutedText}`}>{t.settingsModal.languageHint}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLang(l.code)}
                        className={`flex items-center justify-between gap-1 rounded-lg border px-2.5 py-2 text-xs ${
                          lang === l.code
                            ? `${tokens.accentBorder} ${tokens.accent}`
                            : `${tokens.panelBorder} ${tokens.subtext}`
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span>{l.flag}</span>
                          <span className="truncate">{l.label}</span>
                        </span>
                        {lang === l.code && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`mb-2 text-sm font-medium ${tokens.text}`}>{t.settingsModal.prefThemeLabel}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dark" as ThemeMode, label: t.settingsModal.themeDark, icon: Moon },
                      { id: "light" as ThemeMode, label: t.settingsModal.themeLight, icon: Sun },
                      { id: "system" as ThemeMode, label: t.settingsModal.themeSystem, icon: Laptop },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTheme(id)}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs ${
                          theme === id
                            ? `${tokens.accentBorder} ${tokens.accent}`
                            : `${tokens.panelBorder} ${tokens.subtext}`
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`mb-2 text-sm font-medium ${tokens.text}`}>{t.settingsModal.prefNotifLabel}</p>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between rounded-lg border ${tokens.panelBorder} px-3 py-2.5`}>
                      <span className={`text-sm ${tokens.text}`}>{t.settingsModal.notifEmailLabel}</span>
                      <Toggle
                        checked={user.emailNotifications}
                        onChange={(v) => updateUser({ emailNotifications: v })}
                        label={t.settingsModal.notifEmailLabel}
                      />
                    </div>
                    <div className={`flex items-center justify-between rounded-lg border ${tokens.panelBorder} px-3 py-2.5`}>
                      <span className={`text-sm ${tokens.text}`}>{t.settingsModal.notifBrowserLabel}</span>
                      <Toggle
                        checked={user.browserNotifications}
                        onChange={(v) => updateUser({ browserNotifications: v })}
                        label={t.settingsModal.notifBrowserLabel}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {settingsTab === "security" && (
              <>
                <div>
                  <p className={`mb-3 text-sm font-medium ${tokens.text}`}>{t.security.changePassword}</p>
                  <div className="space-y-2.5">
                    <PasswordInput
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      placeholder={t.security.currentPassword}
                      tokens={tokens}
                    />
                    <PasswordInput
                      value={newPassword}
                      onChange={setNewPassword}
                      placeholder={t.security.newPassword}
                      tokens={tokens}
                    />
                    <PasswordInput
                      value={confirmNewPassword}
                      onChange={setConfirmNewPassword}
                      placeholder={t.security.confirmPassword}
                      tokens={tokens}
                    />
                    {securityError && <p className="text-xs text-red-400">{securityError}</p>}
                    {securitySuccess && (
                      <p className={`flex items-center gap-1 text-xs ${tokens.accent}`}>
                        <CheckCircle2 size={13} />
                        {securitySuccess}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={updatePassword}
                      className={`rounded-lg ${tokens.accentBg} ${tokens.accentText} px-4 py-2 text-sm font-semibold hover:opacity-90`}
                    >
                      {t.security.updateButton}
                    </button>
                  </div>
                </div>

                <div className={`flex items-center justify-between gap-3 rounded-lg border ${tokens.panelBorder} px-3 py-3`}>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${tokens.text}`}>{t.security.twoFactor}</p>
                    <p className={`truncate text-xs ${tokens.mutedText}`}>
                      {user.twoFactorEnabled
                        ? `${t.security.twoFactorOn} · ${maskEmail(user.twoFactorTarget)}`
                        : t.security.twoFactorOff}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      user.twoFactorEnabled
                        ? updateUser({ twoFactorEnabled: false, twoFactorTarget: "" })
                        : setTwoFaOpen(true)
                    }
                    className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                      user.twoFactorEnabled
                        ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                        : `${tokens.accentBorder} ${tokens.accent} hover:bg-emerald-500/10`
                    }`}
                  >
                    {user.twoFactorEnabled ? t.security.disableButton : t.security.enableButton}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={`flex justify-end border-t ${tokens.panelBorder} px-5 py-3`}>
            <button
              type="button"
              onClick={closeSettings}
              className={`rounded-lg border ${tokens.panelBorder} px-4 py-2 text-sm font-medium ${tokens.text} ${tokens.cardHover}`}
            >
              {t.settingsModal.done}
            </button>
          </div>
        </div>
      </ModalShell>

      {twoFaOpen && (
        <TwoFactorSetup
          onClose={() => setTwoFaOpen(false)}
          onVerified={(target) => {
            updateUser({ twoFactorEnabled: true, twoFactorTarget: target });
            setTwoFaOpen(false);
            showToast(t.twoFa.enabledToast);
          }}
        />
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------- */
/*  SUCCESS MODAL
    (source: components/success-modal.tsx)  */
/* ---------------------------------------------------------------------------- */

function SuccessModal() {
  const { successPayload, clearSuccess, t, tokens, setDashboardTab } = useApp();
  if (!successPayload) return null;

  const finish = () => {
    clearSuccess();
    setDashboardTab("challenges");
  };

  return (
    <ModalShell onClose={finish} z={110}>
      <div className={`w-full max-w-sm rounded-2xl border ${tokens.accentBorder} ${tokens.cardBg} p-6 text-center shadow-2xl`}>
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${tokens.accentBg}`}>
          <CheckCircle2 size={28} className={tokens.accentText} />
        </div>
        <h2 className={`mb-2 text-lg font-semibold ${tokens.text}`}>{t.success.title}</h2>
        <div className={`mb-1 text-2xl font-bold ${tokens.accent}`}>
          +${successPayload.rewardUsdt.toFixed(2)} USDT
        </div>
        <p className={`mb-4 text-xs ${tokens.mutedText}`}>{t.success.usdt}</p>
        <div className={`mb-5 inline-flex items-center gap-1.5 rounded-full border ${tokens.panelBorder} px-3 py-1 text-xs ${tokens.subtext}`}>
          <Zap size={12} className="text-amber-400" />
          +{successPayload.xp} {t.success.xp}
        </div>
        <button
          type="button"
          onClick={finish}
          className={`w-full rounded-lg ${tokens.accentBg} ${tokens.accentText} py-2.5 text-sm font-semibold hover:opacity-90`}
        >
          {t.success.back}
        </button>
      </div>
    </ModalShell>
  );
}


/* ---------------------------------------------------------------------------- */
/*  HEADER
    (source: components/header.tsx)  */
/* ---------------------------------------------------------------------------- */

function Header() {
  const { t, tokens, user, openAuth, goToLanding } = useApp();

  return (
    <header style={{ zIndex: 30 }} className={`sticky top-0 z-30 flex items-center justify-between border-b ${tokens.panelBorder} ${tokens.panelBg} px-4 py-3 backdrop-blur sm:px-6`}>
      <button type="button" onClick={goToLanding} className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tokens.accentBg}`}>
          <TerminalIcon size={15} className={tokens.accentText} />
        </div>
        <span className={`text-sm font-bold tracking-tight ${tokens.text}`}>CyberEarn</span>
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className={`hidden items-center gap-2 rounded-lg border ${tokens.panelBorder} px-3 py-1.5 md:flex`}>
            <Search size={14} className={tokens.mutedText} />
            <input
              placeholder={t.common.search}
              className={`w-40 bg-transparent text-sm outline-none ${tokens.text} ${tokens.placeholder}`}
            />
          </div>
        )}

        <LanguageMenu />

        {user ? (
          <>
            <NotificationsMenu />
            <ProfileMenu />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => openAuth("login")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tokens.text} ${tokens.cardHover}`}
            >
              {t.header.signIn}
            </button>
            <button
              type="button"
              onClick={() => openAuth("register")}
              className={`rounded-lg ${tokens.accentBg} ${tokens.accentText} px-3.5 py-1.5 text-sm font-semibold hover:opacity-90`}
            >
              {t.header.getStarted}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------------- */
/*  SIDEBAR
    (source: components/sidebar.tsx)  */
/* ---------------------------------------------------------------------------- */

function Sidebar() {
  const { t, tokens, dashboardTab, setDashboardTab, openSettings, openStatModal, statModal, user } = useApp();

  const items: { id: DashboardTab; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "challenges", label: t.nav.challenges, icon: Swords },
    { id: "leaderboard", label: t.nav.leaderboard, icon: Trophy },
    { id: "wallet", label: t.nav.wallet, icon: Wallet },
  ];

  const levelProgress = user ? (user.xp % XP_PER_LEVEL) / XP_PER_LEVEL : 0;

  return (
    <aside className={`hidden w-60 shrink-0 flex-col justify-between border-r ${tokens.panelBorder} ${tokens.panelBg} px-3 py-5 sm:flex`}>
      <nav className="space-y-1">
        {items.map(({ id, label, icon: Icon }) => {
          const opensModal = id === "wallet" || id === "leaderboard";
          const active = opensModal
            ? statModal === id
            : dashboardTab === id || (id === "challenges" && dashboardTab === "sandbox");
          return (
            <button
              key={id}
              type="button"
              onClick={() => (opensModal ? openStatModal(id as "wallet" | "leaderboard") : setDashboardTab(id))}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                active ? `${tokens.accentBg} ${tokens.accentText}` : `${tokens.subtext} ${tokens.cardHover}`
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => openSettings()}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${tokens.subtext} ${tokens.cardHover}`}
        >
          <Settings size={16} />
          {t.nav.settings}
        </button>
      </nav>

      <div className={`rounded-xl border ${tokens.panelBorder} ${tokens.cardBg} p-4`}>
        <div className="mb-2 flex items-center gap-2">
          <Zap size={14} className="text-amber-400" />
          <p className={`text-xs font-semibold ${tokens.text}`}>{t.sidebar.nextTierTitle}</p>
        </div>
        <div className={`mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/40`}>
          <div
            className={`h-full ${tokens.accentBg}`}
            style={{ width: `${Math.round(levelProgress * 100)}%` }}
          />
        </div>
        <p className={`text-xs leading-snug ${tokens.mutedText}`}>{t.sidebar.nextTierNote}</p>
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------------------- */
/*  LANDING VIEW
    (source: components/landing.tsx)  */
/* ---------------------------------------------------------------------------- */

function LandingView() {
  const { t, tokens, openAuth } = useApp();
  return (
    <main className={`flex flex-1 flex-col items-center justify-center px-6 py-24 text-center ${tokens.appBg}`}>
      <span className={`mb-5 inline-flex items-center gap-1.5 rounded-full border ${tokens.panelBorder} px-3 py-1 text-xs font-medium ${tokens.accent}`}>
        <ShieldCheck size={13} />
        {t.landing.badge}
      </span>
      <h1 className={`mb-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl ${tokens.text}`}>
        {t.landing.title}
      </h1>
      <p className={`mb-8 max-w-xl text-sm leading-relaxed sm:text-base ${tokens.subtext}`}>
        {t.landing.subtitle}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => openAuth("register")}
          className={`rounded-lg ${tokens.accentBg} ${tokens.accentText} px-5 py-2.5 text-sm font-semibold hover:opacity-90`}
        >
          {t.landing.ctaPrimary}
        </button>
        <button
          type="button"
          onClick={() => openAuth("login")}
          className={`rounded-lg border ${tokens.panelBorder} px-5 py-2.5 text-sm font-medium ${tokens.text} ${tokens.cardHover}`}
        >
          {t.landing.ctaSecondary}
        </button>
      </div>
    </main>
  );
}


/* ---------------------------------------------------------------------------- */
/*  OVERVIEW PANEL
    (source: components/overview-panel.tsx)  */
/* ---------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const { tokens } = useApp();
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`rounded-xl border ${tokens.panelBorder} ${tokens.cardBg} p-4 text-left transition ${
        onClick ? `cursor-pointer ${tokens.cardHover}` : ""
      }`}
    >
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${tokens.accentSoft}`}>
        <Icon size={15} className={tokens.accent} />
      </div>
      <p className={`text-lg font-bold ${tokens.text}`}>{value}</p>
      <p className={`text-xs ${tokens.mutedText}`}>{label}</p>
    </div>
  );
}

function OverviewPanel() {
  const { t, tokens, user, setDashboardTab, openChallenge, categoryFilter } = useApp();
  if (!user) return null;

  const suggested = CHALLENGES.filter(
    (c) => !user.solvedIds.includes(c.id) && (categoryFilter === "all" || c.track === categoryFilter)
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-bold ${tokens.text}`}>
          {t.overview.welcome}, {user.name}
        </h1>
        <p className={`text-sm ${tokens.mutedText}`}>{t.overview.subtitle}</p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className={`text-sm font-semibold ${tokens.text}`}>{t.catalog.title}</h2>
          <button
            type="button"
            onClick={() => setDashboardTab("challenges")}
            className={`text-xs font-medium ${tokens.accent} hover:underline`}
          >
            {t.nav.challenges}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {suggested.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => openChallenge(c.id)}
              className={`rounded-xl border ${tokens.cardBorder} ${tokens.cardBg} p-4 text-left transition ${tokens.cardHover}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <TrackPill track={c.track} />
                <DifficultyBadge difficulty={c.difficulty} />
              </div>
              <p className={`mb-1 text-sm font-semibold ${tokens.text}`}>{c.title}</p>
              <p className={`text-xs ${tokens.accent}`}>${c.rewardUsdt.toFixed(2)} USDT</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------- */
/*  CHALLENGE CATALOG
    (source: components/challenge-catalog.tsx)  */
/* ---------------------------------------------------------------------------- */

function ChallengeCatalog() {
  const { t, tokens, user, openChallenge, categoryFilter } = useApp();
  const [query, setQuery] = useState("");

  const visible = CHALLENGES.filter((c) => {
    const matchesFilter = categoryFilter === "all" || c.track === categoryFilter;
    const matchesQuery = c.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={`text-xl font-bold ${tokens.text}`}>{t.catalog.title}</h1>
          <p className={`text-sm ${tokens.mutedText}`}>{t.catalog.subtitle}</p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg border ${tokens.panelBorder} px-3 py-1.5 sm:w-64`}>
          <Search size={14} className={tokens.mutedText} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.search}
            className={`w-full bg-transparent text-sm outline-none ${tokens.text} ${tokens.placeholder}`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => {
          const solved = user?.solvedIds.includes(c.id);
          return (
            <div
              key={c.id}
              className={`flex flex-col justify-between rounded-xl border ${tokens.cardBorder} ${tokens.cardBg} p-4 transition ${tokens.cardHover}`}
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <TrackPill track={c.track} />
                  <DifficultyBadge difficulty={c.difficulty} />
                </div>
                <h3 className={`mb-1.5 text-sm font-semibold ${tokens.text}`}>{c.title}</h3>
                <p
                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  className={`mb-3 text-xs leading-relaxed ${tokens.subtext}`}
                >{c.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-semibold ${tokens.accent}`}>${c.rewardUsdt.toFixed(2)}</span>
                  <span className={tokens.mutedText}>·</span>
                  <span className={`flex items-center gap-1 ${tokens.mutedText}`}>
                    <Zap size={11} className="text-amber-400" />
                    {c.xp} XP
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openChallenge(c.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    solved
                      ? `border ${tokens.panelBorder} ${tokens.subtext}`
                      : `${tokens.accentBg} ${tokens.accentText} hover:opacity-90`
                  }`}
                >
                  {solved ? <CheckCircle2 size={13} /> : null}
                  {t.challenge.start}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ---------------------------------------------------------------------------- */
/*  SANDBOX VIEW
    (source: components/sandbox-view.tsx)  */
/* ---------------------------------------------------------------------------- */

interface TerminalLine {
  kind: "input" | "output";
  text: string;
}

function SandboxView() {
  const { t, tokens, activeChallengeId, setDashboardTab, user, markSolved } = useApp();
  const challenge = CHALLENGES.find((c) => c.id === activeChallengeId) ?? CHALLENGES[0];

  const [lines, setLines] = useState<TerminalLine[]>(
    challenge.terminalIntro.map((text) => ({ kind: "output", text }))
  );
  const [command, setCommand] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [flagInput, setFlagInput] = useState("");
  const [flagError, setFlagError] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLines(challenge.terminalIntro.map((text) => ({ kind: "output", text })));
    setCommand("");
    setShowHint(false);
    setFlagInput("");
    setFlagError(false);
  }, [challenge.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const solved = !!user?.solvedIds.includes(challenge.id);

  // Handles running the typed command — from the form's submit (desktop Enter),
  // an explicit onKeyDown Enter press, or a tap on the mobile "↵" send button.
  // `e` is optional so it can be called directly (no event) from the button/key handler.
  function handleCommandSubmit(e?: React.FormEvent | React.KeyboardEvent) {
    e?.preventDefault();
    const trimmed = command.trim();
    if (!trimmed) return;
    const response =
      challenge.terminalResponses[trimmed] ??
      challenge.terminalResponses[trimmed.toLowerCase()] ?? [`command not found: ${trimmed}`];
    setLines((prev) => [
      ...prev,
      { kind: "input", text: trimmed },
      ...response.map((text) => ({ kind: "output" as const, text })),
    ]);
    setCommand("");
  }

  function verifyFlag() {
    if (flagInput.trim().toLowerCase() === challenge.flag.toLowerCase()) {
      setFlagError(false);
      markSolved(challenge);
    } else {
      setFlagError(true);
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => setDashboardTab("challenges")}
        className={`flex items-center gap-1.5 text-sm font-medium ${tokens.subtext} ${tokens.hoverText}`}
      >
        <ArrowLeft size={15} />
        {t.sandbox.back}
      </button>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className={`rounded-xl border ${tokens.cardBorder} ${tokens.cardBg} p-4`}>
            <div className="mb-2 flex items-center justify-between">
              <TrackPill track={challenge.track} />
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
            <h1 className={`mb-2 text-lg font-bold ${tokens.text}`}>{challenge.title}</h1>
            <p className={`mb-3 text-sm leading-relaxed ${tokens.subtext}`}>{challenge.description}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className={`font-semibold ${tokens.accent}`}>${challenge.rewardUsdt.toFixed(2)} USDT</span>
              <span className={tokens.mutedText}>·</span>
              <span className={`flex items-center gap-1 ${tokens.mutedText}`}>
                <Zap size={11} className="text-amber-400" />
                {challenge.xp} XP
              </span>
              {solved && (
                <span className={`ml-auto flex items-center gap-1 ${tokens.accent}`}>
                  <CheckCircle2 size={13} />
                </span>
              )}
            </div>
          </div>

          <div className={`rounded-xl border ${tokens.cardBorder} ${tokens.cardBg} p-4`}>
            <h2 className={`mb-3 text-sm font-semibold ${tokens.text}`}>{t.sandbox.objectives}</h2>
            <ul className="space-y-2">
              {challenge.objectives.map((obj, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${tokens.subtext}`}>
                  <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${tokens.mutedText}`} />
                  {obj}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className={`mt-4 flex items-center gap-1.5 text-xs font-medium ${tokens.accent} hover:underline`}
            >
              <Lightbulb size={13} />
              {showHint ? t.sandbox.hintHide : t.sandbox.hintShow}
            </button>
            {showHint && (
              <p className={`mt-2 rounded-lg border ${tokens.panelBorder} p-3 text-xs leading-relaxed ${tokens.subtext}`}>
                {challenge.hint}
              </p>
            )}
          </div>

          <div className={`rounded-xl border ${tokens.cardBorder} ${tokens.cardBg} p-4`}>
            <h2 className={`mb-2 flex items-center gap-1.5 text-sm font-semibold ${tokens.text}`}>
              <Flag size={14} />
              {t.sandbox.submitLabel}
            </h2>
            <div className="flex gap-2">
              <input
                value={flagInput}
                onChange={(e) => {
                  setFlagInput(e.target.value);
                  setFlagError(false);
                }}
                placeholder="CE{...}"
                disabled={solved}
                className={`w-full rounded-lg border ${
                  flagError ? "border-red-500/60" : tokens.inputBorder
                } ${tokens.inputBg} ${tokens.text} px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-60`}
              />
              <button
                type="button"
                onClick={verifyFlag}
                disabled={solved}
                className={`shrink-0 rounded-lg ${tokens.accentBg} ${tokens.accentText} px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60`}
              >
                {t.sandbox.verify}
              </button>
            </div>
            {flagError && <p className="mt-2 text-xs text-red-400">{t.sandbox.wrongFlag}</p>}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div style={{ height: "26rem" }} className={`flex flex-col overflow-hidden rounded-xl border ${tokens.panelBorder}`}>
            <div className={`flex items-center justify-between border-b ${tokens.panelBorder} ${tokens.panelBg} px-4 py-2.5`}>
              <span className={`flex items-center gap-2 text-xs font-medium ${tokens.text}`}>
                <TerminalIcon size={14} />
                {challenge.id}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {t.terminal.live}
              </span>
            </div>
            <div ref={scrollRef} className={`flex-1 overflow-y-auto ${tokens.terminalBg} px-4 py-3 font-mono text-xs leading-relaxed`}>
              {lines.map((line, i) => (
                <div key={i} className={line.kind === "input" ? "text-white" : tokens.terminalText}>
                  {line.kind === "input" ? `$ ${line.text}` : line.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleCommandSubmit}
              className={`flex items-center gap-2 border-t ${tokens.panelBorder} ${tokens.terminalBg} px-4 py-2.5`}
            >
              <span className="font-mono text-xs text-white">$</span>
              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  // Explicit Enter handling in addition to the form's onSubmit, so the
                  // command always runs even if the surrounding form submit is swallowed
                  // by a parent element or a mobile keyboard's custom Enter behaviour.
                  if (e.key === "Enter") handleCommandSubmit(e);
                }}
                placeholder={t.terminal.placeholder}
                // Shows "Send" (or the platform's equivalent) instead of a generic
                // return/newline glyph on mobile keyboards.
                enterKeyHint="send"
                className="w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-500"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
              />
              {/* Tappable send button for mobile users who have no physical Enter key. */}
              <button
                type="submit"
                aria-label={t.terminal.send}
                disabled={!command.trim()}
                className="flex shrink-0 items-center gap-1 rounded-md border border-slate-700 px-2 py-1 font-mono text-[11px] text-slate-300 disabled:opacity-40 enabled:hover:border-emerald-500/60 enabled:hover:text-emerald-400"
              >
                <CornerDownLeft size={12} />
                {t.terminal.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------- */
/*  LEADERBOARD & WALLET PANELS (placeholders backed by mock data)
    (source: components/placeholder-panels.tsx)  */
/* ---------------------------------------------------------------------------- */

function medalTheme(rank: number): { bg: string; ring: string; text: string } {
  if (rank === 1) return { bg: "bg-gradient-to-b from-amber-400/25 to-amber-500/5", ring: "border-amber-400/50", text: "text-amber-400" };
  if (rank === 2) return { bg: "bg-gradient-to-b from-slate-300/25 to-slate-400/5", ring: "border-slate-300/50", text: "text-slate-300" };
  return { bg: "bg-gradient-to-b from-orange-500/25 to-orange-600/5", ring: "border-orange-500/50", text: "text-orange-400" };
}

function LeaderboardTable() {
  const { t, tokens, user } = useApp();
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");
  const scale = LB_PERIOD_SCALE[period];

  const scaled = TOP_100.map((entry) => ({
    ...entry,
    xp: Math.max(1, Math.round(entry.xp * scale)),
    solved: Math.max(1, Math.round(entry.solved * scale)),
  }));
  const top3 = scaled.slice(0, 3);
  const rest = scaled.slice(3);

  const periods: { id: LeaderboardPeriod; label: string }[] = [
    { id: "weekly", label: t.leaderboardModal.periodWeekly },
    { id: "monthly", label: t.leaderboardModal.periodMonthly },
    { id: "all", label: t.leaderboardModal.periodAll },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              period === p.id ? `${tokens.accentBg} ${tokens.accentText} ${tokens.accentBorder}` : `${tokens.panelBorder} ${tokens.subtext}`
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {top3.map((entry) => {
          const medal = medalTheme(entry.rank);
          return (
            <div
              key={entry.rank}
              className={`flex flex-col items-center rounded-xl border ${medal.ring} ${medal.bg} px-2 py-4 text-center`}
            >
              <Trophy size={entry.rank === 1 ? 26 : 20} className={medal.text} />
              <span className={`mt-1 text-xs font-bold ${medal.text}`}>#{entry.rank}</span>
              <span className="mt-1.5 flex items-center gap-1">
                <MiniAvatar name={entry.name} size={18} />
                <span className={`truncate text-xs font-semibold ${tokens.text}`}>
                  {entry.country} {entry.name}
                </span>
              </span>
              <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${tokens.accentSoft} ${tokens.accent}`}>
                {t.rank[rankTierKey(entry.xp)]}
              </span>
              <span className={`mt-1 text-xs ${tokens.mutedText}`}>{entry.xp.toLocaleString()} XP</span>
            </div>
          );
        })}
      </div>

      <div className={`max-h-72 overflow-y-auto rounded-xl border ${tokens.panelBorder}`}>
        <table className="w-full text-left text-sm">
          <thead className={`sticky top-0 ${tokens.panelBg} ${tokens.mutedText}`}>
            <tr>
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Player</th>
              <th className="px-4 py-2 font-medium">XP</th>
              <th className="px-4 py-2 font-medium">Solved</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((entry) => (
              <tr key={entry.rank} className={`border-t ${tokens.panelBorder}`}>
                <td className={`px-4 py-2 font-mono ${tokens.mutedText}`}>{entry.rank}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <MiniAvatar name={entry.name} />
                    <div className="min-w-0">
                      <p className={`truncate font-medium ${tokens.text}`}>
                        {entry.country} {entry.name}
                      </p>
                      <p className={`text-[11px] ${tokens.mutedText}`}>{t.rank[rankTierKey(entry.xp)]}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-2 ${tokens.subtext}`}>{entry.xp.toLocaleString()}</td>
                <td className={`px-4 py-2 ${tokens.subtext}`}>{entry.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user && (
        <>
          <div className={`flex items-center gap-3 text-xs ${tokens.mutedText}`}>
            <div className={`h-px flex-1 border-t ${tokens.panelBorder}`} />
            {t.leaderboardModal.yourRank}
            <div className={`h-px flex-1 border-t ${tokens.panelBorder}`} />
          </div>
          <div
            className={`flex items-center justify-between rounded-xl border ${tokens.accentBorder} ${tokens.accentSoft} px-4 py-3`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar initial={user.avatarInitial} url={user.avatarUrl} size={32} />
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${tokens.text}`}>{user.name}</p>
                <p className={`text-xs ${tokens.mutedText}`}>
                  #{user.rank} · {t.rank[rankTierKey(user.xp)]}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className={`text-sm font-semibold ${tokens.accent}`}>{user.xp.toLocaleString()} XP</p>
              <p className={`text-xs ${tokens.mutedText}`}>{user.solvedIds.length} solved</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function WalletModal() {
  const { t, tokens, user, closeStatModal, withdraw, deposit } = useApp();
  const [tab, setTab] = useState<"withdraw" | "deposit" | "history">("withdraw");

  // Withdraw tab state
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawMethod>("usdt");
  const [network, setNetwork] = useState<WithdrawNetwork>("trc20");
  const [address, setAddress] = useState("");
  const [wError, setWError] = useState("");

  // Deposit tab state
  const [depositAmount, setDepositAmount] = useState("");
  const [dError, setDError] = useState("");

  if (!user) return null;

  const networkLabel: Record<WithdrawNetwork, string> = {
    trc20: t.walletModal.networkTrc20,
    erc20: t.walletModal.networkErc20,
    bep20: t.walletModal.networkBep20,
  };

  function submitWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      setWError(t.walletModal.addressRequired);
      return;
    }
    const value = parseFloat(amount);
    const detail = method === "usdt" ? `${networkLabel[network]} · ${maskAddress(address)}` : maskAddress(address);
    const result = withdraw(value, method, detail);
    if (!result.ok) {
      setWError(result.error ?? t.walletModal.invalidAmount);
      return;
    }
    setWError("");
    setAmount("");
    setAddress("");
  }

  function submitDeposit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(depositAmount);
    const result = deposit(value);
    if (!result.ok) {
      setDError(result.error ?? t.walletModal.invalidAmount);
      return;
    }
    setDError("");
    setDepositAmount("");
  }

  const history = [...user.history].sort((a, b) => b.at - a.at);
  const statusLabel = (status: HistoryEntry["status"]) =>
    status === "completed" ? t.walletModal.statusCompleted : t.walletModal.statusPending;

  const tabs: { id: "withdraw" | "deposit" | "history"; label: string }[] = [
    { id: "withdraw", label: t.walletModal.tabWithdraw },
    { id: "deposit", label: t.walletModal.tabDeposit },
    { id: "history", label: t.walletModal.tabHistory },
  ];

  const inputCls = (hasError: boolean) =>
    `w-full rounded-lg border ${hasError ? "border-red-500/60" : tokens.inputBorder} ${tokens.inputBg} ${tokens.text} px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40`;

  return (
    <ModalShell onClose={closeStatModal}>
      <div
        className={`flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-2xl`}
      >
        <div className={`flex items-center justify-between border-b ${tokens.panelBorder} px-5 py-4`}>
          <h2 className={`flex items-center gap-2 text-base font-semibold ${tokens.text}`}>
            <Wallet size={17} className={tokens.accent} />
            {t.walletModal.title}
          </h2>
          <button type="button" onClick={closeStatModal} className={tokens.mutedText} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className={`px-5 pt-3`}>
          <p className={`text-xs ${tokens.mutedText}`}>{t.walletModal.totalBalance}</p>
          <p className={`text-3xl font-bold ${tokens.text}`}>${user.balanceUsdt.toFixed(2)}</p>
        </div>

        <div role="tablist" className={`mt-3 flex border-b ${tokens.panelBorder} px-3`}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`-mb-px flex-1 border-b-2 px-2 py-2.5 text-sm font-medium transition ${
                tab === id ? `${tokens.accentBorder} ${tokens.accent}` : `border-transparent ${tokens.subtext} ${tokens.hoverText}`
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {tab === "withdraw" && (
            <form onSubmit={submitWithdraw} className="space-y-3">
              <div>
                <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.walletModal.method}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "usdt" as WithdrawMethod, label: t.walletModal.methodUsdt },
                      { id: "card" as WithdrawMethod, label: t.walletModal.methodCard },
                    ]
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        method === m.id ? `${tokens.accentBorder} ${tokens.accent}` : `${tokens.panelBorder} ${tokens.subtext}`
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {method === "usdt" && (
                <div>
                  <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.walletModal.network}</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as WithdrawNetwork)}
                    className={inputCls(false)}
                  >
                    <option value="trc20">{t.walletModal.networkTrc20}</option>
                    <option value="erc20">{t.walletModal.networkErc20}</option>
                    <option value="bep20">{t.walletModal.networkBep20}</option>
                  </select>
                </div>
              )}

              <div>
                <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>
                  {method === "usdt" ? t.walletModal.walletAddress : t.walletModal.walletAddressCard}
                </label>
                <input
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setWError("");
                  }}
                  placeholder={method === "usdt" ? "T9yD1…3fQ2" : "4242 4242 4242 4242"}
                  className={inputCls(!!wError && !address.trim())}
                />
              </div>

              <div>
                <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.walletModal.amount}</label>
                <input
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setWError("");
                  }}
                  inputMode="decimal"
                  placeholder="0.00"
                  className={inputCls(!!wError)}
                />
                <p className={`mt-1 text-[11px] ${tokens.mutedText}`}>{t.walletModal.minWithdraw}</p>
              </div>

              {wError && <p className="text-xs text-red-400">{wError}</p>}

              <button
                type="submit"
                className={`w-full rounded-lg ${tokens.accentBg} ${tokens.accentText} py-2.5 text-sm font-semibold hover:opacity-90`}
              >
                {t.walletModal.submit}
              </button>
            </form>
          )}

          {tab === "deposit" && (
            <form onSubmit={submitDeposit} className="space-y-3">
              <p className={`text-sm ${tokens.subtext}`}>{t.walletModal.depositNote}</p>
              <div>
                <label className={`mb-1 block text-xs font-medium ${tokens.subtext}`}>{t.walletModal.depositAmount}</label>
                <input
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                    setDError("");
                  }}
                  inputMode="decimal"
                  placeholder="0.00"
                  className={inputCls(!!dError)}
                />
              </div>
              {dError && <p className="text-xs text-red-400">{dError}</p>}
              <button
                type="submit"
                className={`w-full rounded-lg ${tokens.accentBg} ${tokens.accentText} py-2.5 text-sm font-semibold hover:opacity-90`}
              >
                {t.walletModal.depositButton}
              </button>
            </form>
          )}

          {tab === "history" && (
            <div>
              {history.length === 0 ? (
                <p className={`text-xs ${tokens.mutedText}`}>{t.walletModal.historyEmpty}</p>
              ) : (
                <div className="space-y-1.5">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className={`flex items-center justify-between rounded-lg border ${tokens.panelBorder} px-3 py-2`}
                    >
                      <div className="min-w-0">
                        <p className={`truncate text-sm ${tokens.text}`}>{h.title}</p>
                        <p className={`text-xs ${tokens.mutedText}`}>
                          {new Date(h.at).toLocaleDateString()} ·{" "}
                          {new Date(h.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                          {statusLabel(h.status)}
                        </p>
                      </div>
                      <span className={`shrink-0 text-sm font-semibold ${h.amount >= 0 ? tokens.accent : "text-red-400"}`}>
                        {h.amount >= 0 ? "+" : ""}
                        {h.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}


function XpModal() {
  const { t, tokens, user, closeStatModal } = useApp();
  if (!user) return null;

  const progress = user.xp % XP_PER_LEVEL;
  const percent = Math.round((progress / XP_PER_LEVEL) * 100);
  const rewards = [...user.history].filter((h) => h.kind === "reward").sort((a, b) => b.at - a.at);
  const progressLabel = t.xpModal.progressLabel
    .replace("{cur}", String(progress))
    .replace("{goal}", String(XP_PER_LEVEL));
  const nextRewardLabel = t.xpModal.nextRewardLabel
    .replace("{level}", String(user.level + 1))
    .replace("{amount}", NEXT_LEVEL_BONUS_USDT.toFixed(2));

  return (
    <ModalShell onClose={closeStatModal}>
      <div
        className={`flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-2xl`}
      >
        <div className={`flex items-center justify-between border-b ${tokens.panelBorder} px-5 py-4`}>
          <h2 className={`flex items-center gap-2 text-base font-semibold ${tokens.text}`}>
            <Zap size={17} className="text-amber-400" />
            {t.xpModal.title}
          </h2>
          <button type="button" onClick={closeStatModal} className={tokens.mutedText} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl border ${tokens.panelBorder} p-3`}>
              <p className={`text-xs ${tokens.mutedText}`}>{t.xpModal.currentLevel}</p>
              <p className={`text-xl font-bold ${tokens.text}`}>{user.level}</p>
            </div>
            <div className={`rounded-xl border ${tokens.panelBorder} p-3`}>
              <p className={`text-xs ${tokens.mutedText}`}>{t.xpModal.nextLevel}</p>
              <p className={`text-xl font-bold ${tokens.text}`}>{user.level + 1}</p>
            </div>
          </div>

          <div>
            {/* Neon-glow progress bar: inline styles (not arbitrary Tailwind classes) so the
                glow/gradient/transition render identically in the Artifact preview. */}
            <div
              style={{
                height: 10,
                width: "100%",
                borderRadius: 9999,
                overflow: "hidden",
                background: "rgba(100,116,139,0.25)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  borderRadius: 9999,
                  background: "linear-gradient(90deg, #10b981, #6ee7b7)",
                  boxShadow: "0 0 10px 1px rgba(16,185,129,0.75)",
                  transition: "width 700ms ease",
                }}
              />
            </div>
            <p className={`mt-1.5 text-xs ${tokens.mutedText}`}>{progressLabel}</p>
          </div>

          <div
            className="rounded-xl border p-3"
            style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.08)" }}
          >
            <p className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${tokens.accent}`}>
              <Trophy size={13} />
              {t.xpModal.nextRewardTitle}
            </p>
            <p className={`text-sm ${tokens.text}`}>{nextRewardLabel}</p>
          </div>

          <div>
            <p className={`mb-2 text-sm font-medium ${tokens.text}`}>{t.xpModal.historyTitle}</p>
            {rewards.length === 0 ? (
              <p className={`text-xs ${tokens.mutedText}`}>{t.xpModal.historyEmpty}</p>
            ) : (
              <div className="space-y-1.5">
                {rewards.map((h) => (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between rounded-lg border ${tokens.panelBorder} px-3 py-2`}
                  >
                    <div className="min-w-0">
                      <p className={`truncate text-sm ${tokens.text}`}>{h.title}</p>
                      <p className={`text-xs ${tokens.mutedText}`}>{new Date(h.at).toLocaleDateString()}</p>
                    </div>
                    <span className="shrink-0 flex items-center gap-1 text-sm font-semibold text-amber-400">
                      <Zap size={12} />+{h.xp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}


function LeaderboardModal() {
  const { t, tokens, closeStatModal } = useApp();
  return (
    <ModalShell onClose={closeStatModal}>
      <div
        className={`flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border ${tokens.panelBorder} ${tokens.cardBg} shadow-2xl`}
      >
        <div className={`flex items-center justify-between border-b ${tokens.panelBorder} px-5 py-4`}>
          <h2 className={`flex items-center gap-2 text-base font-semibold ${tokens.text}`}>
            <Trophy size={17} className="text-amber-400" />
            {t.leaderboardModal.title}
          </h2>
          <button type="button" onClick={closeStatModal} className={tokens.mutedText} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <LeaderboardTable />
        </div>
      </div>
    </ModalShell>
  );
}


function LeaderboardPanel() {
  const { t, tokens } = useApp();
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-xl font-bold ${tokens.text}`}>{t.placeholder.leaderboardTitle}</h1>
        <p className={`text-sm ${tokens.mutedText}`}>{t.placeholder.leaderboardNote}</p>
      </div>
      <LeaderboardTable />
    </div>
  );
}

function WalletPanel() {
  const { t, tokens, user, openStatModal } = useApp();
  if (!user) return null;
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-xl font-bold ${tokens.text}`}>{t.placeholder.walletTitle}</h1>
        <p className={`text-sm ${tokens.mutedText}`}>{t.placeholder.walletNote}</p>
      </div>
      <div className={`rounded-xl border ${tokens.cardBorder} ${tokens.cardBg} p-6`}>
        <p className={`text-xs ${tokens.mutedText}`}>{t.overview.statBalance}</p>
        <p className={`text-3xl font-bold ${tokens.text}`}>${user.balanceUsdt.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => openStatModal("wallet")}
          className={`mt-4 rounded-lg ${tokens.accentBg} ${tokens.accentText} px-4 py-2 text-sm font-semibold hover:opacity-90`}
        >
          {t.walletModal.withdraw}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------- */
/*  DASHBOARD SHELL
    (source: components/dashboard-shell.tsx)  */
/* ---------------------------------------------------------------------------- */

/**
 * Always-visible category filters. Rendered by the shell itself (not by the
 * catalog) and driven by context state, so it is present on first load and does
 * not depend on having opened any challenge or tab before.
 */
function CategoryFilterBar() {
  const { t, tokens, categoryFilter, setCategoryFilter, dashboardTab, setDashboardTab } = useApp();

  const filters: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: t.filters.all },
    { id: "linux", label: t.filters.linux },
    { id: "web", label: t.filters.web },
    { id: "smart", label: t.filters.smart },
    { id: "python", label: t.filters.python },
  ];

  return (
    <div role="group" aria-label={t.catalog.title} className="mb-5 flex flex-wrap gap-2">
      {filters.map((f) => {
        const active = categoryFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setCategoryFilter(f.id);
              if (dashboardTab !== "challenges") setDashboardTab("challenges");
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? `${tokens.accentBg} ${tokens.accentText} ${tokens.accentBorder}`
                : `${tokens.panelBorder} ${tokens.subtext} ${tokens.cardHover}`
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function StatsRow() {
  const { t, user, openStatModal } = useApp();
  if (!user) return null;
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        icon={Wallet}
        label={t.overview.statBalance}
        value={`$${user.balanceUsdt.toFixed(2)}`}
        onClick={() => openStatModal("wallet")}
      />
      <StatCard
        icon={Zap}
        label={t.overview.statXp}
        value={`${user.xp.toLocaleString()} XP`}
        onClick={() => openStatModal("xp")}
      />
      <StatCard icon={CheckCircle2} label={t.overview.statSolved} value={String(user.solvedIds.length)} />
      <StatCard
        icon={Trophy}
        label={t.overview.statRank}
        value={`#${user.rank}`}
        onClick={() => openStatModal("leaderboard")}
      />
    </div>
  );
}

function ToastHost() {
  const { toast, tokens } = useApp();
  if (!toast) return null;
  return (
    <div
      style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 200 }}
      className="pointer-events-none px-4"
    >
      <div
        className={`flex items-center gap-2 rounded-xl border ${tokens.panelBorder} ${tokens.cardBg} px-4 py-2.5 shadow-2xl`}
      >
        <CheckCircle2 size={16} className={tokens.accent} />
        <span className={`text-sm font-medium ${tokens.text}`}>{toast.message}</span>
      </div>
    </div>
  );
}

function DashboardShell() {
  const { dashboardTab, tokens } = useApp();
  const showHeaderBlocks = dashboardTab === "overview" || dashboardTab === "challenges";

  return (
    <div className={`flex flex-1 ${tokens.appBg}`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {showHeaderBlocks && (
          <>
            <StatsRow />
            <CategoryFilterBar />
          </>
        )}
        {dashboardTab === "overview" && <OverviewPanel />}
        {dashboardTab === "challenges" && <ChallengeCatalog />}
        {dashboardTab === "sandbox" && <SandboxView />}
        {dashboardTab === "leaderboard" && <LeaderboardPanel />}
        {dashboardTab === "wallet" && <WalletPanel />}
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------------------- */
/*  PAGE (default export)
    (source: app/dashboard/page.tsx)  */
/* ---------------------------------------------------------------------------- */

function AppShell() {
  const { view, tokens, user, statModal } = useApp();

  return (
    <div className={`flex min-h-screen flex-col ${tokens.appBg}`}>
      <Header />
      {view === "landing" || !user ? <LandingView /> : <DashboardShell />}
      <AuthModal />
      <SettingsModal />
      <SuccessModal />
      {statModal === "wallet" && <WalletModal />}
      {statModal === "xp" && <XpModal />}
      {statModal === "leaderboard" && <LeaderboardModal />}
      <ToastHost />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}