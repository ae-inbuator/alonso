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

// Mapeo de categorías a iconos
const CATEGORY_ICONS = {
  todas: '📋',
  saludos: '👋',
  social: '💬',
  necesidades: '🙋',
  opiniones: '💭',
  preguntas: '❓',
  restaurante: '🍽️',
  escuela: '🎓',
  terapia: '💜',
  general: '📝'
}

// Nombres amigables para las categorías
const CATEGORY_NAMES = {
  todas: 'Todas',
  saludos: 'Saludos',
  social: 'Social',
  necesidades: 'Necesidades',
  opiniones: 'Opiniones',
  preguntas: 'Preguntas',
  restaurante: 'Restaurante',
  escuela: 'Escuela',
  terapia: 'Terapia',
  general: 'General'
}

export default function PhrasesPanel({ 
  phrases = [], 
  onPhraseSelect,
  loading = false 
}) {
  const [activeCategory, setActiveCategory] = useState('todas')
  
  // Detectar categorías disponibles basadas en las frases
  const availableCategories = useMemo(() => {
    const categories = new Set(['todas'])
    phrases.forEach(phrase => {
      if (phrase.category) {
        categories.add(phrase.category)
      }
    })
    
    // Convertir a array con info
    return Array.from(categories).map(catId => ({
      id: catId,
      name: CATEGORY_NAMES[catId] || catId.charAt(0).toUpperCase() + catId.slice(1),
      icon: CATEGORY_ICONS[catId] || '📝'
    }))
  }, [phrases])
  
  // Filtrar frases por categoría
  const filteredPhrases = useMemo(() => {
    if (activeCategory === 'todas') {
      return phrases
    }
    return phrases.filter(p => p.category === activeCategory)
  }, [phrases, activeCategory])
  
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
