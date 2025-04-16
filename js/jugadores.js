// Código limpio y optimizado para la gestión de jugadores
document.addEventListener("DOMContentLoaded", function() {
  console.log("Cargando funcionalidad de jugadores externa");
  
  // Referencia al modal
  const playerModal = document.getElementById("player-modal");
  const modalName = document.getElementById("modal-name");
  const modalPosition = document.getElementById("modal-position");
  const modalRating = document.getElementById("modal-rating");
  const modalNumber = document.getElementById("modal-number");
  const modalContent = document.querySelector(".modal-content");
  
  // Agregar eventos a las celdas de jugadores
  function setupPlayerCells() {
    const playerCells = document.querySelectorAll(".player-cell");
    console.log("Jugadores encontrados:", playerCells.length);

    playerCells.forEach((cell, index) => {
      // Evitar agregar múltiples event listeners
      if (!cell.hasAttribute("data-setup")) {
        cell.setAttribute("data-setup", "true");

        cell.addEventListener("click", function(e) {
          e.stopPropagation();
          
          // Obtener datos del jugador
          const playerName = this.querySelector(".player-name").textContent;
          const playerPosition = this.querySelector(".position") 
            ? this.querySelector(".position").textContent 
            : "MC";
          const playerRating = this.closest("tr").querySelector(".rating") 
            ? this.closest("tr").querySelector(".rating").textContent 
            : "76";
          const playerNumberCell = this.closest("tr").querySelector("td:first-child");
          const playerNumber = playerNumberCell 
            ? playerNumberCell.textContent.trim() 
            : "-";
          
          // Actualizar datos en el modal
          modalName.textContent = playerName;
          modalPosition.textContent = playerPosition;
          modalRating.textContent = playerRating;
          modalNumber.textContent = playerNumber;
          
          // Generar estadísticas del jugador
          addPlayerStats(playerName, playerPosition, playerRating);
          
          // Mostrar el modal
          playerModal.style.display = "flex";
        });
      }
    });
  }
  
  // Función para generar y añadir estadísticas del jugador al modal
  function addPlayerStats(playerName, position, rating) {
    // Remover sección de estadísticas anterior si existe
    const existingStats = document.getElementById("player-stats-section");
    if (existingStats) {
      existingStats.remove();
    }
    
    // Crear sección de estadísticas
    const statsSection = document.createElement("div");
    statsSection.id = "player-stats-section";
    statsSection.className = "player-stats-section";
    statsSection.style.cssText = "background-color: #2d2d2d; padding: 15px; color: white;";
    
    // Crear encabezado de estadísticas
    const statsHeader = document.createElement("div");
    statsHeader.style.cssText = "margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px; font-weight: bold;";
    statsHeader.textContent = "ESTADÍSTICAS";
    statsSection.appendChild(statsHeader);
    
    // Crear contenedor de estadísticas
    const statsGrid = document.createElement("div");
    statsGrid.style.cssText = "display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;";
    
    // Generar estadísticas basadas en la posición del jugador
    const ratingNum = parseInt(rating, 10);
    const stats = generatePlayerStats(position, ratingNum);
    
    // Añadir estadísticas al grid
    for (const [statName, statValue] of Object.entries(stats)) {
      const statItem = document.createElement("div");
      statItem.style.cssText = "display: flex; justify-content: space-between;";
      
      const statLabel = document.createElement("span");
      statLabel.textContent = statName;
      statLabel.style.cssText = "color: #a0a0a0;";
      
      const statValueEl = document.createElement("span");
      
      // Determinar color basado en el valor
      let valueColor = "#ffffff";
      if (statValue >= 80) valueColor = "#4caf50";
      else if (statValue >= 70) valueColor = "#8bc34a";
      else if (statValue >= 60) valueColor = "#ffeb3b";
      else if (statValue < 60) valueColor = "#ff9800";
      
      statValueEl.textContent = statValue;
      statValueEl.style.cssText = `font-weight: bold; color: ${valueColor};`;
      
      statItem.appendChild(statLabel);
      statItem.appendChild(statValueEl);
      statsGrid.appendChild(statItem);
    }
    
    statsSection.appendChild(statsGrid);
    
    // Añadir sección de estadísticas al modal (antes de las secciones de menú)
    const firstMenuSection = modalContent.querySelector(".player-menu-section");
    modalContent.insertBefore(statsSection, firstMenuSection);
  }
  
  // Función para generar estadísticas personalizadas según la posición
  function generatePlayerStats(position, baseRating) {
    const stats = {};
    const variation = () => Math.floor(Math.random() * 10) - 5; // Variación de -5 a +5
    
    // Estadísticas comunes
    stats["Ritmo"] = Math.min(99, Math.max(40, baseRating + variation()));
    stats["Resistencia"] = Math.min(99, Math.max(40, baseRating + variation()));
    
    // Estadísticas específicas por posición
    if (position.includes("POR")) {
      stats["Reflejos"] = Math.min(99, Math.max(50, baseRating + 5 + variation()));
      stats["Estiradas"] = Math.min(99, Math.max(50, baseRating + 3 + variation()));
      stats["Paradas"] = Math.min(99, Math.max(50, baseRating + 4 + variation()));
      stats["Saques"] = Math.min(99, Math.max(40, baseRating - 2 + variation()));
      stats["Posicionamiento"] = Math.min(99, Math.max(50, baseRating + 2 + variation()));
      stats["Concentración"] = Math.min(99, Math.max(50, baseRating + 1 + variation()));
    } 
    else if (position.includes("DF") || position.includes("LI") || position.includes("LD")) {
      stats["Entradas"] = Math.min(99, Math.max(50, baseRating + 5 + variation()));
      stats["Marcaje"] = Math.min(99, Math.max(50, baseRating + 4 + variation()));
      stats["Fuerza"] = Math.min(99, Math.max(50, baseRating + 3 + variation()));
      stats["Anticipación"] = Math.min(99, Math.max(50, baseRating + 2 + variation()));
      stats["Cabeza"] = Math.min(99, Math.max(50, baseRating + 1 + variation()));
      stats["Agresividad"] = Math.min(99, Math.max(40, baseRating - 2 + variation()));
    }
    else if (position.includes("MC") || position.includes("MCD")) {
      stats["Pase"] = Math.min(99, Math.max(50, baseRating + 5 + variation()));
      stats["Visión"] = Math.min(99, Math.max(50, baseRating + 4 + variation()));
      stats["Control"] = Math.min(99, Math.max(50, baseRating + 3 + variation()));
      stats["Interceptación"] = Math.min(99, Math.max(50, baseRating + 2 + variation()));
      stats["Técnica"] = Math.min(99, Math.max(50, baseRating + 1 + variation()));
      stats["Regate"] = Math.min(99, Math.max(40, baseRating - 2 + variation()));
    }
    else if (position.includes("MI") || position.includes("EI") || position.includes("ED")) {
      stats["Regate"] = Math.min(99, Math.max(50, baseRating + 5 + variation()));
      stats["Velocidad"] = Math.min(99, Math.max(50, baseRating + 4 + variation()));
      stats["Agilidad"] = Math.min(99, Math.max(50, baseRating + 3 + variation()));
      stats["Pase"] = Math.min(99, Math.max(50, baseRating + 2 + variation()));
      stats["Centro"] = Math.min(99, Math.max(50, baseRating + 1 + variation()));
      stats["Técnica"] = Math.min(99, Math.max(40, baseRating + 2 + variation()));
    }
    else if (position.includes("DC") || position.includes("SD")) {
      stats["Definición"] = Math.min(99, Math.max(50, baseRating + 5 + variation()));
      stats["Remate"] = Math.min(99, Math.max(50, baseRating + 4 + variation()));
      stats["Cabeza"] = Math.min(99, Math.max(50, baseRating + 3 + variation()));
      stats["Posicionamiento"] = Math.min(99, Math.max(50, baseRating + 2 + variation()));
      stats["Reacción"] = Math.min(99, Math.max(50, baseRating + 1 + variation()));
      stats["Equilibrio"] = Math.min(99, Math.max(40, baseRating - 2 + variation()));
    }
    else {
      // Posición no reconocida, estadísticas genéricas
      stats["Técnica"] = Math.min(99, Math.max(40, baseRating + variation()));
      stats["Pase"] = Math.min(99, Math.max(40, baseRating + variation()));
      stats["Regate"] = Math.min(99, Math.max(40, baseRating + variation()));
      stats["Velocidad"] = Math.min(99, Math.max(40, baseRating + variation()));
      stats["Resistencia"] = Math.min(99, Math.max(40, baseRating + variation()));
      stats["Fuerza"] = Math.min(99, Math.max(40, baseRating + variation()));
    }
    
    return stats;
  }
  
  // Configurar celdas iniciales
  setupPlayerCells();
  
  // Manejar cambios de pestaña
  const tabs = document.querySelectorAll('.tab');
  if (tabs) {
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        setTimeout(setupPlayerCells, 100);
      });
    });
  }
  
  // Cerrar modal al hacer clic fuera
  playerModal.addEventListener('click', function(e) {
    if (e.target === playerModal) {
      playerModal.style.display = 'none';
    }
  });
  
  // Añadir eventos a elementos del menú modal
  const menuItems = document.querySelectorAll('.player-menu-item');
  if (menuItems) {
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const playerName = document.getElementById('modal-name').textContent;
        
        console.log(`Acción "${action}" para ${playerName}`);
        alert(`Acción "${action}" para ${playerName}`);
        
        playerModal.style.display = 'none';
      });
    });
  }
  
  // Gestionar los filtros desplegables
  const filtros = document.querySelectorAll('.filtro');
  if (filtros) {
    filtros.forEach(filtro => {
      filtro.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Manejar selección de opción
        if (e.target.closest('.filtro-option')) {
          const selectedOption = e.target.textContent;
          this.querySelector('span').textContent = selectedOption;
          this.classList.remove('filtro-active');
          return;
        }
        
        // Abrir/cerrar menú
        filtros.forEach(f => {
          if (f !== this) f.classList.remove('filtro-active');
        });
        
        this.classList.toggle('filtro-active');
      });
    });
    
    // Cerrar filtros al hacer clic fuera
    document.addEventListener('click', function() {
      filtros.forEach(filtro => filtro.classList.remove('filtro-active'));
    });
  }
}); 