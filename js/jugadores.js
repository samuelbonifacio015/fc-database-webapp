// Código limpio y optimizado para la gestión de jugadores
document.addEventListener("DOMContentLoaded", function() {
  console.log("Cargando funcionalidad de jugadores externa");
  
  // Referencia al modal
  const playerModal = document.getElementById("player-modal");
  const modalName = document.getElementById("modal-player-name");
  const modalPosition = document.getElementById("modal-position");
  const modalRating = document.getElementById("modal-player-rating");
  const modalDorsal = document.getElementById("modal-dorsal");
  const modalImage = document.getElementById("modal-player-image");
  
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
          const playerImage = this.querySelector(".player-avatar")
            ? this.querySelector(".player-avatar").src
            : "";
          
          // Actualizar datos en el modal
          modalName.textContent = playerName;
          modalPosition.textContent = playerPosition;
          modalRating.textContent = playerRating;
          modalDorsal.textContent = playerNumber;
          modalImage.src = playerImage;
          
          // Mostrar el modal
          playerModal.style.display = "block";
          document.body.style.overflow = "hidden";
        });
      }
    });
  }

  // Configurar cierre del modal
  const closeModal = document.querySelector(".close-modal");
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      playerModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (event) => {
    if (event.target === playerModal) {
      playerModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Cerrar modal con tecla ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && playerModal.style.display === "block") {
      playerModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Inicializar modales
  setupPlayerCells();

  // Configurar modales cuando cambie la pestaña
  const tabs = document.querySelectorAll(".tab");
  if (tabs) {
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        setTimeout(setupPlayerCells, 100);
      });
    });
  }
}); 