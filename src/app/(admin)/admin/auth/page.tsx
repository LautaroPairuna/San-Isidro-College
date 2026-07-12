// src/app/admin/auth/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  HiAtSymbol,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiExclamationCircle,
} from 'react-icons/hi'
import { motion } from 'framer-motion'

export default function AuthPage() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [error, setError]               = useState<string>()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const { data: session }               = useSession()
  const router                          = useRouter()

  useEffect(() => {
    if (session) router.replace('/admin/resources/GrupoMedios')
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setLoading(true)

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setLoading(false)
    if (res?.error) {
      setError(res.error)
    } else {
      router.replace('/admin/resources/GrupoMedios')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-6">
      {/* Formas decorativas de marca */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[520px] max-w-[70vw] opacity-20">
        <Image src="/images/formas/forma-home-3.svg" alt="" width={750} height={500} className="w-full h-auto" />
      </div>
      <div className="pointer-events-none absolute -bottom-28 -left-24 w-[440px] max-w-[60vw] opacity-10">
        <Image src="/images/formas/forma-home-2.svg" alt="" width={650} height={500} className="w-full h-auto" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Cabecera con logo institucional */}
        <div className="flex flex-col items-center gap-3 px-8 pt-8 pb-6 border-b border-gray-100">
          <Image
            src="/images/logo-san-isidro-2.svg"
            alt="San Isidro College"
            width={226}
            height={108}
            priority
            className="h-16 w-auto"
          />
          <div className="text-center">
            <h2 className="text-xl font-bold text-navy-700">Panel de Administración</h2>
            <p className="text-sm text-gray-500">Ingresá para gestionar el contenido del sitio</p>
          </div>
        </div>

        <div className="px-8 py-7">
          {error && (
            <motion.div
              key={error}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-5"
            >
              <HiExclamationCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative group">
                <HiAtSymbol className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 transition group-focus-within:text-brand-700" />
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/40 transition"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 transition group-focus-within:text-brand-700" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-700 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            {/* Recuérdame */}
            <label className="inline-flex items-center text-gray-600 text-sm select-none">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 accent-brand-600 border-gray-300 rounded"
              />
              Recuérdame
            </label>

            {/* Botón */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex justify-center items-center py-2.5 bg-brand-600 text-white rounded-lg font-semibold shadow-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </motion.button>
          </form>
        </div>

        {/* Pie de marca */}
        <div className="px-8 py-4 bg-brand-50 text-center">
          <p className="text-xs text-brand-800">San Isidro College · Panel interno</p>
        </div>
      </motion.div>
    </div>
  )
}
