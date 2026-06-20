import React, { useState, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const UNI_DOMAINS     = ["alazhar.edu.ps", "iugaza.edu.ps"];
const GMAIL_DOMAINS   = ["gmail.com","yahoo.com","hotmail.com","outlook.com"];
const TAKEN_SIDS      = ["20200001","20219999"];
const TAKEN_EMAILS    = ["taken@alazhar.edu.ps"];
const TAKEN_ORG_NAMES = ["شركة التقنية","Tech Corp"];
const TAKEN_EMP_IDS   = ["EMP-2024-001"];
const VALID_ADMIN_CODES = ["TRAINOVA-ADMIN-2024"];

const STUDENT_MAJORS = [
  "علوم الحاسوب","هندسة البرمجيات","نظم المعلومات",
  "الشبكات والاتصالات","الذكاء الاصطناعي","الطب البشري",
  "الصيدلة","المحاسبة","إدارة الأعمال",
];
const DEPARTMENTS = [
  "كلية الهندسة وتكنولوجيا المعلومات","كلية العلوم","كلية الطب",
  "كلية إدارة الأعمال","كلية الصيدلة","كلية الآداب",
];
const RANKS = ["مدرس", "أستاذ مساعد", "أستاذ مشارك", "أستاذ"];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  const colors = {
    ok:   "bg-green-50 border-green-200 text-green-800",
    err:  "bg-red-50 border-red-200 text-red-800",
    warn: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return (
    <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-md border text-xs transition-all duration-300 ${colors[toast.type]} ${toast.show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}`}>
      <span className="text-base mt-0.5 flex-shrink-0">{toast.type==="ok"?"✓":toast.type==="warn"?"⚠️":"✕"}</span>
      <div>
        <div className="font-medium mb-0.5">{toast.title}</div>
        <div className="text-[11px] opacity-85">{toast.msg}</div>
      </div>
      <button onClick={()=>onClose(toast.id)} className="mr-auto opacity-60 hover:opacity-100 text-sm">✕</button>
    </div>
  );
}

function StrengthBar({ pw, t }) {
  let score = 0;
  if (pw.length>=8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const colors   = ["#E24B4A","#E24B4A","#BA7517","#3B6D11"];
  const hintKeys = ["","strengthVeryWeak","strengthMedium","strengthStrong","strengthVeryStrong"];
  const hintColor= score>=3?"#3B6D11":score===2?"#BA7517":"#E24B4A";
  return (
    <div className="mt-1">
      <div className="flex gap-1 h-[3px]">
        {[0,1,2,3].map(i=>(
          <span key={i} className="flex-1 h-[3px] rounded" style={{ background: i<score ? colors[Math.min(score-1,3)] : "#E5E7EB" }} />
        ))}
      </div>
      <div className="text-[10px] mt-0.5" style={{ color: pw.length ? hintColor : "#9CA3AF" }}>
        {pw.length ? t(hintKeys[score]) : t("strengthEmpty")}
      </div>
    </div>
  );
}

function Field({ label, required, optional, errMsg, okMsg, warnMsg, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-500 mr-0.5">*</span>}
        {optional && <span className="text-gray-400 text-[10px] mr-1"></span>}
      </label>
      {children}
      {errMsg  && <div className="text-[11px] text-red-600 flex items-center gap-1">⚠️ {errMsg}</div>}
      {!errMsg && okMsg   && <div className="text-[11px] text-green-700 flex items-center gap-1">✓ {okMsg}</div>}
      {!errMsg && warnMsg && <div className="text-[11px] text-amber-600 flex items-center gap-1">⚠️ {warnMsg}</div>}
    </div>
  );
}

function StepsBar({ steps }) {
  return (
    <div className="flex border-b border-gray-200 mt-3">
      {steps.map((s,i) => (
        <div key={i} className={`flex-1 text-center pb-2.5 text-xs border-b-2 -mb-px ${i===0 ? "text-orange-500 border-orange-500 font-medium" : "text-gray-400 border-transparent"}`}>
          <div className="text-sm mb-0.5">{s.icon}</div>
          {s.label}
        </div>
      ))}
    </div>
  );
}

function SuccessView({ email, onReset, t, reviewNote }) {
  return (
    <div className="p-8 text-center">
      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-2xl text-green-700 mx-auto mb-4">📧✓</div>
      <div className="text-base font-medium text-gray-900 mb-2">{t("successTitle")}</div>
      <div className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-4">
        {t("successSubPrefix")} <span className="font-medium text-gray-700">{email}</span>. {t("successSubSuffix")}
      </div>
      {reviewNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-xs text-amber-800 max-w-sm mx-auto mb-4">
          ⏳ {reviewNote}
        </div>
      )}
      <div className="bg-green-50 text-green-800 rounded-md px-4 py-2.5 text-xs inline-block mb-5">
        ⏱ {t("activationValid")}
      </div>
      <div>
        <button onClick={onReset} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm">
          {t("registerAnother")}
        </button>
      </div>
    </div>
  );
}

// ═══ STUDENT FORM ═════════════════════════════════════════════════════════════
function StudentForm({ t, pushToast }) {
  const fieldOrder = ["sid","fname","email","pw","pw2","major","phone"];
  const refs = Object.fromEntries(fieldOrder.map(k => [k, useRef(null)]));

  const [values, setValues] = useState({ sid:"",fname:"",email:"",pw:"",pw2:"",major:"",phone:"" });
  const [errors, setErrors] = useState({});
  const [oks,    setOks]    = useState({});
  const [terms,  setTerms]  = useState(false);
  const [termsErr, setTermsErr] = useState(false);
  const [showPw, setShowPw] = useState({ pw:false, pw2:false });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setVal = (f,v) => setValues(s=>({...s,[f]:v}));
  const focusNext = cur => { const i=fieldOrder.indexOf(cur); const n=fieldOrder[i+1]; if(n&&refs[n]?.current) refs[n].current.focus(); };
  const onKey = (e,f) => { if(e.key==="Enter"){ e.preventDefault(); focusNext(f); } };

  const validate = f => {
    const v=(values[f]||"").trim();
    let err, ok;
    if (f==="sid") {
      if (!v) err=t("errSidRequired");
      else if (!/^\d{7,10}$/.test(v)) err=t("errSidFormat");
      else if (TAKEN_SIDS.includes(v)) err=t("errSidTaken");
      else ok=t("okSid");
    } else if (f==="fname") {
      if (!v) err=t("errNameRequired");
      else if (v.length<4) err=t("errNameShort");
    } else if (f==="email") {
      if (!v) err=t("errEmailRequired");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) err=t("errEmailInvalid");
      else {
        const dom=v.split("@")[1];
        if (!UNI_DOMAINS.includes(dom)) err=t("errEmailDomain");
        else if (TAKEN_EMAILS.includes(v)) err=t("errEmailTaken");
        else ok=t("okEmail");
      }
    } else if (f==="major") {
      if (!v) err=t("errMajorRequired");
    } else if (f==="pw") {
      let sc=0; const pw=values.pw;
      if(pw.length>=8)sc++; if(/[A-Z]/.test(pw))sc++; if(/[0-9]/.test(pw))sc++; if(/[^A-Za-z0-9]/.test(pw))sc++;
      if (!pw) err=t("errPwRequired"); else if (sc<3) err=t("errPwWeak");
    } else if (f==="pw2") {
      if (!values.pw2) err=t("errPw2Required");
      else if (values.pw!==values.pw2) err=t("errPw2Mismatch");
      else ok=t("okPw2");
    } else if (f==="phone") {
      if (v && !/^[\d+\-\s]{7,15}$/.test(v)) err=t("errPhoneFormat");
    }
    setErrors(s=>({...s,[f]:err})); setOks(s=>({...s,[f]:ok}));
    return !err;
  };

  const submit = () => {
    const res = ["sid","fname","email","major","pw","pw2","phone"].map(f=>validate(f));
    if (!terms) { setTermsErr(true); pushToast("err",t("toastSubmitErrTitle"),t("errTerms")); return; }
    setTermsErr(false);
    if (!res.every(Boolean)) { pushToast("err",t("toastSubmitErrTitle"),t("toastSubmitErrMsg")); return; }
    setSubmitting(true);
    pushToast("ok",t("toastSubmittingTitle"),t("toastSubmittingMsg"),2000);
    setTimeout(()=>{ setSubmitting(false); setDone(true); pushToast("ok",t("toastSuccessTitle"),t("toastSuccessMsg")); },2000);
  };

  const autoFill = () => {
    setValues({ sid:"20230965",fname:"لمى محمود الخوالدة",email:"lama@alazhar.edu.ps",pw:"Test@1234",pw2:"Test@1234",major:"علوم الحاسوب",phone:"+970592345678" });
    setTerms(true); setTermsErr(false);
    pushToast("ok",t("toastAutofillTitle"),t("toastAutofillMsg"));
  };

  const reset = () => {
    setValues({ sid:"",fname:"",email:"",pw:"",pw2:"",major:"",phone:"" });
    setErrors({}); setOks({}); setTerms(false); setTermsErr(false); setDone(false); setSubmitting(false);
  };

  const cls = f => `w-full px-2.5 py-2 border rounded-md text-sm bg-white text-gray-900 outline-none transition-colors focus:border-orange-500 ${errors[f]?"border-red-400":oks[f]?"border-green-600":"border-gray-300"}`;

  if (done) return <SuccessView email={values.email} onReset={reset} t={t} />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelStudentId")} required errMsg={errors.sid} okMsg={oks.sid}>
          <input ref={refs.sid} type="text" placeholder={t("placeholderStudentId")} value={values.sid}
            onChange={e=>setVal("sid",e.target.value)} onBlur={()=>validate("sid")} onKeyDown={e=>onKey(e,"sid")} className={cls("sid")} />
        </Field>
        <Field label={t("labelFullName")} required errMsg={errors.fname}>
          <input ref={refs.fname} type="text" placeholder={t("placeholderFullName")} value={values.fname}
            onChange={e=>setVal("fname",e.target.value)} onBlur={()=>validate("fname")} onKeyDown={e=>onKey(e,"fname")} className={cls("fname")} />
        </Field>
      </div>
      <div className="mb-3.5">
        <Field label={t("labelEmail")} required errMsg={errors.email} okMsg={oks.email}>
          <input ref={refs.email} type="email" placeholder={t("placeholderEmail")} value={values.email}
            onChange={e=>setVal("email",e.target.value)} onBlur={()=>validate("email")} onKeyDown={e=>onKey(e,"email")} className={cls("email")} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelPassword")} required errMsg={errors.pw}>
          <div className="relative">
            <input ref={refs.pw} type={showPw.pw?"text":"password"} placeholder={t("placeholderPassword")} value={values.pw}
              onChange={e=>setVal("pw",e.target.value)} onBlur={()=>validate("pw")} onKeyDown={e=>onKey(e,"pw")} className={cls("pw")+" pr-9"} />
            <button type="button" onClick={()=>setShowPw(s=>({...s,pw:!s.pw}))} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👁</button>
          </div>
          <StrengthBar pw={values.pw} t={t} />
        </Field>
        <Field label={t("labelConfirmPassword")} required errMsg={errors.pw2} okMsg={oks.pw2}>
          <div className="relative">
            <input ref={refs.pw2} type={showPw.pw2?"text":"password"} placeholder={t("placeholderConfirmPassword")} value={values.pw2}
              onChange={e=>setVal("pw2",e.target.value)} onBlur={()=>validate("pw2")} onKeyDown={e=>onKey(e,"pw2")} className={cls("pw2")+" pr-9"} />
            <button type="button" onClick={()=>setShowPw(s=>({...s,pw2:!s.pw2}))} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👁</button>
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Field label={t("labelMajor")} required errMsg={errors.major}>
          <select ref={refs.major} value={values.major}
            onChange={e=>{ setVal("major",e.target.value); setTimeout(()=>validate("major"),0); }}
            onKeyDown={e=>onKey(e,"major")} className={cls("major")}>
            <option value="">{t("selectMajor")}</option>
            {STUDENT_MAJORS.map(m=><option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label={t("labelPhone")} errMsg={errors.phone}>
          <input ref={refs.phone} type="tel" placeholder={t("placeholderPhone")} value={values.phone}
            onChange={e=>setVal("phone",e.target.value)} onBlur={()=>validate("phone")}
            onKeyDown={e=>e.key==="Enter"&&submit()} className={cls("phone")} />
        </Field>
      </div>
      <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <input type="checkbox" checked={terms} onChange={e=>{setTerms(e.target.checked);setTermsErr(false);}} className="mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-600 leading-relaxed">
          {t("termsText")} <a href="#" className="text-orange-500">{t("termsOfService")}</a> {t("termsAnd")} <a href="#" className="text-orange-500">{t("privacyPolicy")}</a> {t("termsSuffix")} {t("brandName")}
          {termsErr && <div className="text-red-500 text-[11px] mt-1">⚠️ {t("errTerms")}</div>}
        </div>
      </div>
      <div className="flex gap-2.5 justify-end">
        <button onClick={autoFill} className="border border-gray-300 text-gray-600 px-3.5 py-2 rounded-md text-xs">✨ {t("autofill")}</button>
        <button onClick={reset} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm">{t("cancel")}</button>
        <button onClick={submit} disabled={submitting} className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm disabled:opacity-60">
          {submitting?"⏳ ...":"👤+ "+t("createAccount")}
        </button>
      </div>
    </div>
  );
}

// ═══ PROVIDER FORM ════════════════════════════════════════════════════════════
function ProviderForm({ t, pushToast }) {
  const fieldOrder = ["orgName","email","phone","city","country","description"];
  const refs = Object.fromEntries(fieldOrder.map(k=>[k,useRef(null)]));

  const [values, setValues] = useState({ orgName:"",email:"",phone:"",city:"",country:"",description:"" });
  const [errors, setErrors] = useState({});
  const [oks,    setOks]    = useState({});
  const [warns,  setWarns]  = useState({});
  const [terms,  setTerms]  = useState(false);
  const [termsErr, setTermsErr] = useState(false);
  const [gmailConfirmed, setGmailConfirmed] = useState(false);
  const [gmailBanner, setGmailBanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setVal = (f,v) => setValues(s=>({...s,[f]:v}));
  const focusNext = cur => { const i=fieldOrder.indexOf(cur); const n=fieldOrder[i+1]; if(n&&refs[n]?.current) refs[n].current.focus(); };
  const onKey = (e,f) => { if(e.key==="Enter"){ e.preventDefault(); focusNext(f); } };

  const validate = f => {
    const v=(values[f]||"").trim();
    let err, ok, warn;
    if (f==="orgName") {
      if (!v) err=t("errOrgNameRequired");
      else if (v.length<3) err=t("errOrgNameShort");
      else if (TAKEN_ORG_NAMES.includes(v)) err=t("errOrgNameTaken");
      else ok=t("okOrgName");
    } else if (f==="email") {
      if (!v) err=t("errProviderEmailRequired");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) err=t("errProviderEmailInvalid");
      else if (TAKEN_EMAILS.includes(v)) err=t("errProviderEmailTaken");
      else {
        const dom=v.split("@")[1];
        if (GMAIL_DOMAINS.includes(dom)&&!gmailConfirmed) warn=t("warnGmailEmail");
        else ok=t("okProviderEmail");
      }
    } else if (f==="phone") {
      if (!v) err=t("errProviderPhoneRequired");
      else if (!/^[\d+\-\s]{7,15}$/.test(v)) err=t("errProviderPhoneFormat");
      else ok=t("okProviderPhone");
    } else if (f==="city") {
      if (!v) err=t("errCityRequired");
    } else if (f==="country") {
      if (!v) err=t("errCountryRequired");
    } else if (f==="description") {
      if (v.length>2000) err=t("errDescTooLong");
    }
    setErrors(s=>({...s,[f]:err})); setOks(s=>({...s,[f]:ok})); setWarns(s=>({...s,[f]:warn}));
    return !err;
  };

  const handleEmailBlur = () => {
    const v=(values.email||"").trim();
    if (!v) { validate("email"); return; }
    const dom=v.split("@")[1];
    if (GMAIL_DOMAINS.includes(dom)&&!gmailConfirmed) {
      setGmailBanner(true);
      setErrors(s=>({...s,email:undefined}));
      setWarns(s=>({...s,email:t("warnGmailEmail")}));
    } else validate("email");
  };

  const confirmGmail = () => {
    setGmailConfirmed(true); setGmailBanner(false);
    setWarns(s=>({...s,email:undefined})); setOks(s=>({...s,email:t("okProviderEmail")}));
  };

  const submit = () => {
    const res = fieldOrder.map(f=>validate(f));
    if (!terms) { setTermsErr(true); pushToast("err",t("toastProviderSubmittingTitle"),t("errTerms")); return; }
    setTermsErr(false);
    if (!res.every(Boolean) || gmailBanner) {
      if (gmailBanner) pushToast("warn",t("gmailWarnTitle"),t("gmailWarnBody"));
      else pushToast("err",t("toastSubmitErrTitle"),t("toastSubmitErrMsg"));
      return;
    }
    setSubmitting(true);
    pushToast("ok",t("toastProviderSubmittingTitle"),t("toastProviderSubmittingMsg"),2500);
    setTimeout(()=>{ setSubmitting(false); setDone(true); pushToast("ok",t("toastProviderSuccessTitle"),t("toastProviderSuccessMsg")); },2500);
  };

  const autoFill = () => {
    setValues({ orgName:"شركة البرمجيات الحديثة",email:"info@modern-soft.ps",phone:"+970598765432",city:"غزة",country:"فلسطين",description:"شركة متخصصة في تطوير البرمجيات وتقديم حلول تقنية مبتكرة." });
    setTerms(true); setTermsErr(false); setGmailConfirmed(false); setGmailBanner(false);
    pushToast("ok",t("toastAutofillTitle"),t("toastAutofillMsg"));
  };

  const reset = () => {
    setValues({ orgName:"",email:"",phone:"",city:"",country:"",description:"" });
    setErrors({}); setOks({}); setWarns({}); setTerms(false); setTermsErr(false);
    setGmailConfirmed(false); setGmailBanner(false); setDone(false); setSubmitting(false);
  };

  const cls = f => `w-full px-2.5 py-2 border rounded-md text-sm bg-white text-gray-900 outline-none transition-colors focus:border-orange-500 ${errors[f]?"border-red-400":oks[f]?"border-green-600":warns[f]?"border-amber-400":"border-gray-300"}`;
  const descLen = (values.description||"").length;

  if (done) return <SuccessView email={values.email} onReset={reset} t={t} reviewNote={t("providerAdminReviewNote")} />;

  return (
    <div className="p-6">
      {gmailBanner && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <div className="text-xs font-medium text-amber-800 mb-1">{t("gmailWarnTitle")}</div>
            <div className="text-xs text-amber-700 mb-2">{t("gmailWarnBody")}</div>
            <div className="flex gap-2">
              <button onClick={confirmGmail} className="text-xs bg-amber-500 text-white px-3 py-1 rounded-md">{t("gmailContinue")}</button>
              <button onClick={()=>{ setGmailBanner(false); refs.email.current?.focus(); }} className="text-xs border border-amber-400 text-amber-700 px-3 py-1 rounded-md">{t("gmailChange")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelOrgName")} required errMsg={errors.orgName} okMsg={oks.orgName}>
          <input ref={refs.orgName} type="text" placeholder={t("placeholderOrgName")} value={values.orgName}
            onChange={e=>setVal("orgName",e.target.value)} onBlur={()=>validate("orgName")} onKeyDown={e=>onKey(e,"orgName")} className={cls("orgName")} />
        </Field>
        <Field label={t("labelEmail")} required errMsg={errors.email} okMsg={oks.email} warnMsg={warns.email}>
          <input ref={refs.email} type="email" placeholder={t("placeholderProviderEmail")} value={values.email}
            onChange={e=>setVal("email",e.target.value)} onBlur={handleEmailBlur} onKeyDown={e=>onKey(e,"email")} className={cls("email")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelPhone")} required errMsg={errors.phone} okMsg={oks.phone}>
          <input ref={refs.phone} type="tel" placeholder={t("placeholderProviderPhone")} value={values.phone}
            onChange={e=>setVal("phone",e.target.value)} onBlur={()=>validate("phone")} onKeyDown={e=>onKey(e,"phone")} className={cls("phone")} />
        </Field>
        <Field label={t("labelCity")} required errMsg={errors.city}>
          <input ref={refs.city} type="text" placeholder={t("placeholderCity")} value={values.city}
            onChange={e=>setVal("city",e.target.value)} onBlur={()=>validate("city")} onKeyDown={e=>onKey(e,"city")} className={cls("city")} />
        </Field>
      </div>

      <div className="mb-3.5">
        <Field label={t("labelCountry")} required errMsg={errors.country}>
          <input ref={refs.country} type="text" placeholder={t("placeholderCountry")} value={values.country}
            onChange={e=>setVal("country",e.target.value)} onBlur={()=>validate("country")} onKeyDown={e=>onKey(e,"country")} className={cls("country")} />
        </Field>
      </div>

      <div className="mb-4">
        <Field label={t("labelDescription")} errMsg={errors.description}>
          <textarea ref={refs.description} rows={3} placeholder={t("placeholderDescription")} value={values.description}
            onChange={e=>setVal("description",e.target.value)} onBlur={()=>validate("description")}
            className={cls("description")+" resize-none"} />
          <div className={`text-[10px] text-left mt-0.5 ${descLen>1800?"text-red-500":"text-gray-400"}`}>{descLen}/2000</div>
        </Field>
      </div>

      <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <input type="checkbox" checked={terms} onChange={e=>{setTerms(e.target.checked);setTermsErr(false);}} className="mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-600 leading-relaxed">
          {t("termsText")} <a href="#" className="text-orange-500">{t("termsOfService")}</a> {t("termsAnd")} <a href="#" className="text-orange-500">{t("privacyPolicy")}</a> {t("termsSuffix")} {t("brandName")}
          {termsErr && <div className="text-red-500 text-[11px] mt-1">⚠️ {t("errTerms")}</div>}
        </div>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button onClick={autoFill} className="border border-gray-300 text-gray-600 px-3.5 py-2 rounded-md text-xs">✨ {t("autofill")}</button>
        <button onClick={reset} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm">{t("cancel")}</button>
        <button onClick={submit} disabled={submitting} className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm disabled:opacity-60">
          {submitting?"⏳ ...":"🏢+ "+t("providerCreateAccount")}
        </button>
      </div>
    </div>
  );
}

// ═══ SUPERVISOR FORM ══════════════════════════════════════════════════════════
function SupervisorForm({ t, pushToast }) {
  const fieldOrder = ["fname","email","empId","department","rank","pw","pw2"];
  const refs = Object.fromEntries(fieldOrder.map(k=>[k,useRef(null)]));

  const [values, setValues] = useState({ fname:"",email:"",empId:"",department:"",rank:"",pw:"",pw2:"" });
  const [errors, setErrors] = useState({});
  const [oks,    setOks]    = useState({});
  const [terms,  setTerms]  = useState(false);
  const [termsErr, setTermsErr] = useState(false);
  const [showPw, setShowPw] = useState({ pw:false, pw2:false });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setVal = (f,v) => setValues(s=>({...s,[f]:v}));
  const focusNext = cur => { const i=fieldOrder.indexOf(cur); const n=fieldOrder[i+1]; if(n&&refs[n]?.current) refs[n].current.focus(); };
  const onKey = (e,f) => { if(e.key==="Enter"){ e.preventDefault(); focusNext(f); } };

  const validate = f => {
    const v=(values[f]||"").trim();
    let err, ok;
    if (f==="fname") {
      if (!v) err=t("errNameRequired");
      else if (v.length<4) err=t("errNameShort");
    } else if (f==="email") {
      if (!v) err=t("errEmailRequired");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) err=t("errEmailInvalid");
      else {
        const dom=v.split("@")[1];
        if (!UNI_DOMAINS.includes(dom)) err=t("errSupervisorEmailDomain");
        else if (TAKEN_EMAILS.includes(v)) err=t("errEmailTaken");
        else ok=t("okEmail");
      }
    } else if (f==="empId") {
      if (!v) err=t("errEmployeeIdRequired");
      else if (TAKEN_EMP_IDS.includes(v)) err=t("errEmployeeIdTaken");
      else ok=t("okEmployeeId");
    } else if (f==="department") {
      if (!v) err=t("errDepartmentRequired");
    } else if (f==="rank") {
      if (!v) err=t("errRankRequired");
    } else if (f==="pw") {
      let sc=0; const pw=values.pw;
      if(pw.length>=8)sc++; if(/[A-Z]/.test(pw))sc++; if(/[0-9]/.test(pw))sc++; if(/[^A-Za-z0-9]/.test(pw))sc++;
      if (!pw) err=t("errPwRequired"); else if (sc<3) err=t("errPwWeak");
    } else if (f==="pw2") {
      if (!values.pw2) err=t("errPw2Required");
      else if (values.pw!==values.pw2) err=t("errPw2Mismatch");
      else ok=t("okPw2");
    }
    setErrors(s=>({...s,[f]:err})); setOks(s=>({...s,[f]:ok}));
    return !err;
  };

  const submit = () => {
    const res = fieldOrder.map(f=>validate(f));
    if (!terms) { setTermsErr(true); pushToast("err",t("toastSubmitErrTitle"),t("errTerms")); return; }
    setTermsErr(false);
    if (!res.every(Boolean)) { pushToast("err",t("toastSubmitErrTitle"),t("toastSubmitErrMsg")); return; }
    setSubmitting(true);
    pushToast("ok",t("toastSupervisorSubmittingTitle"),t("toastSubmittingMsg"),2000);
    setTimeout(()=>{ setSubmitting(false); setDone(true); pushToast("ok",t("toastSuccessTitle"),t("toastSupervisorSuccessMsg")); },2000);
  };

  const autoFill = () => {
    setValues({ fname:"د. رامي سليمان", email:"rami.suleiman@alazhar.edu.ps", empId:"EMP-2024-018", department:"كلية الهندسة وتكنولوجيا المعلومات", rank:"أستاذ مشارك", pw:"Super@1234", pw2:"Super@1234" });
    setTerms(true); setTermsErr(false);
    pushToast("ok",t("toastAutofillTitle"),t("toastAutofillMsg"));
  };

  const reset = () => {
    setValues({ fname:"",email:"",empId:"",department:"",rank:"",pw:"",pw2:"" });
    setErrors({}); setOks({}); setTerms(false); setTermsErr(false); setDone(false); setSubmitting(false);
  };

  const cls = f => `w-full px-2.5 py-2 border rounded-md text-sm bg-white text-gray-900 outline-none transition-colors focus:border-orange-500 ${errors[f]?"border-red-400":oks[f]?"border-green-600":"border-gray-300"}`;

  if (done) return <SuccessView email={values.email} onReset={reset} t={t} reviewNote={t("supervisorAdminReviewNote")} />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelSupervisorName")} required errMsg={errors.fname}>
          <input ref={refs.fname} type="text" placeholder={t("placeholderSupervisorName")} value={values.fname}
            onChange={e=>setVal("fname",e.target.value)} onBlur={()=>validate("fname")} onKeyDown={e=>onKey(e,"fname")} className={cls("fname")} />
        </Field>
        <Field label={t("labelEmployeeId")} required errMsg={errors.empId} okMsg={oks.empId}>
          <input ref={refs.empId} type="text" placeholder={t("placeholderEmployeeId")} value={values.empId}
            onChange={e=>setVal("empId",e.target.value)} onBlur={()=>validate("empId")} onKeyDown={e=>onKey(e,"empId")} className={cls("empId")} />
        </Field>
      </div>

      <div className="mb-3.5">
        <Field label={t("labelSupervisorEmail")} required errMsg={errors.email} okMsg={oks.email}>
          <input ref={refs.email} type="email" placeholder={t("placeholderSupervisorEmail")} value={values.email}
            onChange={e=>setVal("email",e.target.value)} onBlur={()=>validate("email")} onKeyDown={e=>onKey(e,"email")} className={cls("email")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelDepartment")} required errMsg={errors.department}>
          <select ref={refs.department} value={values.department}
            onChange={e=>{ setVal("department",e.target.value); setTimeout(()=>validate("department"),0); }}
            onKeyDown={e=>onKey(e,"department")} className={cls("department")}>
            <option value="">{t("selectDepartment")}</option>
            {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label={t("labelAcademicRank")} required errMsg={errors.rank}>
          <select ref={refs.rank} value={values.rank}
            onChange={e=>{ setVal("rank",e.target.value); setTimeout(()=>validate("rank"),0); }}
            onKeyDown={e=>onKey(e,"rank")} className={cls("rank")}>
            <option value="">{t("selectRank")}</option>
            {RANKS.map(r=><option key={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Field label={t("labelPassword")} required errMsg={errors.pw}>
          <div className="relative">
            <input ref={refs.pw} type={showPw.pw?"text":"password"} placeholder={t("placeholderPassword")} value={values.pw}
              onChange={e=>setVal("pw",e.target.value)} onBlur={()=>validate("pw")} onKeyDown={e=>onKey(e,"pw")} className={cls("pw")+" pr-9"} />
            <button type="button" onClick={()=>setShowPw(s=>({...s,pw:!s.pw}))} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👁</button>
          </div>
          <StrengthBar pw={values.pw} t={t} />
        </Field>
        <Field label={t("labelConfirmPassword")} required errMsg={errors.pw2} okMsg={oks.pw2}>
          <div className="relative">
            <input ref={refs.pw2} type={showPw.pw2?"text":"password"} placeholder={t("placeholderConfirmPassword")} value={values.pw2}
              onChange={e=>setVal("pw2",e.target.value)} onBlur={()=>validate("pw2")}
              onKeyDown={e=>e.key==="Enter"&&submit()} className={cls("pw2")+" pr-9"} />
            <button type="button" onClick={()=>setShowPw(s=>({...s,pw2:!s.pw2}))} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👁</button>
          </div>
        </Field>
      </div>

      <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <input type="checkbox" checked={terms} onChange={e=>{setTerms(e.target.checked);setTermsErr(false);}} className="mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-600 leading-relaxed">
          {t("termsText")} <a href="#" className="text-orange-500">{t("termsOfService")}</a> {t("termsAnd")} <a href="#" className="text-orange-500">{t("privacyPolicy")}</a> {t("termsSuffix")} {t("brandName")}
          {termsErr && <div className="text-red-500 text-[11px] mt-1">⚠️ {t("errTerms")}</div>}
        </div>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button onClick={autoFill} className="border border-gray-300 text-gray-600 px-3.5 py-2 rounded-md text-xs">✨ {t("autofill")}</button>
        <button onClick={reset} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm">{t("cancel")}</button>
        <button onClick={submit} disabled={submitting} className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm disabled:opacity-60">
          {submitting?"⏳ ...":"👨‍🏫+ "+t("supervisorCreateAccount")}
        </button>
      </div>
    </div>
  );
}

// ═══ ADMIN FORM ═══════════════════════════════════════════════════════════════
function AdminForm({ t, pushToast }) {
  const fieldOrder = ["fname","email","jobTitle","universityName","adminCode","pw","pw2"];
  const refs = Object.fromEntries(fieldOrder.map(k=>[k,useRef(null)]));

  const [values, setValues] = useState({ fname:"",email:"",jobTitle:"",universityName:"",adminCode:"",pw:"",pw2:"" });
  const [errors, setErrors] = useState({});
  const [oks,    setOks]    = useState({});
  const [terms,  setTerms]  = useState(false);
  const [termsErr, setTermsErr] = useState(false);
  const [showPw, setShowPw] = useState({ pw:false, pw2:false });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setVal = (f,v) => setValues(s=>({...s,[f]:v}));
  const focusNext = cur => { const i=fieldOrder.indexOf(cur); const n=fieldOrder[i+1]; if(n&&refs[n]?.current) refs[n].current.focus(); };
  const onKey = (e,f) => { if(e.key==="Enter"){ e.preventDefault(); focusNext(f); } };

  const validate = f => {
    const v=(values[f]||"").trim();
    let err, ok;
    if (f==="fname") {
      if (!v) err=t("errNameRequired");
      else if (v.length<4) err=t("errNameShort");
    } else if (f==="email") {
      if (!v) err=t("errEmailRequired");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) err=t("errEmailInvalid");
      else if (TAKEN_EMAILS.includes(v)) err=t("errEmailTaken");
      else ok=t("okEmail");
    } else if (f==="jobTitle") {
      if (!v) err=t("errJobTitleRequired");
    } else if (f==="universityName") {
      if (!v) err=t("errUniversityNameRequired");
    } else if (f==="adminCode") {
      if (!v) err=t("errAdminCodeRequired");
      else if (!VALID_ADMIN_CODES.includes(v)) err=t("errAdminCodeInvalid");
      else ok=t("okAdminCode");
    } else if (f==="pw") {
      let sc=0; const pw=values.pw;
      if(pw.length>=8)sc++; if(/[A-Z]/.test(pw))sc++; if(/[0-9]/.test(pw))sc++; if(/[^A-Za-z0-9]/.test(pw))sc++;
      if (!pw) err=t("errPwRequired"); else if (sc<3) err=t("errPwWeak");
    } else if (f==="pw2") {
      if (!values.pw2) err=t("errPw2Required");
      else if (values.pw!==values.pw2) err=t("errPw2Mismatch");
      else ok=t("okPw2");
    }
    setErrors(s=>({...s,[f]:err})); setOks(s=>({...s,[f]:ok}));
    return !err;
  };

  const submit = () => {
    const res = fieldOrder.map(f=>validate(f));
    if (!terms) { setTermsErr(true); pushToast("err",t("toastSubmitErrTitle"),t("errTerms")); return; }
    setTermsErr(false);
    if (!res.every(Boolean)) { pushToast("err",t("toastSubmitErrTitle"),t("toastSubmitErrMsg")); return; }
    setSubmitting(true);
    pushToast("ok",t("toastAdminSubmittingTitle"),t("toastSubmittingMsg"),2000);
    setTimeout(()=>{ setSubmitting(false); setDone(true); pushToast("ok",t("toastSuccessTitle"),t("toastAdminSuccessMsg")); },2000);
  };

  const autoFill = () => {
    setValues({ fname:"سامية النجار", email:"samia.najjar@alazhar.edu.ps", jobTitle:"مديرة شؤون التدريب الميداني", universityName:"جامعة الأزهر - غزة", adminCode:"TRAINOVA-ADMIN-2024", pw:"Admin@1234", pw2:"Admin@1234" });
    setTerms(true); setTermsErr(false);
    pushToast("ok",t("toastAutofillTitle"),t("toastAutofillMsg"));
  };

  const reset = () => {
    setValues({ fname:"",email:"",jobTitle:"",universityName:"",adminCode:"",pw:"",pw2:"" });
    setErrors({}); setOks({}); setTerms(false); setTermsErr(false); setDone(false); setSubmitting(false);
  };

  const cls = f => `w-full px-2.5 py-2 border rounded-md text-sm bg-white text-gray-900 outline-none transition-colors focus:border-orange-500 ${errors[f]?"border-red-400":oks[f]?"border-green-600":"border-gray-300"}`;

  if (done) return <SuccessView email={values.email} onReset={reset} t={t} reviewNote={t("adminReviewNote")} />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelAdminName")} required errMsg={errors.fname}>
          <input ref={refs.fname} type="text" placeholder={t("placeholderAdminName")} value={values.fname}
            onChange={e=>setVal("fname",e.target.value)} onBlur={()=>validate("fname")} onKeyDown={e=>onKey(e,"fname")} className={cls("fname")} />
        </Field>
        <Field label={t("labelJobTitle")} required errMsg={errors.jobTitle}>
          <input ref={refs.jobTitle} type="text" placeholder={t("placeholderJobTitle")} value={values.jobTitle}
            onChange={e=>setVal("jobTitle",e.target.value)} onBlur={()=>validate("jobTitle")} onKeyDown={e=>onKey(e,"jobTitle")} className={cls("jobTitle")} />
        </Field>
      </div>

      <div className="mb-3.5">
        <Field label={t("labelAdminEmail")} required errMsg={errors.email} okMsg={oks.email}>
          <input ref={refs.email} type="email" placeholder={t("placeholderAdminEmail")} value={values.email}
            onChange={e=>setVal("email",e.target.value)} onBlur={()=>validate("email")} onKeyDown={e=>onKey(e,"email")} className={cls("email")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <Field label={t("labelUniversityName")} required errMsg={errors.universityName}>
          <input ref={refs.universityName} type="text" placeholder={t("placeholderUniversityName")} value={values.universityName}
            onChange={e=>setVal("universityName",e.target.value)} onBlur={()=>validate("universityName")} onKeyDown={e=>onKey(e,"universityName")} className={cls("universityName")} />
        </Field>
        <Field label={t("labelAdminCode")} required errMsg={errors.adminCode} okMsg={oks.adminCode}>
          <input ref={refs.adminCode} type="text" placeholder={t("placeholderAdminCode")} value={values.adminCode}
            onChange={e=>setVal("adminCode",e.target.value)} onBlur={()=>validate("adminCode")} onKeyDown={e=>onKey(e,"adminCode")} className={cls("adminCode")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <Field label={t("labelPassword")} required errMsg={errors.pw}>
          <div className="relative">
            <input ref={refs.pw} type={showPw.pw?"text":"password"} placeholder={t("placeholderPassword")} value={values.pw}
              onChange={e=>setVal("pw",e.target.value)} onBlur={()=>validate("pw")} onKeyDown={e=>onKey(e,"pw")} className={cls("pw")+" pr-9"} />
            <button type="button" onClick={()=>setShowPw(s=>({...s,pw:!s.pw}))} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👁</button>
          </div>
          <StrengthBar pw={values.pw} t={t} />
        </Field>
        <Field label={t("labelConfirmPassword")} required errMsg={errors.pw2} okMsg={oks.pw2}>
          <div className="relative">
            <input ref={refs.pw2} type={showPw.pw2?"text":"password"} placeholder={t("placeholderConfirmPassword")} value={values.pw2}
              onChange={e=>setVal("pw2",e.target.value)} onBlur={()=>validate("pw2")}
              onKeyDown={e=>e.key==="Enter"&&submit()} className={cls("pw2")+" pr-9"} />
            <button type="button" onClick={()=>setShowPw(s=>({...s,pw2:!s.pw2}))} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👁</button>
          </div>
        </Field>
      </div>

      <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <input type="checkbox" checked={terms} onChange={e=>{setTerms(e.target.checked);setTermsErr(false);}} className="mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-600 leading-relaxed">
          {t("termsText")} <a href="#" className="text-orange-500">{t("termsOfService")}</a> {t("termsAnd")} <a href="#" className="text-orange-500">{t("privacyPolicy")}</a> {t("termsSuffix")} {t("brandName")}
          {termsErr && <div className="text-red-500 text-[11px] mt-1">⚠️ {t("errTerms")}</div>}
        </div>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button onClick={autoFill} className="border border-gray-300 text-gray-600 px-3.5 py-2 rounded-md text-xs">✨ {t("autofill")}</button>
        <button onClick={reset} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm">{t("cancel")}</button>
        <button onClick={submit} disabled={submitting} className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm disabled:opacity-60">
          {submitting?"⏳ ...":"🎓+ "+t("adminCreateAccount")}
        </button>
      </div>
    </div>
  );
}

// ═══ MAIN REGISTER PAGE ═══════════════════════════════════════════════════════
export default function RegisterPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("student");
  const [toasts, setToasts] = useState([]);

  const pushToast = (type,title,msg,dur=4000) => {
    const id = Date.now()+Math.random();
    setToasts(ts=>[...ts,{id,type,title,msg,show:false}]);
    setTimeout(()=>setToasts(ts=>ts.map(x=>x.id===id?{...x,show:true}:x)),20);
    if(dur>0) setTimeout(()=>removeToast(id),dur);
  };
  const removeToast = id => {
    setToasts(ts=>ts.map(x=>x.id===id?{...x,show:false}:x));
    setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)),260);
  };

  const TABS = [
    { key: "student",    icon: "👨‍🎓", label: t("tabStudent") },
    { key: "provider",   icon: "🏢",   label: t("tabProvider") },
    { key: "supervisor", icon: "👨‍🏫", label: t("tabSupervisor") },
    { key: "admin",      icon: "🎓",   label: t("tabAdmin") },
  ];

  const stepsFor = {
    student:    [{icon:"👤",label:t("stepPersonal")},{icon:"🔒",label:t("stepPassword")},{icon:"📧",label:t("stepActivation")}],
    provider:   [{icon:"🏢",label:t("providerStepInfo")},{icon:"📧",label:t("providerStepVerify")},{icon:"⏳",label:t("providerStepAdminReview")}],
    supervisor: [{icon:"👤",label:t("supervisorStepInfo")},{icon:"🏛️",label:t("supervisorStepAssign")},{icon:"📧",label:t("supervisorStepActivation")}],
    admin:      [{icon:"👤",label:t("adminStepInfo")},{icon:"🔑",label:t("adminStepPermissions")},{icon:"📧",label:t("adminStepActivation")}],
  };

  const titleFor = {
    student: t("regTitle"),
    provider: t("providerRegTitle"),
    supervisor: t("supervisorRegTitle"),
    admin: t("adminRegTitle"),
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg font-sans relative" style={{fontFamily:"Inter, system-ui, sans-serif"}}>
      {/* Toasts */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 max-w-[300px]">
        {toasts.map(tst=><Toast key={tst.id} toast={tst} onClose={removeToast}/>)}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl mx-auto shadow-sm">
        {/* Header — brand only */}
        <div className="px-6 py-5" style={{background:"#1E3A5F"}}>
          <div className="text-lg font-medium text-white tracking-wide">{t("brandName")}</div>
          <div className="text-xs text-white/55 mt-0.5">{t("brandTagline")}</div>
        </div>

        {/* Account type toggle — 4 tabs */}
        <div className="px-6 pt-5 pb-1">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1 flex-wrap">
            {TABS.map(tb => (
              <button key={tb.key} onClick={()=>setTab(tb.key)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${tab===tb.key ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {tb.icon} {tb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Single form title — appears once */}
        <div className="px-6 pt-4">
          <h2 className="text-base font-semibold text-gray-900">{titleFor[tab]}</h2>
        </div>

        {/* Steps */}
        <div className="px-6 mt-3">
          <StepsBar steps={stepsFor[tab]} />
        </div>

        {/* Form */}
        {tab==="student"    && <StudentForm    key="student"    t={t} pushToast={pushToast} />}
        {tab==="provider"   && <ProviderForm   key="provider"   t={t} pushToast={pushToast} />}
        {tab==="supervisor" && <SupervisorForm key="supervisor" t={t} pushToast={pushToast} />}
        {tab==="admin"      && <AdminForm      key="admin"      t={t} pushToast={pushToast} />}
      </div>
    </div>
  );
}
