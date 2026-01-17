import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'

function App() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>✅ Conexión exitosa a Supabase</h1>
      <p><strong>Nombre:</strong> {profile?.name}</p>
      <p><strong>Tema:</strong> {profile?.theme}</p>
      <p><strong>Teclado:</strong> {profile?.keyboard_layout}</p>
    </div>
  )
}

export default App
