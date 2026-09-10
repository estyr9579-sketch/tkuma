import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Every text on the public site lives here as a default, keyed by a stable id.
 * The admin can override any value from /admin/content (stored in `site_content`).
 * `multiline: true` -> textarea in the admin editor.
 */
export interface ContentField {
  label: string;
  page: string;
  default: string;
  multiline?: boolean;
}

export const CONTENT: Record<string, ContentField> = {
  // ---------- Global ----------
  "site.name": { page: "כללי", label: "שם האתר (מותג)", default: "תקומה שלמה" },
  "site.subname": { page: "כללי", label: "שם השירות (מוצג מתחת למותג)", default: "מתאם טיפול אישי" },
  "site.slogan": { page: "כללי", label: "סלוגן (מהלוגו)", default: "הכוונה רגשית לבנייה עצמית מחדש" },
  "site.tagline": { page: "כללי", label: "תיאור קצר (SEO)", default: "תקומה שלמה – מתאם טיפול אישי. ייעוץ, הכוונה וניווט טיפולי אישי: עוזרים לך לעשות סדר בעולם הטיפול הרגשי ולבנות מפת דרכים מותאמת אישית." },
  "site.phone": { page: "כללי", label: "טלפון ליצירת קשר (מוצג באתר)", default: "" },
  "site.email": { page: "כללי", label: "אימייל ליצירת קשר (מוצג באתר)", default: "" },
  "nav.cta": { page: "כללי", label: "כפתור בולט בתפריט", default: "השארת פרטים" },
  "footer.text": { page: "כללי", label: "טקסט קצר בפוטר", default: "עושים סדר. מבינים את האפשרויות. בונים כיוון. ומתקדמים צעד אחר צעד." },

  // ---------- Home ----------
  "home.hero.title": { page: "דף הבית", label: "כותרת עליונה (מותג)", default: "תקומה שלמה" },
  "home.hero.tagline": { page: "דף הבית", label: "שורה מתחת למותג", default: "מתאם טיפול אישי · הכוונה רגשית לבנייה עצמית מחדש" },
  "home.hero.subtitle": { page: "דף הבית", label: "כותרת משנה", default: "מרגיש שצריך עזרה או הכוונה רגשית ולא יודע למי ללכת?" },
  "home.hero.line1": { page: "דף הבית", label: "שורה 1", default: "טובע בים של טיפולים?" },
  "home.hero.line2": { page: "דף הבית", label: "שורה 2", default: "אלפי שקלים על ניסוי וטעייה ולא מוצא דרך לצאת מהסבך?" },
  "home.hero.text": { page: "דף הבית", label: "פסקה", default: "אנחנו נעזור לך לעשות סדר, להבין את האפשרויות ולבנות עבורך מפת דרכים טיפולית מותאמת אישית.", multiline: true },
  "home.hero.cta": { page: "דף הבית", label: "כפתור ראשי", default: "בואו נעשה סדר" },
  "home.hero.cta_sub": { page: "דף הבית", label: "טקסט מתחת לכפתור", default: "השאירו פרטים ונחזור אליכם לשיחה ראשונית." },
  "home.hero.secondary": { page: "דף הבית", label: "קישור משני", default: "איך התהליך עובד?" },
  "home.principle.title": { page: "דף הבית", label: "עיקרון – כותרת", default: "לא עוד אדם שנזרק לבד לתוך ים של אפשרויות." },
  "home.principle.text": { page: "דף הבית", label: "עיקרון – טקסט", default: "עושים סדר. מבינים את האפשרויות. בונים כיוון. ומתקדמים צעד אחר צעד." },
  "home.principle.quote": { page: "דף הבית", label: "עיקרון – ציטוט", default: "סוף סוף מישהו יכול לעזור לי להבין לאן אני הולך." },
  "home.who.title": { page: "דף הבית", label: "למי זה מתאים – כותרת", default: "למי זה מתאים?" },
  "home.who.items": { page: "דף הבית", label: "למי זה מתאים – רשימה (שורה לכל פריט)", multiline: true, default: "שמרגישים תקועים\nשאינם יודעים למי לפנות\nשמרגישים מבולבלים מול עולם הטיפול\nשניסו מספר טיפולים ואינם יודעים כיצד להמשיך\nשרוצים עזרה בבניית כיוון\nשרוצים לקחת בחשבון גם את היכולת הכלכלית שלהם\nשמרגישים שהם זקוקים לאדם שיעזור להם לראות את התמונה הגדולה" },
  "home.who.intro": { page: "דף הבית", label: "למי זה מתאים – פתיח", default: "השירות יכול להתאים לאנשים:" },
  "home.journey.title": { page: "דף הבית", label: "המסע – כותרת", default: "מבלבול לכיוון ברור" },
  "home.journey.items": { page: "דף הבית", label: "המסע – תחנות (שורה לכל תחנה)", multiline: true, default: "קושי\nבלבול\nהבנה\nסדר\nתוכנית\nליווי" },
  "home.journey.text": { page: "דף הבית", label: "המסע – משפט", default: "רוב האנשים מגיעים אלינו באמצע הדרך – אחרי שכבר ניסו, התייאשו או פשוט לא ידעו מאיפה להתחיל. משם בונים, צעד אחר צעד." },
  "home.process.intro": { page: "דף הבית", label: "התהליך – משפט קצר בדף הבית", default: "חמישה שלבים, בקצב שלך. בדרך כלל 5–7 פגישות ראשוניות ואחר כך ליווי." },
  "home.trust.title": { page: "דף הבית", label: "אמינות – כותרת", default: "מה השירות כן – ומה הוא לא" },
  "home.trust.do.title": { page: "דף הבית", label: "אמינות – כותרת 'כן'", default: "מה אנחנו עושים" },
  "home.trust.do": { page: "דף הבית", label: "אמינות – 'כן' (שורה לכל פריט)", multiline: true, default: "עוזרים להבין את האפשרויות הטיפוליות הקיימות\nבונים מפת דרכים אישית שמתחשבת בצרכים ובתקציב\nמחברים לאנשי מקצוע מתאימים\nמלווים ובודקים יחד אם הדרך מתקדמת" },
  "home.trust.dont.title": { page: "דף הבית", label: "אמינות – כותרת 'לא'", default: "מה אנחנו לא" },
  "home.trust.dont": { page: "דף הבית", label: "אמינות – 'לא' (שורה לכל פריט)", multiline: true, default: "לא טיפול פסיכולוגי, פסיכיאטרי או רפואי\nלא תחליף לאבחון של איש מקצוע מוסמך\nלא מתחייבים לתוצאה או להחלמה\nלא שירות חירום" },
  "home.trust.who.title": { page: "דף הבית", label: "אמינות – מי מאחורי השירות (כותרת)", default: "מי עומד מאחורי השירות" },
  "home.trust.who.text": { page: "דף הבית", label: "אמינות – מי מאחורי השירות (טקסט)", multiline: true, default: "אדם שעבר בעצמו דרך ארוכה בעולם הטיפול, צבר ידע וניסיון, ובעל רקע כמדריך רכיבה טיפולית. לא פסיכולוג ולא רופא – אלא אדם ניטרלי שמכיר את השטח ועוזר לעשות סדר." },
  "home.trust.who.link": { page: "דף הבית", label: "אמינות – טקסט קישור", default: "לסיפור המלא ולגילוי הנאות" },

  // ---------- About ----------
  "about.title": { page: "מי אנחנו", label: "כותרת", default: "מי אנחנו?" },
  "about.subtitle": { page: "מי אנחנו", label: "כותרת משנה", default: "מתאם טיפול אישי – לעשות סדר בתוך הכאוס הרגשי" },
  "about.intro": { page: "מי אנחנו", label: "פתיח", multiline: true, default: "אנחנו מכירים מקרוב את התחושה הזו.\n\nאתה יודע שאתה זקוק לעזרה ולעוגן רגשי, אבל הדרך נראית כמו ים סוער של אפשרויות:" },
  "about.questions": { page: "מי אנחנו", label: "שאלות (שורה לכל שאלה)", multiline: true, default: "האם לפנות ל-CBT?\nהאם EMDR מתאים?\nאולי טיפול דינמי?\nאולי בכלל טיפול באומנויות?\nשחייה טיפולית?\nרכיבה טיפולית?\nאו שילוב של מספר גישות?" },
  "about.body": { page: "מי אנחנו", label: "גוף", multiline: true, default: "אנחנו מכירים גם את התסכול השקט – אותם טיפולים שנמשכו זמן רב ולא הרגישו מתקדמים, את סימני השאלה סביב השאלה האם להמשיך או לעצור, ואת הקושי לדעת מתי נכון לעבור למטפל אחר.\n\nבחירת הדרך הטיפולית המתאימה אינה תמיד פשוטה.\n\nהיא דורשת היכרות עם האפשרויות הקיימות, הבנה של האדם, היכרות עם אנשי מקצוע שונים והתחשבות גם במגבלות הכלכליות.\n\nאנחנו עברנו בעצמנו דרך מפותלת.\n\nדרך שלפעמים מרגישה כמו הליכה ארוכה במדבר.\n\nלמדנו אותה על עצמנו, צברנו ניסיון וידע, והבנו עד כמה קשה לאדם שנמצא בתוך הקושי לראות את הדרך מבחוץ." },
  "about.highlight": { page: "מי אנחנו", label: "משפט מודגש", default: "אנחנו כאן כדי ללכת לצדך." },
  "about.outro": { page: "מי אנחנו", label: "סיום", multiline: true, default: "לעזור לעשות סדר, לצמצם ניסוי וטעייה ככל שניתן, ולבנות מפת דרכים רגשית שמתחשבת באדם עצמו, בצרכים שלו ובאפשרויות העומדות לרשותו." },

  // ---------- Process ----------
  "process.title": { page: "איך התהליך עובד", label: "כותרת", default: "איך התהליך עובד?" },
  "process.subtitle": { page: "איך התהליך עובד", label: "כותרת משנה", default: "במקום ללכת לאיבוד בין האפשרויות – בונים דרך." },
  "process.intro": { page: "איך התהליך עובד", label: "פתיח", default: "התהליך הראשוני מורכב בדרך כלל מ-5–7 פגישות, בהתאם לצורך ולמקרה." },
  "process.step1.title": { page: "איך התהליך עובד", label: "שלב 1 – כותרת", default: "מיפוי והיכרות" },
  "process.step1.text": { page: "איך התהליך עובד", label: "שלב 1 – טקסט", multiline: true, default: "היכרות מעמיקה עם האדם, הקושי שהוא חווה, המטרות שלו, המשאבים העומדים לרשותו והיכולת שלו להתמודד עם עומס.\n\nהמטרה היא להבין את התמונה הרחבה לפני שממהרים לבחור טיפול." },
  "process.step2.title": { page: "איך התהליך עובד", label: "שלב 2 – כותרת", default: "בניית מפת דרכים אישית" },
  "process.step2.text": { page: "איך התהליך עובד", label: "שלב 2 – פתיח", default: "בניית תוכנית שמנסה לענות על השאלות:" },
  "process.step2.items": { page: "איך התהליך עובד", label: "שלב 2 – רשימה (שורה לכל פריט)", multiline: true, default: "מהו הכיוון הטיפולי המרכזי?\nאילו אפשרויות קיימות?\nאיזה סוג איש מקצוע עשוי להתאים?\nהאם נדרש טיפול נלווה?\nמה ניתן לעשות במסגרת התקציב הקיים?\nמה סדר העדיפויות?" },
  "process.step3.title": { page: "איך התהליך עובד", label: "שלב 3 – כותרת", default: "חיבור לאנשי מקצוע" },
  "process.step3.text": { page: "איך התהליך עובד", label: "שלב 3 – טקסט", multiline: true, default: "סיוע באיתור אנשי מקצוע פוטנציאליים שמתאימים לצרכים, למטרות וליכולת הכלכלית.\n\nבמידת האפשר, סיוע ביצירת הקשר ובבניית מעטפת סביב האדם." },
  "process.step4.title": { page: "איך התהליך עובד", label: "שלב 4 – כותרת", default: "טיפול ותמיכה" },
  "process.step4.text": { page: "איך התהליך עובד", label: "שלב 4 – פתיח", default: "במקרים מתאימים, בחינת אפשרויות נוספות שיכולות לתמוך בתהליך המרכזי, לדוגמה:" },
  "process.step4.items": { page: "איך התהליך עובד", label: "שלב 4 – רשימה (שורה לכל פריט)", multiline: true, default: "הידרותרפיה\nרכיבה טיפולית\nטיפול באומנויות\nפעילות גופנית מותאמת\nעיסוי גוף-נפש\nאפשרויות נוספות בהתאם לצורך" },
  "process.step4.note": { page: "איך התהליך עובד", label: "שלב 4 – הבהרה", multiline: true, default: "טיפולים נלווים אינם מתאימים לכל אדם ואינם מהווים תחליף לטיפול רפואי או נפשי כאשר הוא נדרש." },
  "process.step5.title": { page: "איך התהליך עובד", label: "שלב 5 – כותרת", default: "ליווי ובקרה" },
  "process.step5.text": { page: "איך התהליך עובד", label: "שלב 5 – פתיח", default: "לאחר תחילת התהליך, מתקיימים מפגשי מעקב תקופתיים, בדרך כלל אחת לחודש וחצי, במטרה לבחון:" },
  "process.step5.items": { page: "איך התהליך עובד", label: "שלב 5 – רשימה (שורה לכל פריט)", multiline: true, default: "האם הטיפול מתקדם?\nהאם קיימת תחושת התקדמות?\nהאם קיימת כימיה בין המטופל למטפל?\nהאם המטפל מתאים?\nהאם נכון להמשיך?\nהאם נדרש שינוי?\nהאם יש צורך בבחינת אפשרות אחרת?" },
  "process.step1.short": { page: "איך התהליך עובד", label: "שלב 1 – שורה קצרה (לציר הזמן)", default: "היכרות עם האדם, הקושי, המטרות והמשאבים" },
  "process.step2.short": { page: "איך התהליך עובד", label: "שלב 2 – שורה קצרה", default: "כיוון טיפולי, סדר עדיפויות, מסגרת תקציב" },
  "process.step3.short": { page: "איך התהליך עובד", label: "שלב 3 – שורה קצרה", default: "איתור אנשי מקצוע מתאימים וסיוע ביצירת הקשר" },
  "process.step4.short": { page: "איך התהליך עובד", label: "שלב 4 – שורה קצרה", default: "טיפול מרכזי, ובמידת הצורך תמיכה נלווית" },
  "process.step5.short": { page: "איך התהליך עובד", label: "שלב 5 – שורה קצרה", default: "מפגשי מעקב – האם הדרך מתאימה, ומה לשנות" },
  "process.step5.note": { page: "איך התהליך עובד", label: "שלב 5 – סיום", multiline: true, default: "המטרה אינה \"להחזיק\" אדם בטיפול בכל מחיר.\n\nהמטרה היא לבדוק שהדרך מתאימה לו." },

  // ---------- Roadmap / personal story ----------
  "roadmap.title": { page: "מפת הדרכים", label: "כותרת", default: "מפת הדרכים – סדר בבלגן של עולם הטיפול" },
  "roadmap.subtitle": { page: "מפת הדרכים", label: "כותרת משנה", default: "מי אנחנו ובשביל מה אנחנו כאן?" },
  "roadmap.intro": { page: "מפת הדרכים", label: "פתיח", multiline: true, default: "המיזם הזה קם מתוך מקום אישי ועמוק.\n\nכשאני עצמי הייתי צריך טיפול והכוונה רגשית, מצאתי את עצמי טובע בים של מושגים ושאלות:" },
  "roadmap.questions": { page: "מפת הדרכים", label: "שאלות (שורה לכל שאלה)", multiline: true, default: "האם לפנות לפסיכולוג קליני?\nלעובד סוציאלי?\nאולי למטפל באומנויות?\nEMDR?\nCBT?\nאו בכלל שילוב של טיפול רגשי עם פעילות גופנית, ספורט או רכיבה טיפולית?\nהאם הטיפול שאני עובר באמת מקדם אותי?\nהאם הוא פשוט נמשך ללא שינוי?\nואולי הגיע הזמן להחליף מטפל?" },
  "roadmap.body": { page: "מפת הדרכים", label: "גוף", multiline: true, default: "עברתי מסע של למעלה מחמש שנים של התנסויות אישיות, הצלחות וכישלונות, קריאת ספרות מקצועית רצינית והקשבה למאות סיפורים של אנשים אחרים שהרגישו אבודים בדרך.\n\nעם הזמן הבנתי שחסר משהו חשוב:" },
  "roadmap.highlight": { page: "מפת הדרכים", label: "משפט מודגש", default: "אדם ניטרלי שמבין את המצוקה, מכיר את השטח ויכול לעזור לעשות סדר בין האפשרויות." },
  "roadmap.disclosure.title": { page: "מפת הדרכים", label: "גילוי נאות – כותרת", default: "גילוי נאות" },
  "roadmap.disclosure.text": { page: "מפת הדרכים", label: "גילוי נאות – טקסט", multiline: true, default: "אני מגיע מהשטח, מתוך ניסיון חיים וצבירת ידע מעמיקה, ובעל רקע מקצועי כמרצה/מדריך רכיבה טיפולית." },
  "roadmap.disclosure.bold": { page: "מפת הדרכים", label: "גילוי נאות – משפט מודגש", default: "איני פסיכולוג קליני, עובד סוציאלי או רופא, ואיני מציע טיפול נפשי או רפואי קליני." },
  "roadmap.disclosure.service": { page: "מפת הדרכים", label: "גילוי נאות – הגדרת השירות", multiline: true, default: "השירות שאני מציע הוא ייעוץ, הכוונה וניווט טיפולי אישי (Care Navigation).\n\nהמטרה היא לעזור לאדם להבין את האפשרויות העומדות בפניו, לבנות כיוון ולחבר אותו לאנשי המקצוע הרלוונטיים כאשר הדבר מתאים." },

  // ---------- Important notice ----------
  "notice.title": { page: "חשוב לדעת", label: "כותרת", default: "חשוב לדעת" },
  "notice.text": { page: "חשוב לדעת", label: "טקסט", multiline: true, default: "השירות אינו טיפול רפואי, פסיכולוגי או פסיכיאטרי ואינו מהווה תחליף לאבחון או טיפול של איש מקצוע מוסמך.\n\nכל אדם וכל מקרה שונים.\n\nהצלחתו של כל תהליך טיפולי תלויה בין היתר בהתמדה, במידת ההתאמה של הטיפול לאדם, באיכות הקשר עם איש המקצוע ובגורמים נוספים שאינם בשליטת השירות.\n\nאין אפשרות להתחייב לתוצאה טיפולית מסוימת, להחלמה מלאה או לבריאות מושלמת.\n\nמטרת השירות היא לסייע בהתמצאות, קבלת החלטות ובניית כיוון מותאם ככל האפשר.\n\nבמקרים שבהם נדרש טיפול רפואי או נפשי דחוף, יש לפנות ישירות לגורם רפואי או מקצועי מוסמך." },
  "notice.emergency": { page: "חשוב לדעת", label: "שורת חירום", multiline: true, default: "במצבי חירום או סכנה מיידית אין להמתין לחזרה מטעם האתר ויש לפנות לגורמי החירום המתאימים." },

  // ---------- Contact / lead form ----------
  "contact.title": { page: "צור קשר", label: "כותרת", default: "השארת פרטים" },
  "contact.text": { page: "צור קשר", label: "טקסט", multiline: true, default: "השאירו שם וטלפון ונחזור אליכם לשיחה ראשונית קצרה. אין צורך לפרט – רק מה שנוח לכם." },
  "contact.consent": { page: "צור קשר", label: "טקסט הסכמה", multiline: true, default: "השארת פרטים אינה מהווה התחלת טיפול ואינה מבטיחה קבלת שירות. הפרטים נשמרים באופן מאובטח ומשמשים אך ורק לחזרה אליכם, בהתאם למדיניות הפרטיות." },
  "contact.submit": { page: "צור קשר", label: "כפתור שליחה", default: "אשמח שיחזרו אליי" },
  "contact.success.title": { page: "צור קשר", label: "הודעת הצלחה – כותרת", default: "הפרטים התקבלו" },
  "contact.success.text": { page: "צור קשר", label: "הודעת הצלחה – טקסט", multiline: true, default: "תודה. נחזור אליכם בהקדם. אם מדובר במצב חירום, אנא פנו מיד לגורמי החירום המתאימים." },

  // ---------- Articles ----------
  "articles.title": { page: "מאמרים", label: "כותרת", default: "מאמרים ומידע" },
  "articles.intro": { page: "מאמרים", label: "פתיח", default: "ידע שעוזר לעשות סדר: סוגי טיפולים, איך בוחרים מטפל, מתי שוקלים לעבור, ומה עוזר בתקופות קשות." },
  "experts.title": { page: "מאמרי מומחים", label: "כותרת", default: "מאמרים מאנשי מקצוע" },
  "experts.intro": { page: "מאמרי מומחים", label: "פתיח", default: "מאמרים שנכתבו על ידי אנשי מקצוע מתחומי הטיפול השונים. כל מאמר עובר אישור לפני פרסום." },
  "experts.cta": { page: "מאמרי מומחים", label: "קריאה לכותבים", default: "איש מקצוע? אפשר להירשם ולשלוח מאמר לפרסום." },
};

export type ContentMap = Record<keyof typeof CONTENT, string>;

/** Loads all texts: defaults merged with admin overrides. Cached per request. */
export const getContent = cache(async (): Promise<ContentMap> => {
  const result: Record<string, string> = {};
  for (const k of Object.keys(CONTENT)) result[k] = CONTENT[k].default;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_content").select("key,value");
    for (const row of data ?? []) if (row.key in CONTENT) result[row.key] = row.value;
  } catch {
    // no DB yet – defaults are used
  }
  return result as ContentMap;
});

export function lines(s: string) {
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

export function paragraphs(s: string) {
  return s.split(/\n\s*\n/).map((l) => l.trim()).filter(Boolean);
}
