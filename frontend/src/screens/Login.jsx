import { useState } from "react";
import { motion } from "framer-motion";
import { Boxes, Lock, Mail, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

// Animation variants for staggered entrance
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Login() {
  const { login, status, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "admin@app.local", password: "admin123" });

  const submit = async (event) => {
    event.preventDefault();
    try { await login(form); } catch (_) { }
  };

  const fillDemo = (type) => {
    clearError();
    setForm(
      type === "admin"
        ? { email: "admin@app.local", password: "admin123" }
        : { email: "user@app.local", password: "user123" }
    );
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-4 py-8 text-slate-900 selection:bg-emerald-200 overflow-hidden flex items-center">

      {/* Ambient Light Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Left Side: Hero Content (Light Theme) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="hidden lg:block pr-8"
        >
        {/*   <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
            <Sparkles size={16} className="text-emerald-600" />
            Inventory
          </motion.div> */}

          <motion.h1 variants={fadeUp} className="max-w-2xl text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Run stock operations from one <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-500">connected workspace.</span>
          </motion.h1>

  {/*         <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Login with backend JWT auth, manage products, customers, users, stock movements, Excel imports, and realtime inventory updates seamlessly.
          </motion.p> */}

         {/*  <motion.div variants={staggerContainer} className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
            {["JWT Auth", "Prisma API", "WebSocket Sync"].map((item) => (
              <motion.div key={item} variants={fadeUp} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
                <ShieldCheck className="mb-4 text-emerald-600 transition-transform group-hover:scale-110" size={24} />
                <p className="text-sm font-bold text-slate-800">{item}</p>
              </motion.div>
            ))}
          </motion.div> */}
        </motion.div>

        {/* Right Side: Clean White Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="mx-auto w-full max-w-md relative"
        >
          {/* Subtle Card Drop Shadow */}
          <div className="absolute inset-0 rounded-2xl bg-slate-200 blur-xl opacity-50" />

          <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ">
                 <img src="/macsoft-logo.png" alt="Macsoft Logo" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-widest text-slate-900">STOCK MANAGEMENT SYSTEM.</h2>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Access Portal</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              <div className="relative group">
                <Mail className="pointer-events-none absolute left-3.5 top-[38px] text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3.5 top-[38px] text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
                <Input
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                  {error}
                </motion.div>
              )}

              <Button
                className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Authenticating..." : "Sign In Securely"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Quick Login (Demo)</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemo("admin")}
                  className="group flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition-all hover:border-emerald-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div>
                    <span className="font-bold text-slate-900">Admin</span>
                    <span className="ml-2 text-xs font-medium text-slate-500">admin@app.local</span>
                  </div>
                  <ArrowRight size={14} className="text-emerald-600 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("user")}
                  className="group flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition-all hover:border-emerald-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div>
                    <span className="font-bold text-slate-900">Operations</span>
                    <span className="ml-2 text-xs font-medium text-slate-500">user@app.local</span>
                  </div>
                  <ArrowRight size={14} className="text-emerald-600 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}