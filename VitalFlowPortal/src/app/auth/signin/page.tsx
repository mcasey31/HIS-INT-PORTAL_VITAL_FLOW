"use client";

import { signIn } from "next-auth/react";
import { HeartPulse, ArrowLeft, ShieldCheck, Lock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PatientSignInPage() {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDniLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("paciente-dni", {
        dni: dni.trim(),
        password: "1234",
        redirect: false
      });

      if (result?.error) {
        setError("DNI o datos inválidos");
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Error al intentar ingresar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60 -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50 rounded-full blur-[100px] opacity-40 -ml-20 -mb-20"></div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-white relative overflow-hidden text-center">
          
          {/* Logo y Header */}
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="mb-6 hover:scale-110 transition-transform duration-300">
                <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/30">
                  <HeartPulse className="h-9 w-9 text-white" />
                </div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Bienvenido al <br/><span className="text-blue-600">Portal de Pacientes</span></h1>
            <p className="text-slate-500 text-sm font-medium mt-4">Gestiona tu salud de forma autónoma y segura.</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Acceso por Perfil</p>
              <p className="text-xs text-slate-600 mt-1">Esta pantalla es para pacientes. Si sos profesional, usa el Portal Medicos.</p>
              <Link href="/staff/login" className="inline-block mt-3 text-[11px] font-black uppercase tracking-widest text-indigo-700 hover:text-indigo-900">
                Ir a Portal Medicos
              </Link>
            </div>

            <form onSubmit={handleDniLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">DNI</label>
                <input
                  type="text"
                  placeholder="Ej: 12345678"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  placeholder="1234"
                  defaultValue="1234"
                  disabled
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                />
                <p className="text-[9px] text-slate-500 mt-1">* Contraseña temporal: 1234</p>
              </div>

              {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Ingresando..." : "Ingresar con DNI"}
              </button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">o usa acceso demo</span>
                </div>
            </div>

            <button 
              onClick={() => signIn("demo", { username: "test", password: "test", redirect: false }).then(() => window.location.href = "/dashboard")}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
            >
              Entrar como Paciente Demo
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-10 flex flex-col items-center gap-6 text-slate-400">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Secure Auth</span>
                </div>
            </div>

            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">
                <ArrowLeft className="h-4 w-4" />
                Volver a la landing
            </Link>
        </div>
      </div>
    </main>
  );
}
