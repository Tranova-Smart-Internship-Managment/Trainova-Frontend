<<<<<<< HEAD
# Tranvia – منصة التدريب الميداني
=======
# Trainova – منصة التدريب الميداني
>>>>>>> c43fa1b97788e66ffa2efdea1446c4ed68760f61

مشروع React + Vite + Tailwind CSS لمنصة Tranvia.

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح المتصفح على الرابط الذي يظهر (عادة http://localhost:5173).

## البنية

```
tranvia-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # نقطة الدخول
    ├── App.jsx           # شريط التنقل بين الصفحات
    ├── index.css          # Tailwind
    └── pages/
        ├── Dashboard.jsx   # لوحة التحكم (4 أدوار: طالب، جهة تدريب، مشرف، إدارة)
        └── Register.jsx    # نموذج تسجيل حساب طالب (US-001)
```




