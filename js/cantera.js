// Funcionalidad para gestionar jugadores y cantera

document.addEventListener('DOMContentLoaded', function() {
  // Referencia a los elementos del DOM
  const tabs = document.querySelectorAll('.tab');
  const contenidos = document.querySelectorAll('.contenido');
  const playerSearch = document.getElementById('player-search');
  const canteraSearch = document.getElementById('cantera-search');
  const positionFilters = document.querySelectorAll('.position-filter');
  const playerRows = document.querySelectorAll('.player-row');
  const canteraRows = document.querySelectorAll('.cantera-player-row');
  
  // Funcionalidad de las pestañas
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Eliminar clase active de todas las pestañas
      tabs.forEach(t => t.classList.remove('active'));
      
      // Añadir clase active a la pestaña seleccionada
      this.classList.add('active');
      
      // Ocultar todos los contenidos
      contenidos.forEach(contenido => {
        contenido.style.display = 'none';
      });
      
      // Mostrar el contenido correspondiente a la pestaña seleccionada
      const targetId = this.getAttribute('data-target');
      document.getElementById(targetId).style.display = 'block';
    });
  });
  
  // Búsqueda de jugadores
  if (playerSearch) {
    playerSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      playerRows.forEach(row => {
        const playerName = row.querySelector('.player-name').textContent.toLowerCase();
        
        if (playerName.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
  
  // Búsqueda de jugadores de cantera
  if (canteraSearch) {
    canteraSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      canteraRows.forEach(row => {
        const playerName = row.querySelector('.player-name').textContent.toLowerCase();
        
        if (playerName.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
  
  // Filtros de posición
  positionFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      const position = this.getAttribute('data-position');
      const container = this.closest('.contenido');
      const rows = container.querySelectorAll('tbody tr');
      
      // Eliminar clase active de todos los filtros en este contenedor
      container.querySelectorAll('.position-filter').forEach(f => {
        f.classList.remove('active');
      });
      
      // Añadir clase active al filtro seleccionado
      this.classList.add('active');
      
      // Filtrar jugadores según la posición
      rows.forEach(row => {
        if (position === 'todos') {
          row.style.display = '';
        } else {
          const playerPosition = row.querySelector('.position').textContent;
          
          if (playerPosition === position) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  });
  
  // Ordenar tabla
  const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
  
  sortableHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const table = header.closest('table');
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const index = header.cellIndex;
      const isNumeric = header.getAttribute('data-type') === 'number';
      const isAsc = !header.classList.contains('asc');
      
      // Eliminar clases de todos los encabezados
      table.querySelectorAll('th').forEach(th => {
        th.classList.remove('asc', 'desc');
      });
      
      // Añadir clase al encabezado actual
      header.classList.add(isAsc ? 'asc' : 'desc');
      
      // Ordenar filas
      rows.sort((a, b) => {
        let valueA, valueB;
        
        if (isNumeric) {
          valueA = parseInt(a.cells[index].textContent) || 0;
          valueB = parseInt(b.cells[index].textContent) || 0;
        } else {
          valueA = a.cells[index].textContent.toLowerCase();
          valueB = b.cells[index].textContent.toLowerCase();
        }
        
        if (valueA < valueB) return isAsc ? -1 : 1;
        if (valueA > valueB) return isAsc ? 1 : -1;
        return 0;
      });
      
      // Reordenar filas en la tabla
      rows.forEach(row => {
        table.querySelector('tbody').appendChild(row);
      });
    });
  });

  // Modal de jugador
  // Buscar el modal o crearlo si no existe
  let modal = document.getElementById('player-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'player-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-layout">
          <div class="jugador-perfil">
            <div class="jugador-header">
              <div class="jugador-info-general">
                <h2 id="modal-player-name">Nombre del Jugador</h2>
                <div class="jugador-valoracion">
                  <span class="modal-grl-label">VAL</span>
                  <span class="modal-grl" id="modal-player-rating">85</span>
                </div>
              </div>
              <div class="jugador-posicion-principal" id="modal-player-position">
                Posición: DEL
              </div>
            </div>
            <div class="jugador-estadisticas">
              <div class="estado-section">
                <h3>Estado</h3>
                <div class="estado-info">
                  <div class="info-row">
                    <span class="info-label">Edad</span>
                    <span class="info-value" id="modal-player-age">25</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Forma</span>
                    <span class="info-value" id="modal-player-form">Excelente</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Partidos</span>
                    <span class="info-value" id="modal-player-matches">34</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Goles</span>
                    <span class="info-value" id="modal-player-goals">22</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Asistencias</span>
                    <span class="info-value" id="modal-player-assists">8</span>
                  </div>
                </div>
              </div>
              <div class="contrato-section">
                <h3>Potencial</h3>
                <div class="contrato-info">
                  <div class="info-row" id="modal-player-potential-row">
                    <span class="info-label">Potencial</span>
                    <span class="info-value" id="modal-player-potential">92</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Eventos para el modal
  const closeModal = modal.querySelector('.close-modal');
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Manejar clics en filas de jugadores
  const allPlayerRows = document.querySelectorAll('.player-row, .cantera-player-row');
  allPlayerRows.forEach(row => {
    row.addEventListener('click', function() {
      // Obtener datos del jugador seleccionado
      const playerName = row.querySelector('.player-name').textContent;
      const playerPosition = row.querySelector('.position').textContent;
      const playerRating = row.querySelector('.valor').textContent;
      const playerForm = row.querySelector('.forma').textContent;
      const playerAge = row.cells[3].textContent;
      
      // Para los jugadores regulares
      let playerMatches = '';
      let playerGoals = '';
      let playerAssists = '';
      let playerPotential = '';
      
      if (row.classList.contains('player-row')) {
        playerMatches = row.cells[4].textContent;
        playerGoals = row.cells[5].textContent;
        playerAssists = row.cells[6].textContent;
        // Ocultar fila de potencial para jugadores regulares
        document.getElementById('modal-player-potential-row').style.display = 'none';
      } else {
        // Para jugadores de cantera
        playerMatches = row.cells[5].textContent;
        playerPotential = row.querySelector('.potential').textContent;
        // Mostrar potencial para jugadores de cantera
        document.getElementById('modal-player-potential-row').style.display = 'flex';
        document.getElementById('modal-player-potential').textContent = playerPotential;
      }
      
      // Actualizar el modal con los datos del jugador
      document.getElementById('modal-player-name').textContent = playerName;
      document.getElementById('modal-player-position').textContent = 'Posición: ' + playerPosition;
      document.getElementById('modal-player-rating').textContent = playerRating;
      document.getElementById('modal-player-age').textContent = playerAge;
      document.getElementById('modal-player-form').textContent = playerForm;
      document.getElementById('modal-player-matches').textContent = playerMatches;
      
      if (playerGoals) {
        document.getElementById('modal-player-goals').textContent = playerGoals;
      }
      if (playerAssists) {
        document.getElementById('modal-player-assists').textContent = playerAssists;
      }
      
      // Mostrar el modal
      modal.style.display = 'flex';
    });
  });

  // Datos de ejemplo para los jugadores de cantera
  const canteraPlayers = [
    { id: 1, name: 'Alex Padilla', position: 'POR', age: 17, value: '500K', potential: 'A', loan: false, photoUrl: '../../img/players_icons/alex_padilla.webp' },
    { id: 2, name: 'Unai Maruri', position: 'DEF', age: 18, value: '750K', potential: 'B', loan: true, photoUrl: '../../img/players_icons/unai_maruri.webp' },
    { id: 3, name: 'Kepa Uriarte', position: 'MED', age: 16, value: '1.5M', potential: 'A+', loan: false, photoUrl: '../../img/players_icons/kepa_uriarte.webp' },
    { id: 4, name: 'Iker Bravo', position: 'DEL', age: 17, value: '2M', potential: 'A', loan: true, photoUrl: '../../img/players_icons/iker_bravo.webp' },
    { id: 5, name: 'Jon Magunagoikoetxea', position: 'DEF', age: 19, value: '300K', potential: 'C', loan: false, photoUrl: '../../img/players_icons/jon_magunagoikoetxea.webp' },
    { id: 6, name: 'Pablo Gómez', position: 'MED', age: 18, value: '1.2M', potential: 'B+', loan: false, photoUrl: '../../img/players_icons/pablo_gomez.webp' },
    { id: 7, name: 'Asier López', position: 'POR', age: 16, value: '450K', potential: 'B', loan: false, photoUrl: '../../img/players_icons/asier_lopez.webp' },
    { id: 8, name: 'Beñat Prados', position: 'DEL', age: 17, value: '1.1M', potential: 'B+', loan: true, photoUrl: '../../img/players_icons/benat_prados.webp' }
  ];

  // Función para inicializar la pestaña de cantera
  function initCantera() {
    renderCanteraPlayers();
    setupSearchFilter();
    setupPositionFilters();
    setupPlayerActions();
  }

  // Renderiza la tabla de jugadores de cantera
  function renderCanteraPlayers(filteredPlayers = null) {
    const playersToRender = filteredPlayers || canteraPlayers;
    const tableBody = document.querySelector('.content-cantera .player-table tbody');
    
    if (!tableBody) {
      console.error('No se encontró la tabla de jugadores de cantera');
      return;
    }
    
    tableBody.innerHTML = '';

    playersToRender.forEach(player => {
      const row = document.createElement('tr');
      row.dataset.playerId = player.id;
      
      row.innerHTML = `
        <td class="player-cell">
          <div class="player-info">
            <img src="${player.photoUrl}" alt="${player.name}" class="player-photo">
            <span>${player.name}</span>
          </div>
        </td>
        <td class="position-cell"><span class="position position-${player.position.toLowerCase()}">${player.position}</span></td>
        <td>${player.age}</td>
        <td class="value-cell">${player.value}</td>
        <td><span class="potential">${player.potential}</span></td>
        <td>${player.loan ? '<span class="loan-badge">CEDIDO</span>' : '-'}</td>
      `;
      
      tableBody.appendChild(row);
    });
  }

  // Configurar filtro de búsqueda
  function setupSearchFilter() {
    const searchInput = document.querySelector('.content-cantera .search-bar input');
    
    if (!searchInput) {
      console.error('No se encontró el campo de búsqueda para cantera');
      return;
    }
    
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      
      const filteredPlayers = canteraPlayers.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
      );
      
      renderCanteraPlayers(filteredPlayers);
    });
  }

  // Configurar filtros de posición
  function setupPositionFilters() {
    const positionButtons = document.querySelectorAll('.content-cantera .position-filters button');
    
    if (!positionButtons.length) {
      console.error('No se encontraron botones de filtro de posición para cantera');
      return;
    }
    
    let activePosition = 'TODOS';
    
    positionButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Eliminar clase activa de todos los botones
        positionButtons.forEach(btn => btn.classList.remove('active'));
        
        // Añadir clase activa al botón clickeado
        button.classList.add('active');
        
        activePosition = button.textContent.trim();
        
        // Filtrar jugadores
        if (activePosition === 'TODOS') {
          renderCanteraPlayers();
        } else {
          const filteredPlayers = canteraPlayers.filter(player => 
            player.position === activePosition
          );
          
          renderCanteraPlayers(filteredPlayers);
        }
      });
    });
  }

  // Configurar acciones de jugadores
  function setupPlayerActions() {
    const playerTable = document.querySelector('.content-cantera .player-table');
    
    if (!playerTable) {
      console.error('No se encontró la tabla de jugadores de cantera');
      return;
    }
    
    let activeMenu = null;
    
    // Cerrar menú al hacer clic en cualquier parte
    document.addEventListener('click', (e) => {
      if (activeMenu && !e.target.closest('.player-actions-menu') && !e.target.closest('.player-cell')) {
        activeMenu.remove();
        activeMenu = null;
      }
    });
    
    // Mostrar menú al hacer clic en un jugador
    playerTable.addEventListener('click', (e) => {
      const playerCell = e.target.closest('.player-cell');
      
      if (!playerCell) return;
      
      const row = playerCell.closest('tr');
      const playerId = parseInt(row.dataset.playerId);
      const player = canteraPlayers.find(p => p.id === playerId);
      
      if (!player) return;
      
      // Si hay un menú activo, cerrarlo
      if (activeMenu) {
        activeMenu.remove();
        activeMenu = null;
      }
      
      // Crear menú
      const menu = document.createElement('div');
      menu.className = 'player-actions-menu player-menu-active';
      
      menu.innerHTML = `
        <div class="player-menu-item" data-action="profile">Ver perfil</div>
        <div class="player-menu-item" data-action="squad">Subir al primer equipo</div>
        <div class="player-menu-item" data-action="contract">Renovar contrato</div>
        <div class="player-menu-item" data-action="loan">${player.loan ? 'Finalizar cesión' : 'Ceder jugador'}</div>
        <div class="player-menu-item" data-action="market">Poner en el mercado</div>
      `;
      
      // Añadir eventos a las opciones del menú
      menu.querySelectorAll('.player-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const action = e.target.dataset.action;
          handlePlayerAction(player, action);
          menu.remove();
          activeMenu = null;
        });
      });
      
      // Añadir menú al DOM
      playerCell.appendChild(menu);
      activeMenu = menu;
      
      // Ajustar posición del menú si se sale de la pantalla
      const menuRect = menu.getBoundingClientRect();
      if (menuRect.right > window.innerWidth) {
        menu.style.left = 'auto';
        menu.style.right = '100%';
      }
    });
  }

  // Manejar acciones del jugador
  function handlePlayerAction(player, action) {
    switch (action) {
      case 'profile':
        alert(`Ver perfil de ${player.name}`);
        break;
      case 'squad':
        alert(`${player.name} ha sido ascendido al primer equipo`);
        break;
      case 'contract':
        alert(`Negociando renovación con ${player.name}`);
        break;
      case 'loan':
        alert(player.loan ? `Cesión de ${player.name} finalizada` : `${player.name} cedido a otro equipo`);
        break;
      case 'market':
        alert(`${player.name} puesto en el mercado de traspasos`);
        break;
      default:
        console.log(`Acción no implementada: ${action}`);
    }
  }

  // Inicializar cuando la pestaña de cantera se active
  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar cuando se hace clic en la pestaña de cantera
    const canteraTab = document.querySelector('.tab-cantera');
    
    if (canteraTab) {
      canteraTab.addEventListener('click', () => {
        setTimeout(initCantera, 100); // Pequeño retraso para asegurar que el DOM está listo
      });
    }
    
    // Si la pestaña de cantera está activa por defecto, inicializar
    if (document.querySelector('.tab-cantera.active')) {
      setTimeout(initCantera, 100);
    }
  });
}); 