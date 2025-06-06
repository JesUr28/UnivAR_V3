const synth = window.speechSynthesis
let isSpeaking = false
let isLoading = false
let activeMarker = null
let isProcessingMarker = false // Flag para evitar procesamiento simultáneo de marcadores

const playBtn = document.getElementById("play-btn")
const stopBtn = document.getElementById("stop-btn")
const playText = document.getElementById("play-text")
const loadingText = document.getElementById("loading-text")
const textElement = document.getElementById("phoenix-text")
const titleElement = document.getElementById("title")
const instructionMessage = document.getElementById("instruction-message")

const texts = {
  phoenix: {
    title: "LOGO",
    content:
      "La marca gráfica es el principal signo identificador de la Universidad Popular del Cesar y está conformada por un símbolo con las letras UPC y la representación del ser humano, y el logotipo. Es la firma de la institución en la cual se manifiestan sus valores, principios y personalidad, originando un impacto y un reconocimiento en la memoria.",
  },
  lion: {
    title: "Programa: Economía",
    content:
      "El programa de Economía otorga el título de Economista, corresponde al nivel de pregrado y se ofrece como formación profesional universitaria bajo la metodología presencial y jornada única. Tiene una duración de 10 semestres, con un total de 175 créditos académicos, y pertenece a la Facultad de Ciencias Administrativas, Contables y Económicas. El número máximo de estudiantes admitidos en primer semestre es de 100, con una periodicidad de admisión semestral. Cuenta con registro calificado, aprobado mediante la Resolución No. 2439 del 7 de marzo de 2024, y está identificado con el Código SNIES 105814. Su creación se rige por norma interna a través de un acuerdo, y el programa se ofrece en la sede ubicada en Aguachica, departamento del Cesar.",
  },
  honestidad: {
    title: "Valor Intitucional: HONESTIDAD",
    content:
      "La Honestidad les da honor y decoro a las actividades realizadas, porque genera confianza, respeto y consideración por el trabajo. Es el valor que les da decoro y pudor a nuestras acciones y nos hace dignos de merecer honor, respeto y consideración.",
  },
  prudencia: {
    title: "Valor Intitucional: PRUDENCIA",
    content:
      "La Prudencia es el ejercicio pensado del ser y del actuar para el respeto de los otros; implica callar cuando no corresponde ni por autoridad ni por trabajo, o delatar o hablar o escribir o dar información sobre lo que no se me pregunta. La Prudencia es el valor del discernimiento sobre el bien y la forma para llevarlo a cabo y permite distinguir entre lo bueno y lo malo.",
  },
  justicia: {
    title: "Valor Intitucional: JUSTICIA",
    content:
      "La Justicia corresponde a la Universidad ser depositaria de la aplicación de la Justicia, entendida ésta como todas las acciones públicas y privadas dirigidas a los individuos para garantizar la igualdad, el respeto, la integridad, el libre desarrollo de la personalidad y el respeto por la vida, las creencias, los credos políticos, los derechos humanos, y el disfrute de condiciones de dignidad para estudiantes, profesores y administrativos, a la luz de su misión y visión en el marco legal y constitucional que nos rige. La Justicia considerada por los antiguos como la más excelsa de todas las virtudes, es un valor que nos inclina a dar a cada quien lo que le corresponde como propio según la recta razón.",
  },
  responsabilidad: {
    title: "Universidad: MISIÓN",
    content:
      "La Universidad Popular del Cesar, como institución de educación superior oficial del orden nacional, forma personas responsables social y culturalmente; con una educación de calidad, integral e inclusiva, rigor científico y tecnológico; mediante las diferentes modalidades y metodologías de educación, a través de programas pertinentes al contexto, dentro de la diversidad de campos disciplinares, en un marco de libertad de pensamiento; que consolide la construcción de saberes, para contribuir a la solución de problemas y conflictos, en un ambiente sostenible, con visibilidad nacional e internacional.",
  },
}

// Función para actualizar el estado de los botones
function updateButtonState() {
  // Ocultar ambos botones primero
  playBtn.classList.add("hidden")
  stopBtn.classList.add("hidden")

  // Solo mostrar botones si hay un marcador activo
  if (activeMarker) {
    if (isSpeaking) {
      // Si está reproduciendo, mostrar el botón de detener
      stopBtn.classList.remove("hidden")
    } else {
      // Si no está reproduciendo, mostrar el botón de reproducir
      playBtn.classList.remove("hidden")

      // Asegurarse de que el botón muestre "Reproducir" y no "Cargando"
      if (!isLoading) {
        playText.classList.remove("hidden")
        loadingText.classList.add("hidden")
      }
    }
  }
}

// Función para mostrar el estado de carga
function showLoadingState() {
  isLoading = true
  playText.classList.add("hidden")
  loadingText.classList.remove("hidden")
  playBtn.disabled = true
}

// Función para ocultar el estado de carga
function hideLoadingState() {
  isLoading = false
  playText.classList.remove("hidden")
  loadingText.classList.add("hidden")
  playBtn.disabled = false
}

// Función para detener la reproducción
function stopSpeaking() {
  synth.cancel()
  isSpeaking = false
  hideLoadingState()
  updateButtonState()
}

// Función para mostrar el contenido del marcador
function showMarkerContent(markerId) {
  // Si ya hay un marcador activo o estamos procesando otro, ignorar este
  if (isProcessingMarker && activeMarker && activeMarker !== markerId) {
    return
  }

  isProcessingMarker = true

  const markerKey = markerId.replace("marker-", "")

  // Ocultar mensaje de instrucción
  instructionMessage.classList.add("hidden")

  // Mostrar título y texto
  titleElement.classList.remove("hidden")
  textElement.classList.remove("hidden")

  // Establecer contenido
  titleElement.innerText = texts[markerKey].title
  textElement.innerText = texts[markerKey].content

  // Actualizar marcador activo
  activeMarker = markerId

  // Actualizar botones
  updateButtonState()

  // Liberar el flag después de un breve retraso para evitar cambios rápidos
  setTimeout(() => {
    isProcessingMarker = false
  }, 500)
}

// Función para ocultar el contenido cuando se pierde un marcador
function hideMarkerContent(markerId) {
  if (activeMarker === markerId) {
    // Ocultar título y texto
    titleElement.classList.add("hidden")
    textElement.classList.add("hidden")

    // Mostrar mensaje de instrucción
    instructionMessage.classList.remove("hidden")

    // Resetear marcador activo
    activeMarker = null

    // Ocultar botones y detener reproducción
    playBtn.classList.add("hidden")
    stopBtn.classList.add("hidden")
    stopSpeaking()
  }
}

// Detectar cuándo un marcador es visible
document.querySelector("#marker-phoenix").addEventListener("markerFound", () => {
  showMarkerContent("marker-phoenix")
  // Restablecer escala al tamaño original del ave
  document.querySelector("#bird-model").setAttribute("scale", "0.6 1 1")
})

document.querySelector("#marker-lion").addEventListener("markerFound", () => {
  showMarkerContent("marker-lion")
  // Restablecer escala al tamaño original del león
  document.querySelector("#lion-model").setAttribute("scale", "0.6 1 1")
})

document.querySelector("#marker-honestidad").addEventListener("markerFound", () => {
  showMarkerContent("marker-honestidad")
  // Restablecer escala al tamaño original
  document.querySelector("#honestidad-model").setAttribute("scale", "1 1 1")
})

document.querySelector("#marker-prudencia").addEventListener("markerFound", () => {
  showMarkerContent("marker-prudencia")
  // Restablecer escala al tamaño original
  document.querySelector("#prudencia-model").setAttribute("scale", "1 1 1")
})

document.querySelector("#marker-justicia").addEventListener("markerFound", () => {
  showMarkerContent("marker-justicia")
  // Restablecer escala al tamaño original
  document.querySelector("#justicia-model").setAttribute("scale", "1 1 1")
})

document.querySelector("#marker-responsabilidad").addEventListener("markerFound", () => {
  showMarkerContent("marker-responsabilidad")
  // Restablecer escala al tamaño original
  document.querySelector("#responsabilidad-model").setAttribute("scale", "0.6 1 1")
})

// Detectar cuándo un marcador se pierde
document.querySelector("#marker-phoenix").addEventListener("markerLost", () => {
  hideMarkerContent("marker-phoenix")
})

document.querySelector("#marker-lion").addEventListener("markerLost", () => {
  hideMarkerContent("marker-lion")
})

document.querySelector("#marker-honestidad").addEventListener("markerLost", () => {
  hideMarkerContent("marker-honestidad")
})

document.querySelector("#marker-prudencia").addEventListener("markerLost", () => {
  hideMarkerContent("marker-prudencia")
})

document.querySelector("#marker-justicia").addEventListener("markerLost", () => {
  hideMarkerContent("marker-justicia")
})

document.querySelector("#marker-responsabilidad").addEventListener("markerLost", () => {
  hideMarkerContent("marker-responsabilidad")
})

// Función para iniciar la reproducción
playBtn.addEventListener("click", () => {
  if (textElement.innerText && !isLoading) {
    // Mostrar estado de carga
    showLoadingState()

    const utterance = new SpeechSynthesisUtterance(textElement.innerText)
    utterance.lang = "es-ES"
    utterance.rate = 1.0
    utterance.pitch = 1.0

     const loadingTimeout = setTimeout(() => {
      hideLoadingState()
    }, 3000) // Máximo 3 segundos esperando que empiece a hablar

    
    utterance.onstart = () => {
      // Cancelar el timeout ya que la reproducción ha comenzado
      clearTimeout(loadingTimeout)

      isSpeaking = true
      hideLoadingState()
      updateButtonState()
    }

    utterance.onend = () => {
      isSpeaking = false
      updateButtonState()
    }

    synth.speak(utterance)
  }
})

// Función para detener la reproducción
stopBtn.addEventListener("click", () => {
  stopSpeaking()
})

// Pequeña mejora para prevenir zoom en dispositivos iOS
document.addEventListener("gesturestart", (e) => {
  e.preventDefault()
})

// Precarga de voces para mejorar el tiempo de respuesta
window.addEventListener("DOMContentLoaded", () => {
  // Intentar precargar las voces
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices()
    }
  }
})
