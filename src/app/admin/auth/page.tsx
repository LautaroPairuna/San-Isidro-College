// src/app/admin/auth/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  HiAtSymbol,
  HiLockClosed,
  HiEye,
  HiEyeOff,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="px-8 py-6">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
            Panel Admin
          </h2>

          {error && (
            <motion.div
              key={error}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-red-600 text-sm mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <HiAtSymbol className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 transition group-focus-within:text-indigo-700" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="peer w-full pl-12 pr-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            {/* Contraseña */}
            <div className="relative group">
              <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 transition group-focus-within:text-indigo-700" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="peer w-full pl-12 pr-12 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            {/* Recuérdame */}
            <label className="inline-flex items-center text-gray-700 text-sm">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              Recuérdame
            </label>

            {/* Botón */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex justify-center items-center py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
