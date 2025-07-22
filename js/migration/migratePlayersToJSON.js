/**
 * Script de Migración - Convierte jugadores hardcodeados a JSON
 * Extrae datos de las tablas HTML existentes y genera el archivo JSON
 */

class PlayerMigration {
  constructor() {
    this.players = [];
    this.metadata = {
      version: "1.0",
      lastUpdated: "2025-01-22",
      totalPlayers: 0,
      seasons: ["2024-2025"]
    };
  }

  /**
   * Ejecuta la migración completa
   */
  async migrate() {
    console.log('🔄 Iniciando migración de jugadores...');
    
    try {
      this.extractPlayersFromDOM();
      this.generateMissingData();
      this.updateMetadata();
      
      const jsonOutput = {
        metadata: this.metadata,
        players: this.players
      };
      
      console.log('✅ Migración completada');
      console.log(`📊 ${this.players.length} jugadores migrados`);
      
      // Mostrar JSON para copiar/pegar
      this.displayMigrationResult(jsonOutput);
      
      return jsonOutput;
      
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      return null;
    }
  }

  /**
   * Extrae jugadores del DOM actual
   */
  extractPlayersFromDOM() {
    const playerRows = document.querySelectorAll('.jugadores-table tbody tr');
    
    playerRows.forEach((row, index) => {
      try {
        const player = this.extractPlayerFromRow(row, index);
        if (player) {
          this.players.push(player);
        }
      } catch (error) {
        console.warn(`⚠️ Error extrayendo jugador ${index + 1}:`, error);
      }
    });
  }

  /**
   * Extrae datos de un jugador desde una fila de tabla
   * @param {HTMLElement} row - Fila de la tabla
   * @param {number} index - Índice del jugador
   * @returns {Object|null} Datos del jugador
   */
  extractPlayerFromRow(row, index) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 8) return null;

    // Extraer datos básicos
    const dorsal = cells[0].textContent.trim();
    const position = cells[1].textContent.trim();
    
    // Datos del jugador (celda compleja)
    const playerCell = cells[2];
    const playerImg = playerCell.querySelector('.player-avatar');
    const playerName = playerCell.querySelector('.player-name')?.textContent.trim();
    const flagIcon = playerCell.querySelector('.flag-icon')?.textContent.trim();
    
    if (!playerName) return null;

    // Extraer rating
    const ratingElement = cells[3].querySelector('.rating');
    const rating = ratingElement ? 
      parseInt(ratingElement.textContent.trim()) : 65;

    // Otros datos
    const importance = cells[4].textContent.trim();
    const form = cells[5].textContent.trim();
    const value = cells[6].textContent.trim();
    const contract = cells[7].textContent.trim();
    const salary = cells[8] ? cells[8].textContent.trim() : '20K';

    // Generar ID único
    const playerId = this.generatePlayerId(playerName, index);

    // Determinar nacionalidad desde emoji
    const nationality = this.getNationalityFromFlag(flagIcon);
    const nationalityCode = this.getNationalityCode(nationality);

    return {
      id: playerId,
      basicInfo: {
        name: playerName,
        fullName: playerName,
        position: position,
        age: this.generateRealisticAge(position, rating),
        nationality: nationality,
        nationalityCode: nationalityCode,
        photoUrl: playerImg ? playerImg.src : '../../img/players_icons/00000.png',
        dorsal: dorsal !== '-' ? parseInt(dorsal) : null
      },
      gameStats: {
        rating: rating,
        potential: this.calculatePotential(rating, this.generateRealisticAge(position, rating)),
        value: value || '1M',
        salary: salary || '20K',
        contract: this.parseContract(contract)
      },
      attributes: this.generateAttributesFromRating(rating, position),
      seasonStats: {
        '2024-2025': this.generateSeasonStats(position, rating)
      },
      status: {
        isActive: true,
        isYouthPlayer: rating < 70 && importance === 'Promesa',
        onLoan: contract.includes('Cedido'),
        transferListed: false,
        injured: false,
        importance: importance || 'Rotación',
        form: form || 'Normal',
        preferredFoot: this.generatePreferredFoot()
      }
    };
  }

  /**
   * Genera ID único para un jugador
   * @param {string} name - Nombre del jugador
   * @param {number} index - Índice
   * @returns {string} ID único
   */
  generatePlayerId(name, index) {
    const cleanName = name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 20);
    
    return `${cleanName}_${String(index + 1).padStart(3, '0')}`;
  }

  /**
   * Obtiene nacionalidad desde emoji de bandera
   * @param {string} flagEmoji - Emoji de bandera
   * @returns {string} Nombre del país
   */
  getNationalityFromFlag(flagEmoji) {
    const flagMap = {
      '🇪🇸': 'España',
      '🇫🇷': 'Francia',
      '🇵🇹': 'Portugal',
      '🇧🇷': 'Brasil',
      '🇦🇷': 'Argentina',
      '🇮🇹': 'Italia',
      '🇩🇪': 'Alemania',
      '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'Inglaterra',
      '🇳🇱': 'Países Bajos',
      '🇰🇷': 'Corea del Sur',
      '🇬🇭': 'Ghana',
      '🇲🇦': 'Marruecos',
      '🇨🇴': 'Colombia',
      '🇭🇺': 'Hungría',
      '🇨🇻': 'Cabo Verde',
      '🇨🇲': 'Camerún',
      '🇨🇱': 'Chile',
      '🇩🇰': 'Dinamarca',
      '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'Escocia'
    };
    
    return flagMap[flagEmoji] || 'España';
  }

  /**
   * Obtiene código de nacionalidad
   * @param {string} nationality - Nombre del país
   * @returns {string} Código de 2 letras
   */
  getNationalityCode(nationality) {
    const codeMap = {
      'España': 'ES',
      'Francia': 'FR',
      'Portugal': 'PT',
      'Brasil': 'BR',
      'Argentina': 'AR',
      'Italia': 'IT',
      'Alemania': 'DE',
      'Inglaterra': 'GB',
      'Países Bajos': 'NL',
      'Corea del Sur': 'KR',
      'Ghana': 'GH',
      'Marruecos': 'MA',
      'Colombia': 'CO',
      'Hungría': 'HU',
      'Cabo Verde': 'CV',
      'Camerún': 'CM',
      'Chile': 'CL',
      'Dinamarca': 'DK',
      'Escocia': 'GB'
    };
    
    return codeMap[nationality] || 'ES';
  }

  /**
   * Genera edad realista basada en posición y rating
   * @param {string} position - Posición del jugador
   * @param {number} rating - Rating del jugador
   * @returns {number} Edad generada
   */
  generateRealisticAge(position, rating) {
    let baseAge = 25;
    
    // Ajustar por rating
    if (rating >= 85) baseAge = 27;
    else if (rating >= 80) baseAge = 26;
    else if (rating >= 75) baseAge = 24;
    else if (rating >= 70) baseAge = 23;
    else baseAge = 21;
    
    // Ajustar por posición
    if (position === 'POR') baseAge += 2;
    else if (['DFC', 'MCD'].includes(position)) baseAge += 1;
    
    // Añadir variación aleatoria
    return baseAge + Math.floor(Math.random() * 6) - 3;
  }

  /**
   * Calcula potencial basado en rating y edad
   * @param {number} rating - Rating actual
   * @param {number} age - Edad del jugador
   * @returns {number} Potencial calculado
   */
  calculatePotential(rating, age) {
    let potential = rating;
    
    if (age <= 21) potential += 8;
    else if (age <= 24) potential += 5;
    else if (age <= 27) potential += 2;
    else if (age <= 30) potential += 1;
    
    return Math.min(potential, 95);
  }

  /**
   * Genera atributos basados en rating y posición
   * @param {number} rating - Rating del jugador
   * @param {string} position - Posición del jugador
   * @returns {Object} Atributos generados
   */
  generateAttributesFromRating(rating, position) {
    const baseAttributes = {
      pace: rating - 10 + Math.floor(Math.random() * 10),
      shooting: rating - 15 + Math.floor(Math.random() * 10),
      passing: rating - 5 + Math.floor(Math.random() * 10),
      dribbling: rating - 10 + Math.floor(Math.random() * 10),
      defending: rating - 15 + Math.floor(Math.random() * 10),
      physical: rating - 5 + Math.floor(Math.random() * 10)
    };

    // Ajustar por posición
    switch (position) {
      case 'POR':
        return {
          ...baseAttributes,
          pace: Math.max(30, rating - 30),
          shooting: Math.max(15, rating - 50),
          defending: rating,
          estiradas: rating + Math.floor(Math.random() * 5) - 2,
          paradas: rating + Math.floor(Math.random() * 5) - 2,
          saque: rating + Math.floor(Math.random() * 10) - 5,
          reflejos: rating + Math.floor(Math.random() * 5) - 2,
          colocacion: rating + Math.floor(Math.random() * 5) - 2
        };
      case 'DFC':
        baseAttributes.defending = rating + 5;
        baseAttributes.physical = rating + 3;
        baseAttributes.pace = Math.max(40, rating - 15);
        baseAttributes.shooting = Math.max(25, rating - 30);
        break;
      case 'MC':
        baseAttributes.passing = rating + 5;
        baseAttributes.dribbling = rating + 3;
        break;
      case 'DC':
        baseAttributes.shooting = rating + 5;
        baseAttributes.physical = rating + 3;
        baseAttributes.defending = Math.max(30, rating - 20);
        break;
    }

    // Asegurar valores válidos
    Object.keys(baseAttributes).forEach(key => {
      baseAttributes[key] = Math.max(1, Math.min(99, baseAttributes[key]));
    });

    return baseAttributes;
  }

  /**
   * Genera estadísticas de temporada
   * @param {string} position - Posición del jugador
   * @param {number} rating - Rating del jugador
   * @returns {Object} Estadísticas de temporada
   */
  generateSeasonStats(position, rating) {
    const isAttacker = ['DC', 'SD', 'EI', 'ED'].includes(position);
    const isMidfielder = ['MC', 'MCO', 'MI', 'MD'].includes(position);
    
    const appearances = Math.floor(Math.random() * 25) + 15;
    const minutesPlayed = appearances * (60 + Math.floor(Math.random() * 30));
    
    let goals = 0;
    let assists = 0;
    
    if (isAttacker) {
      goals = Math.floor(Math.random() * 15) + 5;
      assists = Math.floor(Math.random() * 8) + 2;
    } else if (isMidfielder) {
      goals = Math.floor(Math.random() * 8) + 1;
      assists = Math.floor(Math.random() * 12) + 3;
    } else {
      goals = Math.floor(Math.random() * 3);
      assists = Math.floor(Math.random() * 5);
    }
    
    return {
      appearances,
      goals,
      assists,
      rating: (rating / 10) - 1 + (Math.random() * 0.4),
      minutesPlayed
    };
  }

  /**
   * Parsea información de contrato
   * @param {string} contractText - Texto del contrato
   * @returns {Object} Datos del contrato
   */
  parseContract(contractText) {
    const currentYear = new Date().getFullYear();
    let startYear = currentYear - 1;
    let endYear = currentYear + 2;
    let years = 3;
    
    // Intentar extraer años del texto
    const yearMatch = contractText.match(/(\d{4})\s*~\s*(\d{4})/);
    if (yearMatch) {
      startYear = parseInt(yearMatch[1]);
      endYear = parseInt(yearMatch[2]);
      years = endYear - startYear;
    }
    
    return {
      years: years,
      startDate: `${startYear}-07-01`,
      endDate: `${endYear}-06-30`
    };
  }

  /**
   * Genera pie hábil aleatorio
   * @returns {string} Pie preferido
   */
  generatePreferredFoot() {
    const options = ['Derecha', 'Izquierda', 'Ambidiestro'];
    const weights = [0.7, 0.25, 0.05]; // Probabilidades
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < options.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return options[i];
      }
    }
    
    return 'Derecha';
  }

  /**
   * Genera datos faltantes de forma inteligente
   */
  generateMissingData() {
    this.players.forEach(player => {
      // Verificar y completar datos faltantes
      if (!player.basicInfo.age || player.basicInfo.age < 15) {
        player.basicInfo.age = this.generateRealisticAge(
          player.basicInfo.position, 
          player.gameStats.rating
        );
      }
      
      if (!player.gameStats.potential) {
        player.gameStats.potential = this.calculatePotential(
          player.gameStats.rating, 
          player.basicInfo.age
        );
      }
    });
  }

  /**
   * Actualiza metadata
   */
  updateMetadata() {
    this.metadata.totalPlayers = this.players.length;
    this.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    this.metadata.lastModified = new Date().toISOString();
  }

  /**
   * Muestra el resultado de la migración
   * @param {Object} jsonOutput - Datos JSON generados
   */
  displayMigrationResult(jsonOutput) {
    // Crear modal con resultado
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
      align-items: center; justify-content: center; padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: #2d2d2d; color: white; padding: 20px; border-radius: 10px;
      max-width: 80%; max-height: 80%; overflow: auto;
    `;
    
    content.innerHTML = `
      <h2>✅ Migración Completada</h2>
      <p><strong>${this.players.length} jugadores</strong> migrados exitosamente</p>
      <p>Copia el siguiente JSON y pégalo en <code>js/database/players.json</code>:</p>
      <textarea style="width: 100%; height: 300px; background: #1a1a1a; color: #00ff00; font-family: monospace; padding: 10px;">
${JSON.stringify(jsonOutput, null, 2)}
      </textarea>
      <div style="margin-top: 20px;">
        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                style="background: #0066cc; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Cerrar
        </button>
        <button onclick="navigator.clipboard.writeText(this.previousElementSibling.previousElementSibling.value); alert('JSON copiado al portapapeles!')"
                style="background: #4caf50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
          Copiar JSON
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
  }
}

// Función de utilidad para ejecutar migración desde consola
window.migratePlayersToJSON = function() {
  const migration = new PlayerMigration();
  return migration.migrate();
};

// Auto-ejecutar si estamos en la página de jugadores
if (window.location.pathname.includes('jugadores.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    // Añadir botón de migración (solo para desarrollo)
    const button = document.createElement('button');
    button.textContent = '🔄 Migrar Jugadores a JSON';
    button.style.cssText = `
      position: fixed; top: 10px; right: 10px; z-index: 1000;
      background: #ff9800; color: white; border: none; padding: 10px;
      border-radius: 5px; cursor: pointer; font-size: 12px;
    `;
    button.onclick = () => window.migratePlayersToJSON();
    document.body.appendChild(button);
  });
}

// PlayerMigration disponible globalmente 