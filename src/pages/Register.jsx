import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

// University email domains - Gaza universities
const UNI_DOMAINS = ["alazhar.edu.ps", "iugaza.edu.ps"];
const TAKEN_SIDS = ["20200001", "20219999"];
const TAKEN_EMAILS = ["taken@alazhar.edu.ps"];

const MAJORS = [
  "علوم الحاسوب",
  "هندسة البرمجيات",
  "نظم المعلومات",
  "الشبكات والاتصالات",
  "الذكاء الاصطناعي",
  "الطب البشري",
  "الصيدلة",
  "المحاسبة",
  "إدارة الأعمال",
];

function Toast({ toast, onClose }) {
  const isOk = toast.type === "ok";
  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-md border text-xs transition-all duration-300 ${
        isOk ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
      } ${toast.show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}`}
    >
      <span className="text-base mt-0.5 flex-shrink-0">{isOk ? "✓" : "⚠️"}</span>
      <div>
        <div className="font-medium mb-0.5">{toast.title}</div>
        <div className="text-[11px] opacity-85">{toast.msg}</div>
      </div>
      <button onClick={() => onClose(toast.id)} className="mr-auto opacity-60 hover:opacity-100 text-sm">
        ✕
      </button>
    </div>
  );
}

function StrengthBar({ pw, t }) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const colors = ["#E24B4A", "#E24B4A", "#BA7517", "#3B6D11"];
  const hintKeys = ["", "strengthVeryWeak", "strengthMedium", "strengthStrong", "strengthVeryStrong"];
  const hintColor = score >= 3 ? "#3B6D11" : score === 2 ? "#BA7517" : "#E24B4A";

  return (
    <div className="mt-1">
      <div className="flex gap-1 h-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="flex-1 h-[3px] rounded"
            style={{ background: i < score ? colors[Math.min(score - 1, 3)] : "#E5E7EB" }}
          />
        ))}
      </div>
      <div className="text-[10px] mt-0.5" style={{ color: pw.length ? hintColor : "#9CA3AF" }}>
        {pw.length ? t(hintKeys[score]) : t("strengthEmpty")}
      </div>
    </div>
  );
}

export default function StudentRegisterForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [values, setValues] = useState({
    sid: "",
    fname: "",
    email: "",
    pw: "",
    pw2: "",
    major: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [oks, setOks] = useState({});
  const [terms, setTerms] = useState(false);
  const [termsErr, setTermsErr] = useState(false);
  const [showPw, setShowPw] = useState({ pw: false, pw2: false });
  const [toasts, setToasts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const FIELD_LABEL_KEYS = {
    sid: "labelStudentId",
    fname: "labelFullName",
    email: "labelEmail",
    major: "labelMajor",
    pw: "labelPassword",
    pw2: "labelConfirmPassword",
  };

  const setVal = (field, v) => {
    setValues((s) => ({ ...s, [field]: v }));
    setErrors((s) => ({ ...s, [field]: undefined }));
    setOks((s) => ({ ...s, [field]: undefined }));
  };

  const pushToast = (type, title, msg, dur = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, type, title, msg, show: false }]);
    setTimeout(() => {
      setToasts((ts) => ts.map((x) => (x.id === id ? { ...x, show: true } : x)));
    }, 20);
    if (dur > 0) {
      setTimeout(() => removeToast(id), dur);
    }
  };

  const removeToast = (id) => {
    setToasts((ts) => ts.map((x) => (x.id === id ? { ...x, show: false } : x)));
    setTimeout(() => {
      setToasts((ts) => ts.filter((x) => x.id !== id));
    }, 260);
  };

  const validateField = (field) => {
    const v = (values[field] || "").trim();
    let errKey, okKey;

    switch (field) {
      case "sid":
        if (!v) errKey = "errSidRequired";
        else if (!/^\d{7,10}$/.test(v)) errKey = "errSidFormat";
        else if (TAKEN_SIDS.includes(v)) errKey = "errSidTaken";
        else okKey = "okSid";
        break;
      case "fname":
        if (!v) errKey = "errNameRequired";
        else if (v.length < 4) errKey = "errNameShort";
        break;
      case "email":
        if (!v) errKey = "errEmailRequired";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errKey = "errEmailInvalid";
        else {
          const domain = v.split("@")[1];
          if (!UNI_DOMAINS.includes(domain)) errKey = "errEmailDomain";
          else if (TAKEN_EMAILS.includes(v)) errKey = "errEmailTaken";
          else okKey = "okEmail";
        }
        break;
      case "major":
        if (!v) errKey = "errMajorRequired";
        break;
      case "pw": {
        const pw = values.pw;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (!pw) errKey = "errPwRequired";
        else if (score < 3) errKey = "errPwWeak";
        break;
      }
      case "pw2":
        if (!values.pw2) errKey = "errPw2Required";
        else if (values.pw !== values.pw2) errKey = "errPw2Mismatch";
        else okKey = "okPw2";
        break;
      case "phone":
        if (v && !/^[\d+\-\s]{7,15}$/.test(v)) errKey = "errPhoneFormat";
        break;
      default:
        break;
    }

    setErrors((s) => ({ ...s, [field]: errKey }));
    setOks((s) => ({ ...s, [field]: okKey }));
    return !errKey;
  };

  const handleSubmit = () => {
    const fields = ["sid", "fname", "email", "major", "pw", "pw2", "phone"];
    const results = fields.map((f) => validateField(f));
    const termsOk = terms;
    setTermsErr(!termsOk);

    const failed = [];
    fields.forEach((f, i) => {
      if (!results[i] && f !== "phone") failed.push(t(FIELD_LABEL_KEYS[f]));
    });
    if (!termsOk) failed.push(t("termsOfService"));

    if (failed.length > 0) {
      pushToast("err", t("toastSubmitErrTitle"), t("toastSubmitErrMsg") + " " + failed.join("، "));
      return;
    }

    setSubmitting(true);
    pushToast("ok", t("toastSubmittingTitle"), t("toastSubmittingMsg"), 2000);
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
      pushToast("ok", t("toastSuccessTitle"), t("toastSuccessMsg"));
    }, 2000);
  };

  const autoFill = () => {
    setValues({
      sid: "20230965",
      fname: "لمى محمود الخوالدة",
      email: "lama@alazhar.edu.ps",
      pw: "Test@1234",
      pw2: "Test@1234",
      major: "علوم الحاسوب",
      phone: "+970592345678",
    });
    setTerms(true);
    setTermsErr(false);
    setTimeout(() => {
      ["sid", "fname", "email", "major", "pw", "pw2", "phone"].forEach((f) => validateField(f));
    }, 0);
    pushToast("ok", t("toastAutofillTitle"), t("toastAutofillMsg"));
  };

  const resetForm = () => {
    setValues({ sid: "", fname: "", email: "", pw: "", pw2: "", major: "", phone: "" });
    setErrors({});
    setOks({});
    setTerms(false);
    setTermsErr(false);
    setStep(1);
    setToasts([]);
  };

  const inputClass = (field) =>
    `w-full px-2.5 py-2 border rounded-md text-sm bg-white text-gray-900 outline-none transition-colors focus:border-orange-500 ${
      errors[field] ? "border-red-400" : oks[field] ? "border-green-600" : "border-gray-300"
    }`;

  const Field = ({ labelKey, required, optional, children, field }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">
        {t(labelKey)} {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-gray-400 text-[10px]">{t("optional")}</span>}
      </label>
      {children}
      {errors[field] && (
        <div className="text-[11px] text-red-600 flex items-center gap-1">⚠️ {t(errors[field])}</div>
      )}
      {oks[field] && !errors[field] && (
        <div className="text-[11px] text-green-700 flex items-center gap-1">✓ {t(oks[field])}</div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg font-sans relative" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Toasts */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 max-w-[280px]">
        {toasts.map((tst) => (
          <Toast key={tst.id} toast={tst} onClose={removeToast} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ background: "#1E3A5F" }}>
          <div>
            <div className="text-lg font-medium text-white tracking-wide">{t("brandName")}</div>
            <div className="text-xs text-white/55 mt-0.5">{t("brandTagline")}</div>
          </div>
          <div className="text-left">
            <div className="text-sm text-white/85">{t("regTitle")}</div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex border-b border-gray-200">
          {[
            { n: 1, icon: "👤", labelKey: "stepPersonal" },
            { n: 2, icon: "🔒", labelKey: "stepPassword" },
            { n: 3, icon: "📧", labelKey: "stepActivation" },
          ].map((s) => {
            const isDone = step === 2 && s.n < 3;
            const isActive = (step === 1 && s.n === 1) || (step === 2 && s.n === 3);
            return (
              <div
                key={s.n}
                className={`flex-1 text-center py-2.5 text-xs border-b-2 ${
                  isDone
                    ? "text-green-700 border-green-700 font-medium"
                    : isActive
                    ? "text-orange-500 border-orange-500 font-medium"
                    : "text-gray-400 border-transparent"
                }`}
              >
                <div className="text-sm mb-0.5">{s.icon}</div>
                {t(s.labelKey)}
              </div>
            );
          })}
        </div>

        {step === 1 ? (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <Field labelKey="labelStudentId" required field="sid">
                <input
                  type="text"
                  placeholder={t("placeholderStudentId")}
                  value={values.sid}
                  onChange={(e) => setVal("sid", e.target.value)}
                  onBlur={() => validateField("sid")}
                  className={inputClass("sid")}
                />
              </Field>
              <Field labelKey="labelFullName" required field="fname">
                <input
                  type="text"
                  placeholder={t("placeholderFullName")}
                  value={values.fname}
                  onChange={(e) => setVal("fname", e.target.value)}
                  onBlur={() => validateField("fname")}
                  className={inputClass("fname")}
                />
              </Field>
            </div>

            <div className="mb-3.5">
              <Field labelKey="labelEmail" required field="email">
                <input
                  type="email"
                  placeholder={t("placeholderEmail")}
                  value={values.email}
                  onChange={(e) => setVal("email", e.target.value)}
                  onBlur={() => validateField("email")}
                  className={inputClass("email")}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <Field labelKey="labelPassword" required field="pw">
                <div className="relative">
                  <input
                    type={showPw.pw ? "text" : "password"}
                    placeholder={t("placeholderPassword")}
                    value={values.pw}
                    onChange={(e) => setVal("pw", e.target.value)}
                    onBlur={() => validateField("pw")}
                    className={inputClass("pw") + " pr-9"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => ({ ...s, pw: !s.pw }))}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                  >
                    👁
                  </button>
                </div>
                <StrengthBar pw={values.pw} t={t} />
              </Field>
              <Field labelKey="labelConfirmPassword" required field="pw2">
                <div className="relative">
                  <input
                    type={showPw.pw2 ? "text" : "password"}
                    placeholder={t("placeholderConfirmPassword")}
                    value={values.pw2}
                    onChange={(e) => setVal("pw2", e.target.value)}
                    onBlur={() => validateField("pw2")}
                    className={inputClass("pw2") + " pr-9"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => ({ ...s, pw2: !s.pw2 }))}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                  >
                    👁
                  </button>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-4">
              <Field labelKey="labelMajor" required field="major">
                <select
                  value={values.major}
                  onChange={(e) => {
                    setVal("major", e.target.value);
                    setTimeout(() => validateField("major"), 0);
                  }}
                  className={inputClass("major")}
                >
                  <option value="">{t("selectMajor")}</option>
                  {MAJORS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field labelKey="labelPhone" optional field="phone">
                <input
                  type="tel"
                  placeholder={t("placeholderPhone")}
                  value={values.phone}
                  onChange={(e) => setVal("phone", e.target.value)}
                  onBlur={() => validateField("phone")}
                  className={inputClass("phone")}
                />
              </Field>
            </div>

            <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  setTermsErr(false);
                }}
                className="mt-0.5 flex-shrink-0"
              />
              <div className="text-xs text-gray-600 leading-relaxed">
                {t("termsText")} <a href="#" className="text-orange-500 no-underline">{t("termsOfService")}</a> {t("termsAnd")}{" "}
                <a href="#" className="text-orange-500 no-underline">{t("privacyPolicy")}</a> {t("termsSuffix")} {t("brandName")}
                {termsErr && (
                  <div className="text-red-500 text-[11px] mt-1">⚠️ {t("errTerms")}</div>
                )}
              </div>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button onClick={autoFill} className="border border-gray-300 text-gray-600 px-3.5 py-2 rounded-md text-xs flex items-center gap-1.5">
                ✨ {t("autofill")}
              </button>
              <button onClick={resetForm} className="border border-gray-300 text-gray-600 px-4.5 py-2 rounded-md text-sm">
                {t("cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-orange-500 text-white px-5.5 py-2 rounded-md text-sm flex items-center gap-1.5 disabled:opacity-60"
              >
                👤+ {t("createAccount")}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-13 h-13 bg-green-50 rounded-full flex items-center justify-center text-2xl text-green-700 mx-auto mb-4">
              📧✓
            </div>
            <div className="text-base font-medium text-gray-900 mb-2">{t("successTitle")}</div>
            <div className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto mb-5">
              {t("successSubPrefix")} {values.email}. {t("successSubSuffix")}
            </div>
            <div className="bg-green-50 text-green-800 rounded-md px-4 py-2.5 text-xs inline-block mb-5">
              ⏱ {t("activationValid")}
            </div>
            <div>
              <button onClick={resetForm} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm">
                {t("registerAnother")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
