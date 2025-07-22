/**
 * Clase PlayerDatabase - Sistema centralizado de gestión de jugadores
 * Maneja carga, persistencia, CRUD y búsquedas avanzadas
 */
class PlayerDatabase {
  constructor() {
    this.players = [];
    this.metadata = {};
    this.isLoaded = false;
    this.backupKey = 'andorra_players_backup';
    this.dbPath = '../../js/database/players.json';
  }

  /**
   * Carga la base de datos desde el archivo JSON
   * @returns {Promise<boolean>} True si la carga fue exitosa
   */
  async loadDatabase() {
    try {
      console.log('🔄 Iniciando carga de base de datos...');
      console.log(`📂 Path de la base de datos: ${this.dbPath}`);
      console.log(`🌐 URL actual: ${window.location.href}`);
      
      const response = await fetch(this.dbPath);
      console.log(`📡 Respuesta del fetch: Status ${response.status} - ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📄 Datos JSON parseados correctamente');
      console.log('🔍 Estructura de datos recibida:', {
        hasMetadata: !!data.metadata,
        hasPlayers: !!data.players,
        playersCount: data.players ? data.players.length : 0,
        metadataKeys: data.metadata ? Object.keys(data.metadata) : []
      });
      
      // Validar estructura básica
      if (!this.validateDatabaseStructure(data)) {
        console.error('❌ Estructura de base de datos inválida');
        console.log('🔍 Datos recibidos:', data);
        throw new Error('Estructura de base de datos inválida');
      }
      
      this.players = data.players || [];
      this.metadata = data.metadata || {};
      this.isLoaded = true;
      
      console.log('✅ Datos asignados correctamente:');
      console.log(`   📊 Total de jugadores: ${this.players.length}`);
      console.log(`   📋 Metadata versión: ${this.metadata.version}`);
      console.log(`   📅 Última actualización: ${this.metadata.lastUpdated}`);
      
      // Verificar algunos jugadores de ejemplo
      if (this.players.length > 0) {
        console.log('👤 Primeros 3 jugadores:');
        this.players.slice(0, 3).forEach((player, index) => {
          console.log(`   ${index + 1}. ${player.basicInfo.name} - ${player.basicInfo.position} - Rating: ${player.gameStats.rating}`);
        });
      }
      
      // Crear backup automático
      this.createBackup();
      console.log('💾 Backup automático creado');
      
      console.log('🎉 ¡Base de datos cargada exitosamente!');
      return true;
      
    } catch (error) {
      console.error('❌ Error detallado cargando base de datos:');
      console.error('   🔥 Tipo de error:', error.name);
      console.error('   📝 Mensaje:', error.message);
      console.error('   📍 Stack:', error.stack);
      console.error('   🌐 URL intentada:', this.dbPath);
      
      // Intentar cargar desde backup
      console.log('🔄 Intentando cargar desde backup local...');
      if (this.loadFromBackup()) {
        console.log('✅ Datos restaurados desde backup local');
        return true;
      }
      
      console.log('❌ No se pudo cargar desde backup, inicializando vacío');
      // Inicializar con datos vacíos si todo falla
      this.initializeEmpty();
      return false;
    }
  }

  /**
   * Guarda la base de datos (simulación para entorno web)
   * En producción se conectaría con backend
   */
  async saveDatabase() {
    try {
      const dataToSave = {
        metadata: {
          ...this.metadata,
          lastUpdated: new Date().toISOString().split('T')[0],
          totalPlayers: this.players.length,
          lastModified: new Date().toISOString()
        },
        players: this.players
      };
      
      // Validar antes de guardar
      if (!this.validateDatabaseStructure(dataToSave)) {
        throw new Error('Datos inválidos para guardar');
      }
      
      // Crear backup antes de modificar
      this.createBackup();
      
      // En un entorno real, aquí se haría una petición POST al servidor
      localStorage.setItem('andorra_players_main', JSON.stringify(dataToSave));
      
      console.log('✅ Base de datos guardada exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error guardando base de datos:', error);
      return false;
    }
  }

  /**
   * Añade un nuevo jugador a la base de datos
   * @param {Object} playerData - Datos del jugador
   * @returns {Object|null} Jugador creado o null si error
   */
  addPlayer(playerData) {
    try {
      // Validar datos obligatorios
      if (!this.validatePlayerData(playerData)) {
        throw new Error('Datos del jugador inválidos');
      }
      
      // Generar ID único si no existe
      if (!playerData.id) {
        playerData.id = this.generateUniqueId(playerData.basicInfo.name);
      }
      
      // Verificar que el ID no exista
      if (this.players.find(p => p.id === playerData.id)) {
        throw new Error('Ya existe un jugador con ese ID');
      }
      
      // Completar datos por defecto
      const completePlayer = this.fillDefaultValues(playerData);
      
      // Añadir a la lista
      this.players.push(completePlayer);
      
      console.log(`✅ Jugador añadido: ${completePlayer.basicInfo.name}`);
      return completePlayer;
      
    } catch (error) {
      console.error('❌ Error añadiendo jugador:', error);
      return null;
    }
  }

  /**
   * Actualiza un jugador existente
   * @param {string} playerId - ID del jugador
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|null} Jugador actualizado o null si error
   */
  updatePlayer(playerId, updates) {
    try {
      const playerIndex = this.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) {
        throw new Error('Jugador no encontrado');
      }
      
      // Hacer merge inteligente de los datos
      const updatedPlayer = this.mergePlayerData(this.players[playerIndex], updates);
      
      // Validar el jugador actualizado
      if (!this.validatePlayerData(updatedPlayer)) {
        throw new Error('Datos actualizados inválidos');
      }
      
      this.players[playerIndex] = updatedPlayer;
      
      console.log(`✅ Jugador actualizado: ${updatedPlayer.basicInfo.name}`);
      return updatedPlayer;
      
    } catch (error) {
      console.error('❌ Error actualizando jugador:', error);
      return null;
    }
  }

  /**
   * Elimina un jugador (soft delete)
   * @param {string} playerId - ID del jugador
   * @returns {boolean} True si se eliminó exitosamente
   */
  deletePlayer(playerId) {
    try {
      const playerIndex = this.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) {
        throw new Error('Jugador no encontrado');
      }
      
      const playerName = this.players[playerIndex].basicInfo.name;
      
      // Soft delete: marcar como inactivo
      this.players[playerIndex].status.isActive = false;
      this.players[playerIndex].status.deletedAt = new Date().toISOString();
      
      console.log(`🗑️ Jugador eliminado (soft): ${playerName}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error eliminando jugador:', error);
      return false;
    }
  }

  /**
   * Elimina un jugador permanentemente
   * @param {string} playerId - ID del jugador
   * @returns {boolean} True si se eliminó exitosamente
   */
  hardDeletePlayer(playerId) {
    try {
      const playerIndex = this.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) {
        throw new Error('Jugador no encontrado');
      }
      
      const playerName = this.players[playerIndex].basicInfo.name;
      this.players.splice(playerIndex, 1);
      
      console.log(`🗑️ Jugador eliminado (permanente): ${playerName}`);
      return true;
      
    } catch (error) {
      console.error('❌ Error eliminando jugador permanentemente:', error);
      return false;
    }
  }

  /**
   * Busca jugadores con filtros avanzados
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} Lista de jugadores que coinciden
   */
  searchPlayers(filters = {}) {
    try {
      let results = [...this.players];
      
      // Filtrar por estado activo por defecto
      if (filters.includeInactive !== true) {
        results = results.filter(p => p.status.isActive);
      }
      
      // Filtro por nombre (búsqueda parcial)
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        results = results.filter(p => 
          p.basicInfo.name.toLowerCase().includes(searchTerm) ||
          p.basicInfo.fullName.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filtro por posición
      if (filters.position) {
        results = results.filter(p => p.basicInfo.position === filters.position);
      }
      
      // Filtro por rango de rating
      if (filters.minRating || filters.maxRating) {
        results = results.filter(p => {
          const rating = p.gameStats.rating;
          return (!filters.minRating || rating >= filters.minRating) &&
                 (!filters.maxRating || rating <= filters.maxRating);
        });
      }
      
      // Filtro por rango de edad
      if (filters.minAge || filters.maxAge) {
        results = results.filter(p => {
          const age = p.basicInfo.age;
          return (!filters.minAge || age >= filters.minAge) &&
                 (!filters.maxAge || age <= filters.maxAge);
        });
      }
      
      // Filtro por nacionalidad
      if (filters.nationality) {
        results = results.filter(p => 
          p.basicInfo.nationality.toLowerCase().includes(filters.nationality.toLowerCase())
        );
      }
      
      // Filtro por importancia
      if (filters.importance) {
        results = results.filter(p => p.status.importance === filters.importance);
      }
      
      // Filtro por jugadores de cantera
      if (filters.youthOnly === true) {
        results = results.filter(p => p.status.isYouthPlayer);
      }
      
      // Filtro por jugadores cedidos
      if (filters.onLoanOnly === true) {
        results = results.filter(p => p.status.onLoan);
      }
      
      // Ordenamiento
      if (filters.sortBy) {
        results = this.sortPlayers(results, filters.sortBy, filters.sortOrder);
      }
      
      // Paginación
      if (filters.limit) {
        const start = (filters.page || 0) * filters.limit;
        results = results.slice(start, start + filters.limit);
      }
      
      return results;
      
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      return [];
    }
  }

  /**
   * Obtiene un jugador por ID
   * @param {string} playerId - ID del jugador
   * @returns {Object|null} Jugador encontrado o null
   */
  getPlayerById(playerId) {
    return this.players.find(p => p.id === playerId) || null;
  }

  /**
   * Obtiene estadísticas generales del equipo
   * @returns {Object} Estadísticas del equipo
   */
  getTeamStats() {
    const activePlayers = this.players.filter(p => p.status.isActive);
    
    if (activePlayers.length === 0) {
      return this.getEmptyTeamStats();
    }
    
    const totalRating = activePlayers.reduce((sum, p) => sum + p.gameStats.rating, 0);
    const avgRating = Math.round(totalRating / activePlayers.length);
    
    const positionCounts = activePlayers.reduce((counts, p) => {
      counts[p.basicInfo.position] = (counts[p.basicInfo.position] || 0) + 1;
      return counts;
    }, {});
    
    const avgAge = Math.round(
      activePlayers.reduce((sum, p) => sum + p.basicInfo.age, 0) / activePlayers.length
    );
    
    const totalValue = activePlayers.reduce((sum, p) => {
      const value = this.parseValueToNumber(p.gameStats.value);
      return sum + value;
    }, 0);
    
    return {
      totalPlayers: activePlayers.length,
      averageRating: avgRating,
      averageAge: avgAge,
      totalValue: this.formatValue(totalValue),
      positionBreakdown: positionCounts,
      youthPlayers: activePlayers.filter(p => p.status.isYouthPlayer).length,
      onLoanPlayers: activePlayers.filter(p => p.status.onLoan).length
    };
  }

  // ===== MÉTODOS PRIVADOS =====

  /**
   * Valida la estructura de la base de datos
   * @param {Object} data - Datos a validar
   * @returns {boolean} True si es válida
   */
  validateDatabaseStructure(data) {
    return data && 
           data.metadata && 
           Array.isArray(data.players) &&
           data.metadata.version;
  }

  /**
   * Valida los datos de un jugador
   * @param {Object} playerData - Datos del jugador
   * @returns {boolean} True si son válidos
   */
  validatePlayerData(playerData) {
    if (!playerData || !playerData.basicInfo) return false;
    
    const required = ['name', 'position', 'age'];
    return required.every(field => playerData.basicInfo[field] !== undefined);
  }

  /**
   * Genera un ID único para un jugador
   * @param {string} name - Nombre del jugador
   * @returns {string} ID único
   */
  generateUniqueId(name) {
    const timestamp = Date.now();
    const nameSlug = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 20);
    
    return `${nameSlug}_${timestamp}`;
  }

  /**
   * Completa valores por defecto para un jugador
   * @param {Object} playerData - Datos parciales del jugador
   * @returns {Object} Jugador con datos completos
   */
  fillDefaultValues(playerData) {
    const defaults = {
      basicInfo: {
        fullName: playerData.basicInfo.name,
        nationality: 'España',
        nationalityCode: 'ES',
        photoUrl: '../../img/players_icons/00000.png',
        dorsal: null
      },
      gameStats: {
        rating: 65,
        potential: 70,
        value: '1M',
        salary: '5K',
        contract: {
          years: 2,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      },
      attributes: {
        pace: 65,
        shooting: 65,
        passing: 65,
        dribbling: 65,
        defending: 65,
        physical: 65
      },
      seasonStats: {
        [new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)]: {
          appearances: 0,
          goals: 0,
          assists: 0,
          rating: 6.0,
          minutesPlayed: 0
        }
      },
      status: {
        isActive: true,
        isYouthPlayer: false,
        onLoan: false,
        transferListed: false,
        injured: false,
        importance: 'Rotación',
        form: 'Normal',
        preferredFoot: 'Derecha'
      }
    };
    
    return this.deepMerge(defaults, playerData);
  }

  /**
   * Hace merge inteligente de datos de jugador
   * @param {Object} existing - Datos existentes
   * @param {Object} updates - Actualizaciones
   * @returns {Object} Datos merged
   */
  mergePlayerData(existing, updates) {
    return this.deepMerge(existing, updates);
  }

  /**
   * Deep merge de objetos
   * @param {Object} target - Objeto objetivo
   * @param {Object} source - Objeto fuente
   * @returns {Object} Objeto combinado
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Ordena jugadores por criterio especificado
   * @param {Array} players - Lista de jugadores
   * @param {string} sortBy - Campo de ordenamiento
   * @param {string} sortOrder - 'asc' o 'desc'
   * @returns {Array} Lista ordenada
   */
  sortPlayers(players, sortBy, sortOrder = 'desc') {
    return players.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'rating':
          valueA = a.gameStats.rating;
          valueB = b.gameStats.rating;
          break;
        case 'age':
          valueA = a.basicInfo.age;
          valueB = b.basicInfo.age;
          break;
        case 'name':
          valueA = a.basicInfo.name.toLowerCase();
          valueB = b.basicInfo.name.toLowerCase();
          break;
        case 'value':
          valueA = this.parseValueToNumber(a.gameStats.value);
          valueB = this.parseValueToNumber(b.gameStats.value);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

  /**
   * Convierte valor de texto a número
   * @param {string} valueStr - Valor como string (ej: "32.5M")
   * @returns {number} Valor numérico
   */
  parseValueToNumber(valueStr) {
    if (!valueStr) return 0;
    
    const multipliers = { 'K': 1000, 'M': 1000000, 'B': 1000000000 };
    const match = valueStr.match(/^€?(\d+\.?\d*)(K|M|B)?$/);
    
    if (!match) return 0;
    
    const number = parseFloat(match[1]);
    const multiplier = multipliers[match[2]] || 1;
    
    return number * multiplier;
  }

  /**
   * Formatea valor numérico a string
   * @param {number} value - Valor numérico
   * @returns {string} Valor formateado
   */
  formatValue(value) {
    if (value >= 1000000000) {
      return `€${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    } else {
      return `€${value}`;
    }
  }

  /**
   * Crea backup en localStorage
   */
  createBackup() {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        players: this.players,
        metadata: this.metadata
      };
      
      localStorage.setItem(this.backupKey, JSON.stringify(backupData));
    } catch (error) {
      console.warn('⚠️ No se pudo crear backup:', error);
    }
  }

  /**
   * Carga datos desde backup
   * @returns {boolean} True si se cargó exitosamente
   */
  loadFromBackup() {
    try {
      console.log(`🔄 Intentando cargar backup desde localStorage key: ${this.backupKey}`);
      const backupData = localStorage.getItem(this.backupKey);
      
      if (!backupData) {
        console.log('❌ No se encontró backup en localStorage');
        return false;
      }
      
      console.log('📦 Backup encontrado, parseando datos...');
      const data = JSON.parse(backupData);
      
      console.log('🔍 Estructura del backup:', {
        hasPlayers: !!data.players,
        playersCount: data.players ? data.players.length : 0,
        hasMetadata: !!data.metadata,
        timestamp: data.timestamp
      });
      
      this.players = data.players || [];
      this.metadata = data.metadata || {};
      this.isLoaded = true;
      
      console.log(`✅ Backup cargado exitosamente: ${this.players.length} jugadores`);
      return true;
    } catch (error) {
      console.error('❌ Error cargando backup:', error);
      return false;
    }
  }

  /**
   * Inicializa con datos vacíos
   */
  initializeEmpty() {
    this.players = [];
    this.metadata = {
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      totalPlayers: 0,
      seasons: [new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)]
    };
    this.isLoaded = true;
  }

  /**
   * Obtiene estadísticas vacías del equipo
   * @returns {Object} Estadísticas por defecto
   */
  getEmptyTeamStats() {
    return {
      totalPlayers: 0,
      averageRating: 0,
      averageAge: 0,
      totalValue: '€0',
      positionBreakdown: {},
      youthPlayers: 0,
      onLoanPlayers: 0
    };
  }
}

// Crear instancia global
window.PlayerDB = new PlayerDatabase(); 