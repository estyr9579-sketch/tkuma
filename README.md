# מתאם טיפול אישי – אתר + מערכת ניהול

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Supabase (Postgres + Auth + Storage) · Vercel

## מה יש כאן

| אזור | נתיב | מי רואה |
|---|---|---|
| אתר ציבורי | `/` `/about` `/process` `/articles` `/articles/[slug]` `/experts` `/roadmap` `/contact` | כולם |
| עמודים משפטיים | `/privacy` `/terms` `/accessibility` `/disclosure` | כולם |
| הרשמה / התחברות / איפוס סיסמה | `/register` `/login` `/reset-password` | כולם |
| אזור אישי (כותבים) | `/account` `/account/articles/new` `/account/articles/[id]` `/account/settings` | משתמש מחובר |
| מערכת ניהול | `/admin` `/admin/leads` `/admin/articles` `/admin/users` `/admin/content` | מנהל בלבד |

**זרימת מאמר מומחה:** כותב שומר טיוטה → שולח לאישור (`pending`) → המנהל מאשר/מפרסם/מחזיר לעריכה עם הערה/דוחה → רק `published` מופיע באתר.

**מנהל מפרסם בשם אחר:** בטופס המאמר יש "המחבר המוצג באתר" (שם, ביו, תמונה, קישור) – נפרד מ"יוצר המאמר במערכת" (`created_by`).

**עריכת טקסטים ללא קוד:** כל טקסט באתר מוגדר ב־`src/lib/content.ts` עם ערך ברירת מחדל. המנהל עורך ב־`/admin/content`, והערכים נשמרים בטבלת `site_content`. שדה ריק = חזרה לברירת המחדל.

## התקנה – צעד אחר צעד

### 1. Supabase (חינם)
1. צור פרויקט ב־https://supabase.com (אזור: eu-west / Frankfurt).
2. **SQL Editor → New query** – הדבק את כל `supabase/schema.sql` והרץ. זה יוצר טבלאות, טריגרים, RLS, bucket לתמונות וקטגוריות.
3. **Authentication → URL Configuration:**
   - Site URL: הכתובת של האתר (בהתחלה `http://localhost:3000`, אחרי הפריסה כתובת ה־Vercel).
   - Redirect URLs: הוסף `http://localhost:3000/auth/callback` ו־`https://<your-app>.vercel.app/auth/callback`.
4. **Authentication → Providers → Email:** מומלץ להשאיר "Confirm email" דלוק. שים לב: ה־SMTP המובנה של Supabase מוגבל למספר מיילים קטן בשעה – מספיק ל־MVP; לתעבורה אמיתית חבר Resend/SMTP חיצוני תחת Auth → SMTP Settings.
5. **Project Settings → API:** העתק `Project URL`, `anon public`, `service_role` (סודי!).

### 2. הרצה מקומית (Windows CMD)
```cmd
copy .env.example .env.local
:: ערוך את .env.local עם הערכים מ-Supabase
npm install
npm run dev
```
פתח http://localhost:3000

### 3. יצירת המנהל הראשון
1. היכנס ל־`/register` והירשם עם האימייל **שמוגדר ב־`ADMIN_EMAIL`** (ab0548463077@gmail.com) ו/או הטלפון **שמוגדר ב־`ADMIN_PHONE`** (0506616981). מספיק שאחד מהם תואם.
2. אשר את המייל, התחבר – בהתחברות הראשונה המערכת מזהה אותך ומעניקה `admin` אוטומטית. `/admin` יופיע בתפריט.
   - לחלופין, ב־SQL: `update profiles set role='admin' where phone='0506616981';`

### 4. פריסה ל־Vercel (חינם, קישור `*.vercel.app`)
1. העלה את התיקייה ל־GitHub (בלי `node_modules`, `.next`, `.env.local` – הם ב־`.gitignore`).
2. ב־https://vercel.com → **Add New Project** → בחר את הריפו.
3. **Environment Variables** – הוסף את כל המשתנים מ־`.env.example` (עם הערכים האמיתיים). `NEXT_PUBLIC_SITE_URL` = הכתובת שוורסל ייתן (אפשר לעדכן אחרי הפריסה הראשונה ולעשות Redeploy).
4. Deploy. אחרי הפריסה – עדכן ב־Supabase את Site URL ו־Redirect URLs לכתובת החדשה.

### 5. אופציונלי – התראה במייל על פנייה חדשה
הגדר `RESEND_API_KEY` ו־`LEAD_NOTIFY_EMAIL`. ללא הגדרה – הפניות נשמרות ב־`/admin/leads` בלבד.

## מבנה התיקיות
```
supabase/schema.sql          סכמת DB + RLS + seed
src/middleware.ts            רענון session + חסימת /account ו-/admin לפני התחברות
src/lib/
  supabase/{server,admin,client}.ts   לקוחות Supabase (service-role בשרת בלבד)
  auth.ts                    getCurrentProfile / requireUser / requireAdmin / זיהוי מנהל לפי טלפון
  content.ts                 כל הטקסטים באתר + טעינת overrides
  data.ts                    שאילתות קריאה
  sanitize.ts                ניקוי HTML של מאמרים (XSS)
  rate-limit.ts              הגבלת קצב לטפסים
src/actions/                 Server Actions: auth, leads, articles, admin (כל אחת בודקת הרשאה)
src/components/
  site/      Header, Footer, MobileNav, LeadDialog, ArticleCard, NoticeBox, CtaBand
  forms/     LeadForm, LoginForm, RegisterForm, ArticleForm, RichEditor, ImageField
  admin/     LeadRow, ArticleQuickActions, UserRow, ContentEditor
  ui/        Button, Field, Container, PageHeader, StatusBadge
src/app/
  (site)/    כל העמודים הציבוריים + auth + account (עם Header/Footer)
  admin/     מערכת ניהול (layout נפרד, requireAdmin)
  auth/callback/route.ts    אימות מייל ואיפוס סיסמה
  sitemap.ts, robots.ts
```

## אבטחה – מה מיושם
- Supabase Auth (סיסמאות מוצפנות, cookies httpOnly) – הטלפון של המנהל נמצא רק ב־env בשרת.
- כל Server Action בודקת הרשאה (`assertUser` / `assertAdmin`) לפני כל פעולה; קריאות ל־DB בשרת בלבד.
- RLS דלוק על כל הטבלאות; ה־anon key יכול לקרוא רק מאמרים מפורסמים, קטגוריות וטקסטים.
- HTML של מאמרים עובר `sanitize-html` לפני שמירה (מניעת XSS). שאילתות דרך supabase-js (פרמטריות).
- Rate limiting + honeypot בטופס הלידים, בהרשמה ובהתחברות. Validation עם zod בשרת.
- Headers: X-Frame-Options, nosniff, Referrer-Policy. HTTPS מובנה ב־Vercel.
- העלאת תמונות: JPG/PNG/WebP עד 4MB בלבד, למשתמשים מחוברים.

## נגישות – מה מיושם
דילוג לתוכן, ניווט מקלדת מלא עם focus גלוי, labels לכל שדה, alt לתמונות, היררכיית כותרות, ARIA רק במקומות הנדרשים (תפריט, דיאלוג, טאבים), סגירת דיאלוג ב־Escape, ניגודיות גבוהה, `prefers-reduced-motion`, הצהרת נגישות ב־`/accessibility`. לפני השקה מומלץ להריץ Lighthouse / axe בדפדפן.

## הרחבות עתידיות (מחוץ ל־MVP)
Rate limiting מבוסס Redis (Upstash), שאלות נפוצות כתוכן דינמי, חיפוש במאמרים, דומיין מותאם.
