/**
 * PhrasesPanel - Panel con frases rápidas organizadas por categoría
 * 
 * Props:
 * - phrases: Array - Lista de frases desde Supabase
 * - onPhraseSelect: function(phrase) - Handler al seleccionar frase
 * - loading: boolean - Si está cargando
 */

import { useState, useMemo } from 'react'
import PhraseButton from './PhraseButton'
import styles from './PhrasesPanel.module.css'

// Categorías con iconos
const CATEGORIES = [
  { id: 'todas', name: 'Todas', icon: '📋' },
  { id: 'saludos', name: 'Saludos', icon: '👋' },
  { id: 'social', name: 'Social', icon: '💬' },
  { id: 'necesidades', name: 'Necesidades', icon: '🙋' },
  { id: 'opiniones', name: 'Opiniones', icon: '💭' },
  { id: 'preguntas', name: 'Preguntas', icon: '❓' },
]

export default function PhrasesPanel({ 
  phrases = [], 
  onPhraseSelect,
  loading = false 
}) {
  const [activeCategory, setActiveCategory] = useState('todas')
  
  // Filtrar frases por categoría
  const filteredPhrases = useMemo(() => {
    if (activeCategory === 'todas') {
      return phrases
    }
    return phrases.filter(p => p.category === activeCategory)
  }, [phrases, activeCategory])
  
  // Obtener categorías que tienen frases
  const availableCategories = useMemo(() => {
    const categoriesWithPhrases = new Set(phrases.map(p => p.category))
    return CATEGORIES.filter(
      cat => cat.id === 'todas' || categoriesWithPhrases.has(cat.id)
    )
  }, [phrases])
  
  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Cargando frases...</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className={styles.panel}>
      {/* Tabs de categorías */}
      <div className={styles.tabs}>
        {availableCategories.map(category => (
          <button
            key={category.id}
            className={`${styles.tab} ${activeCategory === category.id ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className={styles.tabIcon}>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Lista de frases */}
      <div className={styles.phrases}>
        {filteredPhrases.length > 0 ? (
          filteredPhrases.map(phrase => (
            <PhraseButton
              key={phrase.id}
              phrase={phrase}
              onClick={onPhraseSelect}
            />
          ))
        ) : (
          <div className={styles.empty}>
            No hay frases en esta categoría
          </div>
        )}
      </div>
    </div>
  )
}
