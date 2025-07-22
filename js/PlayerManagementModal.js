/**
 * PlayerManagementModal - Sistema completo de gestión de jugadores
 * Maneja creación, edición, validación y eliminación de jugadores
 */
class PlayerManagementModal {
  constructor() {
    this.modal = null;
    this.deleteModal = null;
    this.form = null;
    this.isEditMode = false;
    this.currentPlayerId = null;
    this.validationRules = this.initValidationRules();
    
    this.init();
  }

  /**
   * Inicializa el modal y configura eventos
   */
  init() {
    this.createModalElements();
    this.setupEventListeners();
    this.setupFormValidation();
    this.setupTabNavigation();
    this.setupAttributeBars();
    this.setupFileUpload();
  }

  /**
   * Crea los elementos del modal en el DOM
   */
  createModalElements() {
    // Cargar modal desde componente si no existe
    if (!document.getElementById('playerManagementModal')) {
      this.loadModalComponent();
    }
    
    this.modal = document.getElementById('playerManagementModal');
    this.deleteModal = document.getElementById('deleteConfirmModal');
    this.form = document.getElementById('playerForm');
    
    if (!this.modal || !this.form) {
      console.error('❌ No se pudo encontrar el modal de gestión de jugadores');
      return;
    }
    
    console.log('✅ Modal de gestión inicializado');
  }

  /**
   * Carga el componente del modal desde archivo HTML
   */
  async loadModalComponent() {
    try {
      const response = await fetch('./src/html/components/player-management-modal.html');
      const html = await response.text();
      
      // Crear contenedor temporal
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Añadir al body
      document.body.appendChild(temp.firstElementChild);
      document.body.appendChild(temp.lastElementChild);
      
    } catch (error) {
      console.error('❌ Error cargando componente del modal:', error);
    }
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    // Botones de apertura del modal
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="add-player"]')) {
        this.openAddModal();
      }
      
      if (e.target.matches('[data-action="edit-player"]')) {
        const playerId = e.target.dataset.playerId;
        this.openEditModal(playerId);
      }
      
      if (e.target.matches('[data-action="delete-player"]')) {
        const playerId = e.target.dataset.playerId;
        this.openDeleteConfirm(playerId);
      }
    });

    // Cerrar modal
    if (this.modal) {
      this.modal.querySelector('.close-modal').addEventListener('click', () => {
        this.closeModal();
      });
      
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Botones de acción del formulario
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
      
      document.getElementById('cancelBtn').addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Modal de confirmación de eliminación
    if (this.deleteModal) {
      document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        this.closeDeleteConfirm();
      });
      
      document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        this.handleDelete();
      });
    }

    // Escape key para cerrar modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.modal.classList.contains('active')) {
          this.closeModal();
        }
        if (this.deleteModal.classList.contains('active')) {
          this.closeDeleteConfirm();
        }
      }
    });
  }

  /**
   * Configura la navegación por tabs
   */
  setupTabNavigation() {
    const tabButtons = this.modal.querySelectorAll('.tab-btn');
    const tabContents = this.modal.querySelectorAll('.form-tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remover clases active
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Añadir clase active
        btn.classList.add('active');
        this.modal.querySelector(`[data-tab="${targetTab}"].form-tab-content`).classList.add('active');
      });
    });
  }

  /**
   * Configura las barras de atributos
   */
  setupAttributeBars() {
    const attributeInputs = this.modal.querySelectorAll('.attribute-input input');
    
    attributeInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.updateAttributeBar(e.target);
      });
    });

    // Configurar rating visuals
    const ratingInput = document.getElementById('playerRating');
    const potentialInput = document.getElementById('playerPotential');
    
    if (ratingInput) {
      ratingInput.addEventListener('input', (e) => {
        this.updateRatingVisual('ratingVisual', e.target.value);
      });
    }
    
    if (potentialInput) {
      potentialInput.addEventListener('input', (e) => {
        this.updateRatingVisual('potentialVisual', e.target.value);
      });
    }

    // Mostrar/ocultar atributos de portero
    const positionSelect = document.getElementById('playerPosition');
    if (positionSelect) {
      positionSelect.addEventListener('change', (e) => {
        this.toggleGoalkeeperAttributes(e.target.value);
      });
    }
  }

  /**
   * Configura la subida de archivos
   */
  setupFileUpload() {
    const uploadArea = document.getElementById('photoUploadArea');
    const fileInput = document.getElementById('playerPhoto');
    const preview = document.getElementById('photoPreview');

    if (!uploadArea || !fileInput || !preview) return;

    // Click para abrir selector
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag & drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload(files[0], preview);
      }
    });

    // Cambio de archivo
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0], preview);
      }
    });
  }

  /**
   * Configura la validación del formulario
   */
  setupFormValidation() {
    const inputs = this.form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  /**
   * Abre el modal en modo añadir
   */
  openAddModal() {
    this.isEditMode = false;
    this.currentPlayerId = null;
    
    document.getElementById('modalTitle').textContent = 'Añadir Nuevo Jugador';
    document.getElementById('saveBtn').querySelector('.btn-text').textContent = 'Guardar Jugador';
    
    this.resetForm();
    this.showModal();
  }

  /**
   * Abre el modal en modo editar
   * @param {string} playerId - ID del jugador a editar
   */
  async openEditModal(playerId) {
    if (!window.PlayerDB || !window.PlayerDB.isLoaded) {
      console.error('❌ Base de datos no cargada');
      return;
    }

    const player = window.PlayerDB.getPlayerById(playerId);
    if (!player) {
      console.error('❌ Jugador no encontrado:', playerId);
      return;
    }

    this.isEditMode = true;
    this.currentPlayerId = playerId;
    
    document.getElementById('modalTitle').textContent = 'Editar Jugador';
    document.getElementById('saveBtn').querySelector('.btn-text').textContent = 'Actualizar Jugador';
    
    this.populateForm(player);
    this.showModal();
  }

  /**
   * Abre el modal de confirmación de eliminación
   * @param {string} playerId - ID del jugador a eliminar
   */
  openDeleteConfirm(playerId) {
    if (!window.PlayerDB || !window.PlayerDB.isLoaded) {
      console.error('❌ Base de datos no cargada');
      return;
    }

    const player = window.PlayerDB.getPlayerById(playerId);
    if (!player) {
      console.error('❌ Jugador no encontrado:', playerId);
      return;
    }

    this.currentPlayerId = playerId;
    document.getElementById('deletePlayerName').textContent = player.basicInfo.name;
    
    this.deleteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Muestra el modal principal
   */
  showModal() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en primer campo
    setTimeout(() => {
      const firstInput = this.modal.querySelector('input:not([type="file"]):not([type="checkbox"])');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  /**
   * Cierra el modal principal
   */
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  /**
   * Cierra el modal de confirmación
   */
  closeDeleteConfirm() {
    this.deleteModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    this.currentPlayerId = null;
  }

  /**
   * Resetea el formulario a valores por defecto
   */
  resetForm() {
    this.form.reset();
    
    // Resetear preview de imagen
    document.getElementById('photoPreview').src = '../../img/players_icons/00000.png';
    
    // Resetear barras de atributos
    this.modal.querySelectorAll('.attribute-fill').forEach(bar => {
      bar.style.width = '65%';
    });
    
    // Resetear rating visuals
    this.updateRatingVisual('ratingVisual', 65);
    this.updateRatingVisual('potentialVisual', 70);
    
    // Resetear tabs
    this.modal.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    this.modal.querySelectorAll('.form-tab-content').forEach(content => content.classList.remove('active'));
    
    this.modal.querySelector('.tab-btn[data-tab="basic"]').classList.add('active');
    this.modal.querySelector('.form-tab-content[data-tab="basic"]').classList.add('active');
    
    // Limpiar errores
    this.clearAllErrors();
    
    // Ocultar atributos de portero
    this.toggleGoalkeeperAttributes('');
  }

  /**
   * Rellena el formulario con datos del jugador
   * @param {Object} player - Datos del jugador
   */
  populateForm(player) {
    // Información básica
    document.getElementById('playerName').value = player.basicInfo.name || '';
    document.getElementById('playerFullName').value = player.basicInfo.fullName || '';
    document.getElementById('playerPosition').value = player.basicInfo.position || '';
    document.getElementById('playerAge').value = player.basicInfo.age || '';
    document.getElementById('playerDorsal').value = player.basicInfo.dorsal || '';
    document.getElementById('playerFoot').value = player.status.preferredFoot || 'Derecha';
    document.getElementById('playerNationality').value = player.basicInfo.nationality || 'España';
    
    // Foto
    if (player.basicInfo.photoUrl) {
      document.getElementById('photoPreview').src = player.basicInfo.photoUrl;
    }
    
    // Estadísticas
    document.getElementById('playerRating').value = player.gameStats.rating || 65;
    document.getElementById('playerPotential').value = player.gameStats.potential || 70;
    document.getElementById('playerValue').value = player.gameStats.value || '';
    document.getElementById('playerSalary').value = player.gameStats.salary || '';
    
    // Estadísticas de temporada
    const currentSeason = '2024-2025';
    const seasonStats = player.seasonStats[currentSeason] || {};
    document.getElementById('playerAppearances').value = seasonStats.appearances || 0;
    document.getElementById('playerGoals').value = seasonStats.goals || 0;
    document.getElementById('playerAssists').value = seasonStats.assists || 0;
    document.getElementById('playerMinutes').value = seasonStats.minutesPlayed || 0;
    document.getElementById('playerSeasonRating').value = seasonStats.rating || 6.0;
    
    // Contrato
    document.getElementById('contractStart').value = player.gameStats.contract.startDate || '';
    document.getElementById('contractEnd').value = player.gameStats.contract.endDate || '';
    document.getElementById('contractYears').value = player.gameStats.contract.years || '';
    
    // Estado
    document.getElementById('playerImportance').value = player.status.importance || 'Rotación';
    document.getElementById('playerForm').value = player.status.form || 'Normal';
    document.getElementById('isYouthPlayer').checked = player.status.isYouthPlayer || false;
    document.getElementById('onLoan').checked = player.status.onLoan || false;
    document.getElementById('transferListed').checked = player.status.transferListed || false;
    document.getElementById('injured').checked = player.status.injured || false;
    
    // Atributos
    const attrs = player.attributes || {};
    this.setAttributeValue('attrPace', attrs.pace || 65);
    this.setAttributeValue('attrShooting', attrs.shooting || 65);
    this.setAttributeValue('attrPassing', attrs.passing || 65);
    this.setAttributeValue('attrDribbling', attrs.dribbling || 65);
    this.setAttributeValue('attrDefending', attrs.defending || 65);
    this.setAttributeValue('attrPhysical', attrs.physical || 65);
    
    // Atributos de portero si aplica
    if (player.basicInfo.position === 'POR') {
      this.setAttributeValue('attrEstiradas', attrs.estiradas || 65);
      this.setAttributeValue('attrParadas', attrs.paradas || 65);
      this.setAttributeValue('attrSaque', attrs.saque || 65);
      this.setAttributeValue('attrReflejos', attrs.reflejos || 65);
      this.setAttributeValue('attrColocacion', attrs.colocacion || 65);
    }
    
    // Actualizar visuales
    this.updateRatingVisual('ratingVisual', player.gameStats.rating);
    this.updateRatingVisual('potentialVisual', player.gameStats.potential);
    this.toggleGoalkeeperAttributes(player.basicInfo.position);
  }

  /**
   * Establece el valor de un atributo y actualiza su barra
   * @param {string} inputId - ID del input
   * @param {number} value - Valor del atributo
   */
  setAttributeValue(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = value;
      this.updateAttributeBar(input);
    }
  }

  /**
   * Maneja el envío del formulario
   */
  async handleSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const saveBtn = document.getElementById('saveBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoading = saveBtn.querySelector('.btn-loading');
    
    // Mostrar estado de carga
    saveBtn.classList.add('btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    saveBtn.disabled = true;

    try {
      const playerData = this.collectFormData();
      
      let result;
      if (this.isEditMode) {
        result = window.PlayerDB.updatePlayer(this.currentPlayerId, playerData);
      } else {
        result = window.PlayerDB.addPlayer(playerData);
      }

      if (result) {
        // Guardar en base de datos
        await window.PlayerDB.saveDatabase();
        
        // Emitir evento para actualizar UI
        this.dispatchPlayerEvent(this.isEditMode ? 'playerUpdated' : 'playerAdded', result);
        
        // Mostrar notificación de éxito
        this.showNotification('success', 
          this.isEditMode ? 'Jugador actualizado exitosamente' : 'Jugador añadido exitosamente'
        );
        
        this.closeModal();
      } else {
        throw new Error('Error guardando jugador');
      }

    } catch (error) {
      console.error('❌ Error guardando jugador:', error);
      this.showNotification('error', 'Error guardando jugador: ' + error.message);
    } finally {
      // Restaurar botón
      saveBtn.classList.remove('btn-loading');
      btnText.style.display = 'flex';
      btnLoading.style.display = 'none';
      saveBtn.disabled = false;
    }
  }

  /**
   * Maneja la eliminación del jugador
   */
  async handleDelete() {
    try {
      const success = window.PlayerDB.deletePlayer(this.currentPlayerId);
      
      if (success) {
        await window.PlayerDB.saveDatabase();
        
        this.dispatchPlayerEvent('playerDeleted', { id: this.currentPlayerId });
        this.showNotification('success', 'Jugador eliminado exitosamente');
        
        this.closeDeleteConfirm();
      } else {
        throw new Error('Error eliminando jugador');
      }

    } catch (error) {
      console.error('❌ Error eliminando jugador:', error);
      this.showNotification('error', 'Error eliminando jugador: ' + error.message);
    }
  }

  /**
   * Recopila todos los datos del formulario
   * @returns {Object} Datos del jugador
   */
  collectFormData() {
    const formData = new FormData(this.form);
    
    return {
      basicInfo: {
        name: formData.get('name'),
        fullName: formData.get('fullName') || formData.get('name'),
        position: formData.get('position'),
        age: parseInt(formData.get('age')),
        nationality: formData.get('nationality'),
        photoUrl: this.getPhotoUrl(),
        dorsal: formData.get('dorsal') ? parseInt(formData.get('dorsal')) : null
      },
      gameStats: {
        rating: parseInt(formData.get('rating')),
        potential: parseInt(formData.get('potential')),
        value: formData.get('value'),
        salary: formData.get('salary'),
        contract: {
          years: parseInt(formData.get('years')) || 2,
          startDate: formData.get('startDate'),
          endDate: formData.get('endDate')
        }
      },
      attributes: this.collectAttributes(formData),
      seasonStats: {
        '2024-2025': {
          appearances: parseInt(formData.get('appearances')) || 0,
          goals: parseInt(formData.get('goals')) || 0,
          assists: parseInt(formData.get('assists')) || 0,
          rating: parseFloat(formData.get('seasonRating')) || 6.0,
          minutesPlayed: parseInt(formData.get('minutesPlayed')) || 0
        }
      },
      status: {
        isActive: true,
        isYouthPlayer: formData.get('isYouthPlayer') === 'on',
        onLoan: formData.get('onLoan') === 'on',
        transferListed: formData.get('transferListed') === 'on',
        injured: formData.get('injured') === 'on',
        importance: formData.get('importance'),
        form: formData.get('form'),
        preferredFoot: formData.get('preferredFoot')
      }
    };
  }

  /**
   * Recopila los atributos del formulario
   * @param {FormData} formData - Datos del formulario
   * @returns {Object} Atributos del jugador
   */
  collectAttributes(formData) {
    const attributes = {
      pace: parseInt(formData.get('pace')) || 65,
      shooting: parseInt(formData.get('shooting')) || 65,
      passing: parseInt(formData.get('passing')) || 65,
      dribbling: parseInt(formData.get('dribbling')) || 65,
      defending: parseInt(formData.get('defending')) || 65,
      physical: parseInt(formData.get('physical')) || 65
    };

    // Añadir atributos específicos de portero si aplica
    const position = formData.get('position');
    if (position === 'POR') {
      attributes.estiradas = parseInt(formData.get('estiradas')) || 65;
      attributes.paradas = parseInt(formData.get('paradas')) || 65;
      attributes.saque = parseInt(formData.get('saque')) || 65;
      attributes.reflejos = parseInt(formData.get('reflejos')) || 65;
      attributes.colocacion = parseInt(formData.get('colocacion')) || 65;
    }

    return attributes;
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  /**
   * Inicializa las reglas de validación
   * @returns {Object} Reglas de validación
   */
  initValidationRules() {
    return {
      name: { required: true, minLength: 2, maxLength: 50 },
      position: { required: true },
      age: { required: true, min: 15, max: 45 },
      rating: { required: true, min: 40, max: 99 }
    };
  }

  /**
   * Valida todo el formulario
   * @returns {boolean} True si es válido
   */
  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Valida un campo específico
   * @param {HTMLElement} field - Campo a validar
   * @returns {boolean} True si es válido
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const rules = this.validationRules[fieldName];
    
    if (!rules) return true;

    // Validar campo requerido
    if (rules.required && !value) {
      this.showFieldError(field, 'Este campo es obligatorio');
      return false;
    }

    // Validar longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      this.showFieldError(field, `Mínimo ${rules.minLength} caracteres`);
      return false;
    }

    // Validar longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      this.showFieldError(field, `Máximo ${rules.maxLength} caracteres`);
      return false;
    }

    // Validar valor mínimo
    if (rules.min && parseInt(value) < rules.min) {
      this.showFieldError(field, `Valor mínimo: ${rules.min}`);
      return false;
    }

    // Validar valor máximo
    if (rules.max && parseInt(value) > rules.max) {
      this.showFieldError(field, `Valor máximo: ${rules.max}`);
      return false;
    }

    this.clearFieldError(field);
    return true;
  }

  /**
   * Muestra error en un campo
   * @param {HTMLElement} field - Campo con error
   * @param {string} message - Mensaje de error
   */
  showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /**
   * Limpia error de un campo
   * @param {HTMLElement} field - Campo a limpiar
   */
  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
  }

  /**
   * Limpia todos los errores del formulario
   */
  clearAllErrors() {
    this.form.querySelectorAll('.form-group.error').forEach(group => {
      group.classList.remove('error');
    });
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Actualiza la barra de un atributo
   * @param {HTMLElement} input - Input del atributo
   */
  updateAttributeBar(input) {
    const value = parseInt(input.value) || 0;
    const bar = input.parentElement.querySelector('.attribute-fill');
    
    if (bar) {
      bar.style.width = `${value}%`;
    }
  }

  /**
   * Actualiza el visual de rating
   * @param {string} elementId - ID del elemento visual
   * @param {number} value - Valor del rating
   */
  updateRatingVisual(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = value;
    
    // Aplicar clase según el rating
    element.classList.remove('excellent', 'good', 'poor');
    if (value >= 80) {
      element.classList.add('excellent');
    } else if (value >= 70) {
      element.classList.add('good');
    } else if (value < 60) {
      element.classList.add('poor');
    }
  }

  /**
   * Muestra/oculta atributos específicos de portero
   * @param {string} position - Posición del jugador
   */
  toggleGoalkeeperAttributes(position) {
    const goalkeeperAttrs = this.modal.querySelector('.goalkeeper-attrs');
    if (goalkeeperAttrs) {
      goalkeeperAttrs.style.display = position === 'POR' ? 'block' : 'none';
    }
  }

  /**
   * Maneja la subida de archivos de imagen
   * @param {File} file - Archivo de imagen
   * @param {HTMLElement} preview - Elemento de preview
   */
  handleFileUpload(file, preview) {
    if (!file.type.startsWith('image/')) {
      this.showNotification('error', 'Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      this.showNotification('error', 'La imagen es demasiado grande (máximo 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Obtiene la URL de la foto actual
   * @returns {string} URL de la foto
   */
  getPhotoUrl() {
    const preview = document.getElementById('photoPreview');
    return preview ? preview.src : '../../img/players_icons/00000.png';
  }

  /**
   * Emite un evento personalizado relacionado con jugadores
   * @param {string} eventType - Tipo de evento
   * @param {Object} data - Datos del evento
   */
  dispatchPlayerEvent(eventType, data) {
    const event = new CustomEvent(eventType, {
      detail: data,
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Muestra una notificación
   * @param {string} type - Tipo de notificación (success, error, warning)
   * @param {string} message - Mensaje a mostrar
   */
  showNotification(type, message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : '!'}</span>
      <span class="notification-message">${message}</span>
    `;
    
    // Añadir estilos si no existen
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          max-width: 400px;
        }
        .notification-success { background: #4caf50; }
        .notification-error { background: #f44336; }
        .notification-warning { background: #ff9800; }
        .notification.show { transform: translateX(0); }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Mostrar y ocultar
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.PlayerManagement = new PlayerManagementModal();
});

export default PlayerManagementModal; 