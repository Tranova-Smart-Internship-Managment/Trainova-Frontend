import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const roleConfig = {
  student: {
    name: "لمى محمود",
    initials: "لم",
    badgeKey: "badgeStudent",
    pageTitleKey: "pageTitleStudent",
    actionKey: "actionStudent",
    navKeys: [
      "navStudentHome",
      "navStudentOpportunities",
      "navStudentApplications",
      "navStudentReports",
      "navStudentCommunication",
      "navStudentEvaluation",
    ],
    icons: ["🏠", "💼", "📄", "📝", "💬", "⭐"],
  },
  provider: {
    name: "شركة التقنية",
    initials: "تق",
    badgeKey: "badgeProvider",
    pageTitleKey: "pageTitleProvider",
    actionKey: "actionProvider",
    navKeys: [
      "navProviderHome",
      "navProviderPost",
      "navProviderApplications",
      "navProviderInterns",
      "navProviderEvaluate",
      "navProviderReports",
    ],
    icons: ["🏠", "➕", "👥", "✅", "📋", "📊"],
  },
  supervisor: {
    name: "د. رامي سليمان",
    initials: "رس",
    badgeKey: "badgeSupervisor",
    pageTitleKey: "pageTitleSupervisor",
    actionKey: "actionSupervisor",
    navKeys: [
      "navSupervisorHome",
      "navSupervisorStudents",
      "navSupervisorReports",
      "navSupervisorCommunication",
      "navSupervisorEvaluations",
    ],
    icons: ["🏠", "👥", "📄", "💬", "🎓"],
  },
  admin: {
    name: "إدارة الجامعة",
    initials: "جع",
    badgeKey: "badgeAdmin",
    pageTitleKey: "pageTitleAdmin",
    actionKey: "actionAdmin",
    navKeys: [
      "navAdminHome",
      "navAdminUsers",
      "navAdminAssign",
      "navAdminProviders",
      "navAdminMonitor",
      "navAdminApprove",
      "navAdminSettings",
    ],
    icons: ["🏠", "👥", "➕", "🏢", "📈", "📄", "⚙️"],
  },
};

function StatCard({ icon, color, label, value, change, changeColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="text-xl" style={{ color }}>{icon}</div>
      </div>
      <div className="text-2xl font-medium text-gray-900">{value}</div>
      <div className="text-xs mt-1" style={{ color: changeColor || "#3B6D11" }}>{change}</div>
    </div>
  );
}

function Badge({ children, tone }) {
  const tones = {
    pending: "bg-amber-50 text-amber-800",
    accepted: "bg-green-50 text-green-800",
    rejected: "bg-red-50 text-red-800",
    open: "bg-blue-50 text-blue-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function ProgressBar({ label, value, color = "#F97316" }) {
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-gray-100 rounded overflow-hidden">
        <div className="h-full rounded" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function StudentContent({ t }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        <StatCard icon="💼" color="#F97316" label={t("statAvailable")} value="24" change={t("statAvailableChange")} />
        <StatCard icon="📄" color="#185FA5" label={t("statMyApplications")} value="3" change={t("statMyApplicationsChange")} changeColor="#BA7517" />
        <StatCard icon="📝" color="#3B6D11" label={t("statReportsSubmitted")} value="6" change={t("statReportsSubmittedChange")} />
        <StatCard icon="⭐" color="#BA7517" label={t("statMyEvaluation")} value="87%" change={t("statMyEvaluationChange")} />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{t("availableOpportunities")}</span>
            <span className="text-xs text-orange-500 cursor-pointer">{t("viewAll")}</span>
          </div>
          {[
            { name: "Microsoft", title: "مطور ويب – React", color: "bg-blue-50 text-blue-800", initials: "MS", badge: "open" },
            { name: "Orange", title: "تحليل بيانات", color: "bg-green-50 text-green-800", initials: "OG" },
            { name: "Zain", title: "صيانة شبكات", color: "bg-amber-50 text-amber-800", initials: "ZA" },
            { name: "PalTech", title: "مطور موبايل", color: "bg-pink-50 text-pink-800", initials: "PS", badge: "open" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium flex-shrink-0 ${it.color}`}>{it.initials}</div>
              <div className="flex-1">
                <div className="text-xs font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">{it.name}</div>
              </div>
              {it.badge ? <Badge tone={it.badge}>{t("open")}</Badge> : (
                <button className="text-xs text-orange-500 border border-orange-500 rounded px-2 py-0.5">{t("apply")}</button>
              )}
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{t("myApplicationStatus")}</span>
            <span className="text-xs text-orange-500 cursor-pointer">{t("details")}</span>
          </div>
          {[
            { title: "مطور ويب – React", co: "Microsoft", tone: "pending", textKey: "pending" },
            { title: "صيانة شبكات", co: "Zain", tone: "accepted", textKey: "accepted" },
            { title: "مصمم UI/UX", co: "WeTask", tone: "rejected", textKey: "rejected" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <div className="text-xs font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">{it.co}</div>
              </div>
              <Badge tone={it.tone}>{t(it.textKey)}</Badge>
            </div>
          ))}
          <div className="mt-2.5">
            <ProgressBar label={t("currentProgress")} value={60} color="#F97316" />
            <ProgressBar label={t("reportsSubmittedProgress")} value={60} color="#185FA5" />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3.5">
        <div className="text-sm font-medium mb-3">{t("quickActions")}</div>
        <div className="grid grid-cols-3 gap-2">
          {[t("qaUploadReport"), t("qaMessageSupervisor"), t("qaViewEvaluation")].map((label, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center cursor-pointer hover:border-orange-500 transition-colors">
              <div className="text-orange-500 text-lg mb-1">{["⬆️", "💬", "⭐"][i]}</div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ProviderContent({ t }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        <StatCard icon="👥" color="#F97316" label={t("statIncomingApplications")} value="18" change={t("statIncomingApplicationsChange")} />
        <StatCard icon="✅" color="#3B6D11" label={t("statCurrentInterns")} value="7" change={t("statCurrentInternsChange")} />
        <StatCard icon="💼" color="#185FA5" label={t("statPostedOpportunities")} value="4" change={t("statPostedOpportunitiesChange")} />
        <StatCard icon="📋" color="#BA7517" label={t("statPendingEvaluations")} value="3" change={t("statPendingEvaluationsChange")} changeColor="#BA7517" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{t("recentApplications")}</span>
            <span className="text-xs text-orange-500 cursor-pointer">{t("viewAll")}</span>
          </div>
          {[
            { name: "سارة أحمد", info: "علوم حاسوب – جامعة الأزهر", initials: "SA", tone: "pending" },
            { name: "خالد محمود", info: "هندسة – الجامعة الإسلامية", initials: "KM" },
            { name: "ريم علي", info: "نظم معلومات – جامعة الأزهر", initials: "RA" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-blue-50 text-blue-800 flex-shrink-0">{it.initials}</div>
              <div className="flex-1">
                <div className="text-xs font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">{it.info}</div>
              </div>
              {it.tone ? <Badge tone={it.tone}>{t("awaitingDecision")}</Badge> : (
                <button className="text-xs text-orange-500 border border-orange-500 rounded px-2 py-0.5">{t("review")}</button>
              )}
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="text-sm font-medium mb-3">{t("currentInterns")}</div>
          {[
            { name: "لمى محمود", role: "مطورة React", initials: "لم", stars: "★★★★☆" },
            { name: "أحمد حسن", role: "مصمم UI", initials: "أح", stars: "★★★★★" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-pink-50 text-pink-800 flex-shrink-0">{it.initials}</div>
              <div className="flex-1">
                <div className="text-xs font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">{it.role}</div>
              </div>
              <div className="text-orange-500 text-xs">{it.stars}</div>
            </div>
          ))}
          <ProgressBar label={t("capacity")} value={70} color="#F97316" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3.5">
        <div className="text-sm font-medium mb-3">{t("quickActions")}</div>
        <div className="grid grid-cols-3 gap-2">
          {[t("qaPostOpportunity"), t("qaReviewApplications"), t("qaAddEvaluation")].map((label, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center cursor-pointer hover:border-orange-500 transition-colors">
              <div className="text-orange-500 text-lg mb-1">{["➕", "📄", "⭐"][i]}</div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SupervisorContent({ t }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        <StatCard icon="👥" color="#F97316" label={t("statMyStudents")} value="12" change={t("statMyStudentsChange")} />
        <StatCard icon="📝" color="#185FA5" label={t("statReportsToReview")} value="5" change={t("statReportsToReviewChange")} />
        <StatCard icon="🎓" color="#3B6D11" label={t("statCompletedEvaluations")} value="8" change={t("statCompletedEvaluationsChange")} />
        <StatCard icon="💬" color="#BA7517" label={t("statUnreadMessages")} value="3" change={t("statUnreadMessagesChange")} changeColor="#BA7517" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{t("reportsNeedingReview")}</span>
            <span className="text-xs text-orange-500 cursor-pointer">{t("viewAll")}</span>
          </div>
          {[
            { name: "لمى محمود – تقرير الأسبوع 6", meta: "Microsoft" },
            { name: "أحمد حسن – تقرير الأسبوع 5", meta: "Orange" },
            { name: "سارة علي – تقرير الأسبوع 4", meta: "Zain", done: true },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className="w-7 h-7 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">📄</div>
              <div className="flex-1">
                <div className="text-xs">{it.name}</div>
                <div className="text-xs text-gray-400">{it.meta}</div>
              </div>
              {it.done ? <Badge tone="accepted">{t("done")}</Badge> : (
                <button className="text-xs text-orange-500 border border-orange-500 rounded px-2 py-0.5">{t("review")}</button>
              )}
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="text-sm font-medium mb-3">{t("myStudentsPerformance")}</div>
          <ProgressBar label="لمى محمود" value={87} color="#F97316" />
          <ProgressBar label="أحمد حسن" value={92} color="#3B6D11" />
          <ProgressBar label="سارة علي" value={74} color="#185FA5" />
          <ProgressBar label="خالد محمود" value={81} color="#F97316" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3.5">
        <div className="text-sm font-medium mb-3">{t("quickActions")}</div>
        <div className="grid grid-cols-3 gap-2">
          {[t("qaReviewReports"), t("qaMessageStudent"), t("qaFinalEvaluation")].map((label, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center cursor-pointer hover:border-orange-500 transition-colors">
              <div className="text-orange-500 text-lg mb-1">{["📄", "💬", "🎓"][i]}</div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminContent({ t }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        <StatCard icon="👥" color="#F97316" label={t("statTotalStudents")} value="234" change={t("statTotalStudentsChange")} />
        <StatCard icon="🏢" color="#185FA5" label={t("statTrainingProviders")} value="47" change={t("statTrainingProvidersChange")} />
        <StatCard icon="✅" color="#3B6D11" label={t("statActiveSupervisors")} value="18" change={t("statActiveSupervisorsChange")} />
        <StatCard icon="📄" color="#BA7517" label={t("statReportsNeedingApproval")} value="9" change={t("statReportsNeedingApprovalChange")} changeColor="#BA7517" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{t("supervisorDistribution")}</span>
            <span className="text-xs text-orange-500 cursor-pointer">{t("redistribute")}</span>
          </div>
          {[
            { name: "د. رامي سليمان", info: "12", initials: "رس", color: "bg-blue-50 text-blue-800", tone: "accepted", textKey: "active" },
            { name: "د. نور عمر", info: "9", initials: "نع", color: "bg-green-50 text-green-800", tone: "accepted", textKey: "active" },
            { name: "د. سمر خليل", info: "11", initials: "سخ", color: "bg-amber-50 text-amber-800", tone: "pending", textKey: "new" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${it.color}`}>{it.initials}</div>
              <div className="flex-1">
                <div className="text-xs font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">{it.info}</div>
              </div>
              <Badge tone={it.tone}>{t(it.textKey)}</Badge>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3.5">
          <div className="text-sm font-medium mb-3">{t("pendingFinalReports")}</div>
          {[
            { name: "تقرير لمى محمود النهائي", meta: "Microsoft" },
            { name: "تقرير أحمد حسن النهائي", meta: "Orange" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
              <div className="w-7 h-7 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">📄</div>
              <div className="flex-1">
                <div className="text-xs">{it.name}</div>
                <div className="text-xs text-gray-400">{it.meta}</div>
              </div>
              <button className="text-xs text-green-700 border border-green-700 rounded px-2 py-0.5">{t("approve")}</button>
            </div>
          ))}
          <ProgressBar label={t("completionRate")} value={78} color="#F97316" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3.5">
        <div className="text-sm font-medium mb-3">{t("quickActions")}</div>
        <div className="grid grid-cols-3 gap-2">
          {[t("qaAddUser"), t("qaAssignSupervisor"), t("qaPerformanceReports")].map((label, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center cursor-pointer hover:border-orange-500 transition-colors">
              <div className="text-orange-500 text-lg mb-1">{["👤➕", "🔄", "📊"][i]}</div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const contentMap = {
  student: StudentContent,
  provider: ProviderContent,
  supervisor: SupervisorContent,
  admin: AdminContent,
};

export default function TranviaDashboard() {
  const { t } = useLanguage();
  const [role, setRole] = useState("student");
  const r = roleConfig[role];
  const Content = contentMap[role];

  return (
    <div className="flex h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 font-sans" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div className="w-56 flex flex-col flex-shrink-0" style={{ background: "#1E3A5F" }}>
        <div className="px-4 pt-5 pb-4 border-b border-white/10">
          <div className="text-xl font-medium text-white tracking-wide">{t("brandName")}</div>
          <div className="text-[10px] text-white/50 mt-0.5">{t("brandTagline")}</div>
        </div>
        <div className="p-3 border-b border-white/10">
          <div className="text-[10px] text-white/40 mb-1.5 tracking-wide">{t("switchRole")}</div>
          <select
            className="w-full bg-white/10 border border-white/20 text-white px-2 py-1.5 rounded-md text-xs cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student" style={{ background: "#1E3A5F" }}>{t("roleStudent")}</option>
            <option value="provider" style={{ background: "#1E3A5F" }}>{t("roleProvider")}</option>
            <option value="supervisor" style={{ background: "#1E3A5F" }}>{t("roleSupervisor")}</option>
            <option value="admin" style={{ background: "#1E3A5F" }}>{t("roleAdmin")}</option>
          </select>
        </div>
        <div className="flex-1 py-2 overflow-y-auto">
          {r.navKeys.map((key, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer text-sm border-r-2 transition-colors ${
                i === 0
                  ? "text-white bg-orange-500/15 border-orange-500"
                  : "text-white/70 hover:text-white hover:bg-white/5 border-transparent"
              }`}
            >
              <span className="text-base">{r.icons[i]}</span>
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0">
            {r.initials}
          </div>
          <div>
            <div className="text-xs text-white/80">{r.name}</div>
            <div className="text-[10px] text-white/40">{t(r.badgeKey)}</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">{t(r.pageTitleKey)}</div>
          <div className="flex items-center gap-2">
            <button className="border border-gray-200 text-gray-500 rounded-md px-2 py-1.5 relative">
              🔔
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
            <button className="bg-orange-500 text-white text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5">
              <span>+</span> {t(r.actionKey)}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <Content t={t} />
        </div>
      </div>
    </div>
  );
}
