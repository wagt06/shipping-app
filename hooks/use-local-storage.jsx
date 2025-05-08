"use client"

import { useState, useEffect } from "react"

export function useLocalStorage(key, initialValue) {
  // Estado para almacenar nuestro valor
  // Pasa la función de inicialización a useState para que la lógica
  // solo se ejecute una vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key)
      // Analizar el JSON almacenado o si no existe devolver el valor inicial
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Si hay un error, devolver el valor inicial
      console.log(error)
      return initialValue
    }
  })

  // Devuelve una versión envuelta de la función setter de useState que
  // persiste el nuevo valor en localStorage
  const setValue = (value) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Guardar el estado
      setStoredValue(valueToStore)
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.log(error)
    }
  }

  // Efecto para sincronizar con localStorage cuando la clave cambia
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const syncWithLocalStorage = () => {
      try {
        const item = window.localStorage.getItem(key)
        const parsedItem = item ? JSON.parse(item) : initialValue

        // Only update state if the value is different
        if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
          setStoredValue(parsedItem)
        }
      } catch (error) {
        console.log(error)
      }
    }

    syncWithLocalStorage()

    // Optional: Listen for storage events to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === key) {
        syncWithLocalStorage()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, initialValue]) // Removed storedValue from dependencies

  return [storedValue, setValue]
}
