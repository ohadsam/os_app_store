// Hebrew (default, RTL) and English string tables + t(). Every key exists in both (a unit test enforces keys and {placeholders}).
import { getLang, setLang } from './store.js';

const he = {
  'app.name': 'OS APPs and Downs', 'app.tag': 'חנות האפליקציות של OS', 'app.title': 'OS APPs and Downs - חנות האפליקציות',
  'nav.store': 'החנות', 'nav.guide': 'איך מתקינים', 'nav.about': 'אודות', 'nav.back': 'חזרה לחנות', 'nav.menu': 'תפריט',
  'top.lang': 'EN', 'top.langLabel': 'החלפת שפה לאנגלית', 'top.theme': 'מצב תצוגה', 'theme.auto': 'אוטומטי', 'theme.light': 'בהיר', 'theme.dark': 'כהה',
  'search.label': 'חיפוש אפליקציות', 'search.ph': 'חיפוש אפליקציה או נושא...', 'search.clear': 'ניקוי החיפוש',
  'plat.all': 'הכול', 'plat.web': 'אתר / PWA', 'plat.android': 'אנדרואיד', 'plat.pwa': 'PWA', 'plat.webOnly': 'אתר', 'plat.apk': 'APK',
  'filter.open': 'סינון ומיון', 'filter.title': 'סינון ומיון', 'filter.category': 'קטגוריה', 'filter.anyCategory': 'כל הקטגוריות', 'filter.tags': 'תגיות',
  'filter.sort': 'מיון', 'sort.updated': 'עודכנו לאחרונה', 'sort.new': 'החדשות ביותר', 'sort.name': 'לפי שם', 'filter.favs': 'רק מועדפות', 'filter.clear': 'ניקוי הכול', 'filter.apply': 'הצגת {n} תוצאות', 'filter.active': '{n} פעילים',
  'home.recent': 'עודכנו לאחרונה', 'home.all': 'כל האפליקציות', 'home.count': '{n} אפליקציות', 'home.count1': 'אפליקציה אחת', 'home.none': 'לא נמצאו אפליקציות', 'home.noneHint': 'נסו חיפוש אחר או נקו את הסינון.',
  'home.hero': 'כל האפליקציות שלי, במקום אחד', 'home.heroSub': 'פותחים אתרים ו-PWA בלחיצה, ומורידים אפליקציות אנדרואיד עם הוראות התקנה מלאות. תמיד הגרסה האחרונה.',
  'card.open': 'פתיחה', 'card.download': 'הורדת APK', 'card.releases': 'להורדה', 'card.details': 'פרטים', 'card.version': 'גרסה {v}', 'card.updated': 'עודכנה {when}', 'card.fav': 'הוספה למועדפות', 'card.unfav': 'הסרה מהמועדפות', 'card.recent': 'עודכנה לאחרונה', 'card.updateAvail': 'יש עדכון', 'card.beta': 'בטא',
  'detail.screens': 'צילומי מסך', 'detail.noShots': 'צילומי מסך מהמכשיר יתווספו כשהאפליקציה תוצג לראשונה.', 'detail.about': 'על האפליקציה', 'detail.highlights': 'מה אפשר לעשות', 'detail.whatsNew': 'מה חדש בגרסה {v}',
  'detail.info': 'מידע', 'detail.version': 'גרסה אחרונה', 'detail.released': 'תאריך שחרור', 'detail.updated': 'עדכון אחרון', 'detail.platforms': 'פלטפורמות', 'detail.android': 'דרישת מערכת', 'detail.androidVal': 'אנדרואיד {v} ומעלה', 'detail.pkg': 'מזהה חבילה', 'detail.category': 'קטגוריה', 'detail.rights': 'זכויות', 'detail.rightsVal': 'כל הזכויות שמורות © OS',
  'detail.install': 'איך מתקינים', 'detail.links': 'קישורים', 'detail.repo': 'קוד המקור ב-GitHub', 'detail.changelog': 'היסטוריית גרסאות', 'detail.releases': 'כל הגרסאות', 'detail.sha': 'קובץ אימות (SHA-256)', 'detail.report': 'דיווח על בעיה', 'detail.notFound': 'האפליקציה לא נמצאה',
  'detail.share': 'שיתוף', 'detail.shareWa': 'שליחה בוואטסאפ', 'detail.markInstalled': 'סימון: התקנתי את הגרסה הזו', 'detail.unmark': 'ביטול סימון ההתקנה', 'detail.installedV': 'סימנתם גרסה {v} כמותקנת', 'detail.updateAvail': 'יש גרסה חדשה: {v}. כדאי לעדכן.',
  'detail.private': 'המאגר של האפליקציה פרטי: ההורדה תעבוד רק כשאתם מחוברים לחשבון GitHub עם הרשאה.', 'detail.noApk': 'אין כרגע קובץ APK ציבורי לאפליקציה הזו.',
  'inst.pwaTitle': 'פתיחה והתקנה כ-PWA', 'inst.webTitle': 'פתיחת האתר', 'inst.apkTitle': 'התקנת קובץ APK באנדרואיד', 'inst.show': 'הצגת ההוראות המלאות עם תמונות', 'inst.hide': 'הסתרת ההוראות',
  'inst.apkShort1': 'מורידים את קובץ ה-APK.', 'inst.apkShort2': 'פותחים אותו ומאשרים התקנה ממקור לא ידוע (פעם אחת).', 'inst.apkShort3': 'לוחצים התקנה. אם Play Protect מציג אזהרה, בוחרים "התקנה בכל זאת".',
  'inst.pwaShort1': 'פותחים את הקישור ב-Chrome.', 'inst.pwaShort2': 'בתפריט (⋮) בוחרים "התקנת אפליקציה" או "הוספה למסך הבית".', 'inst.webShort': 'פותחים את הקישור בדפדפן. אין צורך להתקין כלום.',
  'guide.title': 'מדריך התקנה', 'guide.sub': 'שלושה מסלולים: אפליקציית אנדרואיד (APK), PWA באנדרואיד, ו-PWA באייפון.',
  'guide.android': 'אפליקציית אנדרואיד (APK)', 'guide.pwa': 'התקנת PWA באנדרואיד', 'guide.ios': 'התקנת PWA באייפון (Safari)',
  'guide.why': 'למה יש אזהרות?', 'guide.whyText': 'האפליקציות כאן לא מגיעות מ-Google Play, ולכן אנדרואיד מציג הודעות כמו "קובץ זה עלול להזיק" או "לא ניתן להתקין אפליקציות לא מוכרות". זה תקין: מדובר בהגנה כללית של המכשיר ולא בבעיה בקובץ. אפשר לוודא את הקובץ בעזרת קובץ ה-SHA-256 שמופיע בעמוד האפליקציה.',
  'guide.mockNote': 'האיורים להמחשה בלבד. הניסוח והמראה משתנים בין יצרנים וגרסאות אנדרואיד (Samsung, Xiaomi, Pixel ועוד), אבל השלבים זהים.',
  'guide.update': 'עדכון אפליקציה קיימת', 'guide.updateText': 'כדי לעדכן, מורידים את הגרסה החדשה ומתקינים מעליה. הנתונים נשמרים כי האפליקציה חתומה באותו מפתח. אם ההתקנה נכשלת, מסירים את הגרסה הישנה ומתקינים מחדש (הנתונים יימחקו, גבו קודם אם אפשר).',
  'guide.step': 'שלב {n}',
  'a1.t': 'הורדת הקובץ', 'a1.d': 'לוחצים "הורדת APK". Chrome שואל אם לשמור את הקובץ, כי קובצי APK עלולים להזיק. בוחרים "הורדה בכל זאת" (Download anyway).',
  'a2.t': 'פתיחת הקובץ', 'a2.d': 'בסיום ההורדה לוחצים "פתיחה" בהודעה, או פותחים את הקובץ מהתיקייה "הורדות" באפליקציית הקבצים.',
  'a3.t': 'אישור מקור לא מוכר', 'a3.d': 'בפעם הראשונה אנדרואיד יחסום ויציג "מטעמי אבטחה, הטלפון שלך לא מורשה להתקין אפליקציות לא מוכרות ממקור זה". לוחצים "הגדרות".',
  'a4.t': 'מתן הרשאה לדפדפן', 'a4.d': 'מפעילים את המתג "אפשר ממקור זה" עבור Chrome (או האפליקציה שממנה הורדתם) וחוזרים אחורה. ההרשאה נדרשת פעם אחת בלבד.',
  'a5.t': 'התקנה', 'a5.d': 'מופיע מסך "האם להתקין את האפליקציה?". לוחצים "התקנה".',
  'a6.t': 'אזהרת Play Protect', 'a6.d': 'ייתכן ש-Google Play Protect יציע לסרוק את האפליקציה. אפשר ללחוץ "סריקת האפליקציה", או "התקנה בלי סריקה". אם מופיע "נחסמה על ידי Play Protect", לוחצים "פרטים נוספים" ואז "התקנה בכל זאת".',
  'a7.t': 'סיום ופתיחה', 'a7.d': 'האפליקציה הותקנה. לוחצים "פתיחה", או מוצאים אותה במסך האפליקציות. ההתקנה הושלמה!',
  'p1.t': 'פתיחה ב-Chrome', 'p1.d': 'פותחים את קישור האפליקציה ב-Chrome באנדרואיד.', 'p2.t': 'תפריט הדפדפן', 'p2.d': 'לוחצים על שלוש הנקודות (⋮) ובוחרים "התקנת אפליקציה" או "הוספה למסך הבית".', 'p3.t': 'אישור', 'p3.d': 'מאשרים "התקנה". האפליקציה תופיע במסך הבית ובמגירת האפליקציות, ותיפתח במסך מלא, גם בלי אינטרנט.',
  'i1.t': 'פתיחה ב-Safari', 'i1.d': 'באייפון חייבים להשתמש ב-Safari. פותחים את הקישור.', 'i2.t': 'כפתור השיתוף', 'i2.d': 'לוחצים על כפתור השיתוף (ריבוע עם חץ למעלה) ובוחרים "הוספה למסך הבית".', 'i3.t': 'הוספה', 'i3.d': 'לוחצים "הוספה". האפליקציה תופיע במסך הבית.',
  'mock.dl.title': 'לשמור את הקובץ?', 'mock.dl.body': 'סוג קובץ זה עלול להזיק למכשיר שלך. האם לשמור את {file} בכל זאת?', 'mock.cancel': 'ביטול', 'mock.dlAnyway': 'הורדה בכל זאת',
  'mock.done.title': 'ההורדה הושלמה', 'mock.open': 'פתיחה', 'mock.unk.title': 'ההתקנה נחסמה', 'mock.unk.body': 'מטעמי אבטחה, הטלפון שלך לא מורשה להתקין אפליקציות לא מוכרות ממקור זה.', 'mock.settings': 'הגדרות',
  'mock.allow.title': 'התקנת אפליקציות לא מוכרות', 'mock.allow.row': 'אפשר ממקור זה', 'mock.install.title': 'האם להתקין את האפליקציה?', 'mock.install.body': 'האפליקציה תקבל גישה לנתונים שהיא מבקשת. הנתונים הקיימים שלכם יישמרו.', 'mock.installBtn': 'התקנה',
  'mock.pp.title': 'לסרוק את האפליקציה?', 'mock.pp.body': 'האפליקציה הזו לא הורדה מ-Google Play. Play Protect יכול לבדוק אותה לפני ההתקנה.', 'mock.pp.scan': 'סריקת האפליקציה', 'mock.pp.skip': 'התקנה בלי סריקה', 'mock.pp.more': 'פרטים נוספים → התקנה בכל זאת',
  'mock.ok.title': 'האפליקציה הותקנה', 'mock.ok.done': 'סיום', 'mock.menu.install': 'התקנת אפליקציה', 'mock.menu.add': 'הוספה למסך הבית', 'mock.menu.new': 'כרטיסייה חדשה', 'mock.menu.share': 'שיתוף',
  'mock.pwa.title': 'להתקין את האפליקציה?', 'mock.pwa.body': 'האפליקציה תותקן במכשיר ותיפתח ללא סרגל כתובת.', 'mock.ios.add': 'הוספה למסך הבית', 'mock.ios.copy': 'העתקה', 'mock.ios.addBtn': 'הוספה', 'mock.home': 'מסך הבית',
  'art.download': 'מורידים', 'art.allow': 'מאשרים פעם אחת', 'art.done': 'פותחים ומשתמשים',
  'about.title': 'אודות החנות', 'about.what': 'מה זה?', 'about.whatText': 'OS APPs and Downs היא החנות הפרטית של האפליקציות שפיתחתי: אתרים ו-PWA נפתחים בלחיצה, ואפליקציות אנדרואיד מורדות כקובץ APK עם הוראות התקנה. הגרסה שמוצגת כאן היא תמיד האחרונה.',
  'about.name': 'למה השם הזה?', 'about.nameText': 'OS הם ראשי התיבות שלי. "Ups and Downs" זה לעלות ולהוריד, כאן כתוב APPs כמו Application, ולכן OS APPs and Downs.',
  'about.rights': 'זכויות יוצרים', 'about.rightsText': 'כל הזכויות שמורות © {year} OS. אין להעתיק, להפיץ או לעשות שימוש מסחרי באפליקציות, בקוד או בתוכן ללא אישור בכתב.',
  'about.ai': 'תמונות ואיורים', 'about.aiText': 'כל התמונות, האייקונים והאיורים בחנות ובאפליקציות נוצרו בעזרת כלי בינה מלאכותית שונים. צילומי המסך נלקחו אוטומטית מהאפליקציות עצמן. אם יש לכם הסתייגות או בעיה עם תוכן כלשהו, אפשר לפנות ואטפל בכך מהר.',
  'about.contact': 'יצירת קשר ודיווח', 'about.contactText': 'לדיווח על בעיה, בקשת הסרה או שאלה, פותחים פנייה בעמוד ה-Issues ב-GitHub.', 'about.contactBtn': 'פתיחת פנייה',
  'about.privacy': 'פרטיות', 'about.privacyText': 'החנות לא אוספת מידע ואין בה חשבונות או מעקב. מה שסימנתם (מועדפות, גרסאות שהתקנתם, שפה ותצוגה) נשמר רק במכשיר שלכם.',
  'about.version': 'גרסת החנות', 'about.check': 'בדיקת עדכון לחנות', 'about.checking': 'בודק...', 'about.latest': 'יש לכם את הגרסה האחרונה', 'about.updating': 'מתעדכן לגרסה {v}...', 'about.failed': 'לא ניתן לבדוק כרגע (אין חיבור?)',
  'about.catalog': 'הקטלוג עודכן', 'about.installStore': 'התקנת החנות על המסך', 'about.installed': 'החנות כבר מותקנת', 'about.share': 'שיתוף החנות', 'about.shareText': 'חנות האפליקציות שלי: {url}',
  'footer.rights': 'כל הזכויות שמורות © {year} OS', 'footer.ai': 'כל התמונות נוצרו בכלי AI שונים. בבעיה אפשר ליצור קשר.', 'footer.about': 'פרטים נוספים',
  'toast.saved': 'נוסף למועדפות', 'toast.removed': 'הוסר מהמועדפות', 'toast.copied': 'הקישור הועתק', 'lightbox.close': 'סגירה', 'lightbox.prev': 'הקודם', 'lightbox.next': 'הבא', 'shot.alt': 'צילום מסך של {name}: {cap}',
  'offline': 'אין חיבור: מוצג הקטלוג האחרון ששמרנו.', 'load.error': 'לא הצלחנו לטעון את הקטלוג.', 'retry': 'ניסיון חוזר',
};

const en = {
  'app.name': 'OS APPs and Downs', 'app.tag': "OS's app store", 'app.title': 'OS APPs and Downs - the app store',
  'nav.store': 'Store', 'nav.guide': 'How to install', 'nav.about': 'About', 'nav.back': 'Back to the store', 'nav.menu': 'Menu',
  'top.lang': 'עב', 'top.langLabel': 'Switch language to Hebrew', 'top.theme': 'Appearance', 'theme.auto': 'Automatic', 'theme.light': 'Light', 'theme.dark': 'Dark',
  'search.label': 'Search apps', 'search.ph': 'Search an app or topic...', 'search.clear': 'Clear search',
  'plat.all': 'All', 'plat.web': 'Web / PWA', 'plat.android': 'Android', 'plat.pwa': 'PWA', 'plat.webOnly': 'Web', 'plat.apk': 'APK',
  'filter.open': 'Filter & sort', 'filter.title': 'Filter & sort', 'filter.category': 'Category', 'filter.anyCategory': 'All categories', 'filter.tags': 'Tags',
  'filter.sort': 'Sort by', 'sort.updated': 'Recently updated', 'sort.new': 'Newest', 'sort.name': 'Name', 'filter.favs': 'Favourites only', 'filter.clear': 'Clear all', 'filter.apply': 'Show {n} results', 'filter.active': '{n} active',
  'home.recent': 'Recently updated', 'home.all': 'All apps', 'home.count': '{n} apps', 'home.count1': '1 app', 'home.none': 'No apps found', 'home.noneHint': 'Try another search or clear the filters.',
  'home.hero': 'All my apps, in one place', 'home.heroSub': 'Open websites and PWAs in one tap, and download Android apps with full install instructions. Always the latest version.',
  'card.open': 'Open', 'card.download': 'Download APK', 'card.releases': 'Get it', 'card.details': 'Details', 'card.version': 'Version {v}', 'card.updated': 'Updated {when}', 'card.fav': 'Add to favourites', 'card.unfav': 'Remove from favourites', 'card.recent': 'Recently updated', 'card.updateAvail': 'Update available', 'card.beta': 'Beta',
  'detail.screens': 'Screenshots', 'detail.noShots': 'Device screenshots will be added when the app is first shown.', 'detail.about': 'About this app', 'detail.highlights': 'What you can do', 'detail.whatsNew': "What's new in {v}",
  'detail.info': 'Information', 'detail.version': 'Latest version', 'detail.released': 'Release date', 'detail.updated': 'Last update', 'detail.platforms': 'Platforms', 'detail.android': 'Requires', 'detail.androidVal': 'Android {v} or newer', 'detail.pkg': 'Package id', 'detail.category': 'Category', 'detail.rights': 'Rights', 'detail.rightsVal': 'All rights reserved © OS',
  'detail.install': 'How to install', 'detail.links': 'Links', 'detail.repo': 'Source code on GitHub', 'detail.changelog': 'Version history', 'detail.releases': 'All releases', 'detail.sha': 'Checksum file (SHA-256)', 'detail.report': 'Report a problem', 'detail.notFound': 'App not found',
  'detail.share': 'Share', 'detail.shareWa': 'Send on WhatsApp', 'detail.markInstalled': 'Mark: I installed this version', 'detail.unmark': 'Clear installed mark', 'detail.installedV': 'You marked version {v} as installed', 'detail.updateAvail': 'A newer version is out: {v}. Worth updating.',
  'detail.private': 'The app repository is private: the download only works when you are signed in to GitHub with access.', 'detail.noApk': 'There is no public APK for this app right now.',
  'inst.pwaTitle': 'Open and install as a PWA', 'inst.webTitle': 'Open the website', 'inst.apkTitle': 'Install the APK on Android', 'inst.show': 'Show the full instructions with pictures', 'inst.hide': 'Hide the instructions',
  'inst.apkShort1': 'Download the APK file.', 'inst.apkShort2': 'Open it and allow installing from this source (once).', 'inst.apkShort3': 'Tap Install. If Play Protect warns you, choose "Install anyway".',
  'inst.pwaShort1': 'Open the link in Chrome.', 'inst.pwaShort2': 'In the menu (⋮) choose "Install app" or "Add to Home screen".', 'inst.webShort': 'Open the link in your browser. Nothing to install.',
  'guide.title': 'Install guide', 'guide.sub': 'Three paths: an Android app (APK), a PWA on Android, and a PWA on iPhone.',
  'guide.android': 'Android app (APK)', 'guide.pwa': 'Install a PWA on Android', 'guide.ios': 'Install a PWA on iPhone (Safari)',
  'guide.why': 'Why are there warnings?', 'guide.whyText': 'These apps do not come from Google Play, so Android shows messages like "this type of file can harm your device" or "unknown apps cannot be installed". That is normal: it is a general protection of the phone, not a problem with the file. You can verify the file with the SHA-256 checksum on the app page.',
  'guide.mockNote': 'Illustrations only. Wording and looks differ between brands and Android versions (Samsung, Xiaomi, Pixel...), but the steps are the same.',
  'guide.update': 'Updating an installed app', 'guide.updateText': 'To update, download the new version and install it over the old one. Your data stays because the app is signed with the same key. If the install fails, uninstall the old version and install again (data is erased, back up first if you can).',
  'guide.step': 'Step {n}',
  'a1.t': 'Download the file', 'a1.d': 'Tap "Download APK". Chrome asks whether to keep the file, because APK files can be harmful. Choose "Download anyway".',
  'a2.t': 'Open the file', 'a2.d': 'When the download finishes tap "Open" in the notification, or open the file from the Downloads folder in your files app.',
  'a3.t': 'Allow unknown sources', 'a3.d': 'The first time Android blocks it and shows "For your security, your phone is not allowed to install unknown apps from this source". Tap "Settings".',
  'a4.t': 'Allow your browser', 'a4.d': 'Turn on "Allow from this source" for Chrome (or the app you downloaded from) and go back. This is needed only once.',
  'a5.t': 'Install', 'a5.d': 'A "Do you want to install this app?" screen appears. Tap "Install".',
  'a6.t': 'Play Protect warning', 'a6.d': 'Google Play Protect may offer to scan the app. Tap "Scan app", or "Install without scanning". If it says "Blocked by Play Protect", tap "More details" and then "Install anyway".',
  'a7.t': 'Done - open it', 'a7.d': 'The app is installed. Tap "Open", or find it in your app drawer. That is it!',
  'p1.t': 'Open in Chrome', 'p1.d': 'Open the app link in Chrome on Android.', 'p2.t': 'Browser menu', 'p2.d': 'Tap the three dots (⋮) and choose "Install app" or "Add to Home screen".', 'p3.t': 'Confirm', 'p3.d': 'Confirm "Install". The app appears on your home screen and app drawer and opens full screen, even offline.',
  'i1.t': 'Open in Safari', 'i1.d': 'On iPhone you must use Safari. Open the link.', 'i2.t': 'Share button', 'i2.d': 'Tap the Share button (a square with an arrow up) and choose "Add to Home Screen".', 'i3.t': 'Add', 'i3.d': 'Tap "Add". The app appears on your home screen.',
  'mock.dl.title': 'Keep this file?', 'mock.dl.body': 'This type of file can harm your device. Do you want to keep {file} anyway?', 'mock.cancel': 'Cancel', 'mock.dlAnyway': 'Download anyway',
  'mock.done.title': 'Download complete', 'mock.open': 'Open', 'mock.unk.title': 'Install blocked', 'mock.unk.body': 'For your security, your phone is not allowed to install unknown apps from this source.', 'mock.settings': 'Settings',
  'mock.allow.title': 'Install unknown apps', 'mock.allow.row': 'Allow from this source', 'mock.install.title': 'Do you want to install this app?', 'mock.install.body': 'The app gets access to what it requests. Your existing data is kept.', 'mock.installBtn': 'Install',
  'mock.pp.title': 'Scan app?', 'mock.pp.body': 'This app was not downloaded from Google Play. Play Protect can check it before installing.', 'mock.pp.scan': 'Scan app', 'mock.pp.skip': 'Install without scanning', 'mock.pp.more': 'More details → Install anyway',
  'mock.ok.title': 'App installed', 'mock.ok.done': 'Done', 'mock.menu.install': 'Install app', 'mock.menu.add': 'Add to Home screen', 'mock.menu.new': 'New tab', 'mock.menu.share': 'Share',
  'mock.pwa.title': 'Install app?', 'mock.pwa.body': 'The app is installed on your device and opens without an address bar.', 'mock.ios.add': 'Add to Home Screen', 'mock.ios.copy': 'Copy', 'mock.ios.addBtn': 'Add', 'mock.home': 'Home screen',
  'art.download': 'Download', 'art.allow': 'Allow once', 'art.done': 'Open and enjoy',
  'about.title': 'About the store', 'about.what': 'What is this?', 'about.whatText': 'OS APPs and Downs is the private store for the apps I build: websites and PWAs open in one tap, and Android apps download as an APK with install instructions. The version shown here is always the latest.',
  'about.name': 'Why this name?', 'about.nameText': 'OS are my initials. "Ups and Downs" is going up and down; here it is spelled APPs, as in Applications, so: OS APPs and Downs.',
  'about.rights': 'Copyright', 'about.rightsText': 'All rights reserved © {year} OS. Do not copy, distribute or use the apps, code or content commercially without written permission.',
  'about.ai': 'Images and artwork', 'about.aiText': 'All pictures, icons and illustrations in the store and in the apps were created with various AI tools. Screenshots are taken automatically from the apps themselves. If you have any objection or problem with any content, contact me and I will handle it quickly.',
  'about.contact': 'Contact and reports', 'about.contactText': 'To report a problem, ask for removal or ask a question, open an issue on GitHub.', 'about.contactBtn': 'Open an issue',
  'about.privacy': 'Privacy', 'about.privacyText': 'The store collects nothing: no accounts, no tracking. What you mark (favourites, installed versions, language and look) stays on your device.',
  'about.version': 'Store version', 'about.check': 'Check for a store update', 'about.checking': 'Checking...', 'about.latest': 'You have the latest version', 'about.updating': 'Updating to {v}...', 'about.failed': 'Cannot check right now (offline?)',
  'about.catalog': 'Catalog updated', 'about.installStore': 'Install the store on your device', 'about.installed': 'The store is already installed', 'about.share': 'Share the store', 'about.shareText': 'My app store: {url}',
  'footer.rights': 'All rights reserved © {year} OS', 'footer.ai': 'All images were created with various AI tools. Contact me about any problem.', 'footer.about': 'More details',
  'toast.saved': 'Added to favourites', 'toast.removed': 'Removed from favourites', 'toast.copied': 'Link copied', 'lightbox.close': 'Close', 'lightbox.prev': 'Previous', 'lightbox.next': 'Next', 'shot.alt': 'Screenshot of {name}: {cap}',
  'offline': 'You are offline: showing the last catalog we saved.', 'load.error': 'Could not load the catalog.', 'retry': 'Try again',
};

export const STRINGS = { he, en };
let lang = getLang();
export const getLanguage = () => lang;
export function setLanguage(l) { lang = l === 'en' ? 'en' : 'he'; setLang(lang); applyLang(); }
export function applyLang() { document.documentElement.lang = lang; document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'; document.title = t('app.title'); }
export function t(key, vars) {
  let s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
/** Pick the current language from a {he,en} object, falling back to the other one. */
export const loc = (o) => (o ? o[lang] || o.en || o.he || '' : '');
export const locList = (o) => (o ? (o[lang]?.length ? o[lang] : o.en || []) : []);
const fmtCache = {};
export function fmtDate(ymd) {
  if (!ymd) return '';
  const k = lang; fmtCache[k] ||= new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return fmtCache[k].format(new Date(`${ymd}T12:00:00Z`));
}
export function fmtRelative(ymd, now = Date.now()) {
  if (!ymd) return '';
  const days = Math.floor((now - Date.parse(`${ymd}T12:00:00Z`)) / 86400000);
  if (days > 60) return fmtDate(ymd);
  return new Intl.RelativeTimeFormat(lang === 'he' ? 'he' : 'en', { numeric: 'auto' }).format(-Math.max(days, 0), 'day');
}
