// Datos de la tabla de posiciones
const leagueTableData = [
    { position: 1, team: 'Barcelona', logo: '../../img/teams_logo/barcelona.jpg', points: 24, played: 9, wins: 8, draws: 0, losses: 1, goalsFor: 20, goalsAgainst: 8, form: ['V', 'E', 'V', 'V', 'V'], competition: 'champions-league' },
    { position: 2, team: 'Valencia CF', logo: '../../img/teams_logo/valencia.jpg', points: 23, played: 9, wins: 7, draws: 2, losses: 0, goalsFor: 17, goalsAgainst: 5, form: ['V', 'V', 'D', 'V', 'E'], competition: 'champions-league' },
    { position: 3, team: 'Atlético de Madrid', logo: '../../img/teams_logo/atletico.jpg', points: 21, played: 9, wins: 6, draws: 3, losses: 0, goalsFor: 17, goalsAgainst: 7, form: ['V', 'E', 'D', 'D', 'V'], competition: 'champions-league' },
    { position: 4, team: 'Sevilla FC', logo: '../../img/teams_logo/sevilla.jpg', points: 17, played: 9, wins: 5, draws: 2, losses: 2, goalsFor: 21, goalsAgainst: 13, form: ['V', 'D', 'D', 'E', 'D'], competition: 'champions-league' },
    { position: 5, team: 'Real Madrid', logo: '../../img/teams_logo/madrid.jpg', points: 17, played: 9, wins: 5, draws: 2, losses: 2, goalsFor: 19, goalsAgainst: 11, form: ['D', 'V', 'V', 'V', 'D'], competition: 'europa-league' },
    { position: 6, team: 'Athletic Club', logo: '../../img/teams_logo/bilbao.jpg', points: 16, played: 9, wins: 4, draws: 4, losses: 1, goalsFor: 14, goalsAgainst: 12, form: ['V', 'E', 'E', 'V', 'E'], competition: 'conference-league' },
    { position: 7, team: 'Real Sociedad', logo: '../../img/teams_logo/realsociedad.jpg', points: 14, played: 9, wins: 4, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 15, form: ['V', 'D', 'E', 'V', 'D'] },
    { position: 8, team: 'FC Andorra', logo: '../../img/teams_logo/andorra.jpg', points: 13, played: 9, wins: 4, draws: 1, losses: 4, goalsFor: 19, goalsAgainst: 22, form: ['V', 'D', 'E', 'D', 'D'] },
    { position: 9, team: 'Real Betis', logo: '../../img/teams_logo/betis.jpg', points: 12, played: 9, wins: 3, draws: 3, losses: 3, goalsFor: 16, goalsAgainst: 12, form: ['D', 'E', 'V', 'V', 'V'] },
    { position: 10, team: 'Girona FC', logo: '../../img/teams_logo/girona.jpg', points: 12, played: 9, wins: 3, draws: 3, losses: 3, goalsFor: 11, goalsAgainst: 10, form: ['D', 'D', 'V', 'E', 'D'] },
    { position: 11, team: 'Villarreal CF', logo: '../../img/teams_logo/villareal.jpg', points: 12, played: 9, wins: 3, draws: 3, losses: 3, goalsFor: 16, goalsAgainst: 16, form: ['V', 'E', 'V', 'D', 'D'] },
    { position: 12, team: 'CA Osasuna', logo: '../../img/teams_logo/osasuna.jpg', points: 12, played: 9, wins: 4, draws: 0, losses: 5, goalsFor: 15, goalsAgainst: 17, form: ['D', 'V', 'E', 'D', 'V'] },
    { position: 13, team: 'D. Alavés', logo: '../../img/teams_logo/alaves.jpg', points: 9, played: 9, wins: 2, draws: 3, losses: 4, goalsFor: 14, goalsAgainst: 16, form: ['D', 'V', 'D', 'E', 'D'] },
    { position: 14, team: 'Rayo Vallecano', logo: '../../img/teams_logo/rayo.jpg', points: 9, played: 9, wins: 2, draws: 3, losses: 4, goalsFor: 7, goalsAgainst: 12, form: ['D', 'D', 'V', 'E', 'D'] },
    { position: 15, team: 'RCD Mallorca', logo: '../../img/teams_logo/mallorca.jpg', points: 8, played: 9, wins: 2, draws: 2, losses: 5, goalsFor: 11, goalsAgainst: 15, form: ['V', 'D', 'E', 'V', 'D'] },
    { position: 16, team: 'RC Celta', logo: '../../img/teams_logo/celta.jpg', points: 8, played: 9, wins: 1, draws: 5, losses: 3, goalsFor: 11, goalsAgainst: 17, form: ['E', 'D', 'V', 'D', 'D'] },
    { position: 17, team: 'Granada CF', logo: '../../img/teams_logo/granada.jpg', points: 7, played: 9, wins: 1, draws: 4, losses: 4, goalsFor: 10, goalsAgainst: 15, form: ['D', 'D', 'D', 'E', 'D'], competition: 'relegation' },
    { position: 18, team: 'Levante UD', logo: '../../img/teams_logo/levante.jpg', points: 7, played: 9, wins: 2, draws: 1, losses: 6, goalsFor: 9, goalsAgainst: 21, form: ['D', 'D', 'D', 'D', 'D'], competition: 'relegation' },
    { position: 19, team: 'Getafe CF', logo: '../../img/teams_logo/getafe.jpg', points: 4, played: 9, wins: 1, draws: 1, losses: 7, goalsFor: 14, goalsAgainst: 21, form: ['D', 'V', 'D', 'V', 'E'], competition: 'relegation' },
    { position: 20, team: 'UD Almería', logo: '../../img/teams_logo/almeria.jpg', points: 2, played: 9, wins: 0, draws: 2, losses: 7, goalsFor: 11, goalsAgainst: 22, form: ['D', 'D', 'D', 'D', 'D'], competition: 'relegation' }
];

// Últimos resultados
const recentResults = [
    { date: '25/10', home: 'Celta', homeLogo: '../../img/teams_logo/celta.jpg', homeScore: '-', away: 'Andorra FC', awayLogo: '../../img/teams_logo/andorra.jpg', awayScore: '-', status: 'Próximo' },
    { date: '25/10', home: 'Athletic', homeLogo: '../../img/teams_logo/bilbao.jpg', homeScore: '-', away: 'Levante', awayLogo: '../../img/teams_logo/levante.jpg', awayScore: '-', status: 'Próximo' },
    { date: '25/10', home: 'Getafe', homeLogo: '../../img/teams_logo/getafe.jpg', homeScore: '-', away: 'Rayo Vallecano', awayLogo: '../../img/teams_logo/rayo.jpg', awayScore: '-', status: 'Próximo' },
    { date: '25/10', home: 'Barcelona', homeLogo: '../../img/teams_logo/barcelona.jpg', homeScore: '-', away: 'Granada', awayLogo: '../../img/teams_logo/granada.jpg', awayScore: '-', status: 'Próximo' },
    { date: '25/10', home: 'Osasuna', homeLogo: '../../img/teams_logo/osasuna.jpg', homeScore: '-', away: 'Girona', awayLogo: '../../img/teams_logo/girona.jpg', awayScore: '-', status: 'Próximo' },
    { date: '25/10', home: 'Betis', homeLogo: '../../img/teams_logo/betis.jpg', homeScore: '-', away: 'Valencia', awayLogo: '../../img/teams_logo/valencia.jpg', awayScore: '-', status: 'Próximo' }
];

// Datos de partidos por jornada
const matchesByMatchday = {
    '8': [
        { date: 'Viernes 13/10', home: 'Sevilla FC', homeLogo: '../../img/teams_logo/sevilla.jpg', homeScore: '1', away: 'Barcelona', awayLogo: '../../img/teams_logo/barcelona.jpg', awayScore: '2', status: 'Final' },
        { date: 'Sábado 14/10', home: 'Getafe CF', homeLogo: '../../img/teams_logo/getafe.jpg', homeScore: '0', away: 'Athletic Club', awayLogo: '../../img/teams_logo/bilbao.jpg', awayScore: '2', status: 'Final' },
        { date: 'Sábado 14/10', home: 'FC Andorra', homeLogo: '../../img/teams_logo/andorra.jpg', homeScore: '2', away: 'Girona FC', awayLogo: '../../img/teams_logo/girona.jpg', awayScore: '0', status: 'Final' },
        { date: 'Sábado 14/10', home: 'Real Madrid', homeLogo: '../../img/teams_logo/madrid.jpg', homeScore: '4', away: 'CA Osasuna', awayLogo: '../../img/teams_logo/osasuna.jpg', awayScore: '0', status: 'Final' },
        { date: 'Domingo 15/10', home: 'Atlético de Madrid', homeLogo: '../../img/teams_logo/atletico.jpg', homeScore: '1', away: 'Real Sociedad', awayLogo: '../../img/teams_logo/realsociedad.jpg', awayScore: '1', status: 'Final' },
        { date: 'Domingo 15/10', home: 'Granada CF', homeLogo: '../../img/teams_logo/granada.jpg', homeScore: '2', away: 'Levante UD', awayLogo: '../../img/teams_logo/levante.jpg', awayScore: '2', status: 'Final' },
        { date: 'Domingo 15/10', home: 'Valencia CF', homeLogo: '../../img/teams_logo/valencia.jpg', homeScore: '2', away: 'Villarreal CF', awayLogo: '../../img/teams_logo/villareal.jpg', awayScore: '0', status: 'Final' },
        { date: 'Lunes 16/10', home: 'UD Almería', homeLogo: '../../img/teams_logo/almeria.jpg', homeScore: '1', away: 'Real Betis', awayLogo: '../../img/teams_logo/betis.jpg', awayScore: '2', status: 'Final' }
    ],
    '9': [
        { date: 'Viernes 20/10', home: 'Sevilla FC', homeLogo: '../../img/teams_logo/sevilla.jpg', homeScore: '2', away: 'Getafe CF', awayLogo: '../../img/teams_logo/getafe.jpg', awayScore: '1', status: 'Final' },
        { date: 'Sábado 21/10', home: 'Barcelona', homeLogo: '../../img/teams_logo/barcelona.jpg', homeScore: '3', away: 'Levante UD', awayLogo: '../../img/teams_logo/levante.jpg', awayScore: '0', status: 'Final' },
        { date: 'Sábado 21/10', home: 'Valencia CF', homeLogo: '../../img/teams_logo/valencia.jpg', homeScore: '2', away: 'RC Celta', awayLogo: '../../img/teams_logo/celta.jpg', awayScore: '0', status: 'Final' },
        { date: 'Sábado 21/10', home: 'FC Andorra', homeLogo: '../../img/teams_logo/andorra.jpg', homeScore: '1', away: 'Real Madrid', awayLogo: '../../img/teams_logo/madrid.jpg', awayScore: '1', status: 'Final' },
        { date: 'Domingo 22/10', home: 'Atlético de Madrid', homeLogo: '../../img/teams_logo/atletico.jpg', homeScore: '3', away: 'Real Betis', awayLogo: '../../img/teams_logo/betis.jpg', awayScore: '1', status: 'Final' },
        { date: 'Domingo 22/10', home: 'Athletic Club', homeLogo: '../../img/teams_logo/bilbao.jpg', homeScore: '2', away: 'UD Almería', awayLogo: '../../img/teams_logo/almeria.jpg', awayScore: '0', status: 'Final' },
        { date: 'Domingo 22/10', home: 'Real Sociedad', homeLogo: '../../img/teams_logo/realsociedad.jpg', homeScore: '2', away: 'CA Osasuna', awayLogo: '../../img/teams_logo/osasuna.jpg', awayScore: '2', status: 'Final' },
        { date: 'Lunes 23/10', home: 'Villarreal CF', homeLogo: '../../img/teams_logo/villareal.jpg', homeScore: '2', away: 'Rayo Vallecano', awayLogo: '../../img/teams_logo/rayo.jpg', awayScore: '1', status: 'Final' },
        { date: 'Lunes 23/10', home: 'Girona FC', homeLogo: '../../img/teams_logo/girona.jpg', homeScore: '3', away: 'Granada CF', awayLogo: '../../img/teams_logo/granada.jpg', awayScore: '0', status: 'Final' }
    ],
    '10': [
        { date: 'Viernes 27/10', home: 'UD Almería', homeLogo: '../../img/teams_logo/almeria.jpg', homeScore: '-', away: 'FC Andorra', awayLogo: '../../img/teams_logo/andorra.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Sábado 28/10', home: 'CA Osasuna', homeLogo: '../../img/teams_logo/osasuna.jpg', homeScore: '-', away: 'Barcelona', awayLogo: '../../img/teams_logo/barcelona.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Sábado 28/10', home: 'RC Celta', homeLogo: '../../img/teams_logo/celta.jpg', homeScore: '-', away: 'Atlético de Madrid', awayLogo: '../../img/teams_logo/atletico.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Sábado 28/10', home: 'Getafe CF', homeLogo: '../../img/teams_logo/getafe.jpg', homeScore: '-', away: 'Girona FC', awayLogo: '../../img/teams_logo/girona.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Domingo 29/10', home: 'Real Madrid', homeLogo: '../../img/teams_logo/madrid.jpg', homeScore: '-', away: 'Valencia CF', awayLogo: '../../img/teams_logo/valencia.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Domingo 29/10', home: 'Rayo Vallecano', homeLogo: '../../img/teams_logo/rayo.jpg', homeScore: '-', away: 'Real Sociedad', awayLogo: '../../img/teams_logo/realsociedad.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Domingo 29/10', home: 'Granada CF', homeLogo: '../../img/teams_logo/granada.jpg', homeScore: '-', away: 'Sevilla FC', awayLogo: '../../img/teams_logo/sevilla.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Lunes 30/10', home: 'Levante UD', homeLogo: '../../img/teams_logo/levante.jpg', homeScore: '-', away: 'Athletic Club', awayLogo: '../../img/teams_logo/bilbao.jpg', awayScore: '-', status: 'Próximo' },
        { date: 'Lunes 30/10', home: 'Real Betis', homeLogo: '../../img/teams_logo/betis.jpg', homeScore: '-', away: 'Villarreal CF', awayLogo: '../../img/teams_logo/villareal.jpg', awayScore: '-', status: 'Próximo' }
    ]
};

// Jornada actual para mostrar
let currentMatchday = '9';

// Función para renderizar la tabla de posiciones
function renderLeagueTable() {
    const tbody = document.querySelector('.league-table tbody');
    tbody.innerHTML = '';

    leagueTableData.forEach(team => {
        const row = document.createElement('tr');
        if (team.competition) {
            row.classList.add(team.competition);
        }
        if (team.team === 'Andorra FC') {
            row.setAttribute('data-team', 'Andorra FC');
        }
        row.innerHTML = `
            <td>${team.position}</td>
            <td>
                <div class="team-info">
                    <img src="${team.logo}" alt="${team.team}" class="team-logo">
                    <span class="team-name">${team.team}</span>
                </div>
            </td>
            <td>${team.points}</td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
            <td>${team.goalsFor - team.goalsAgainst}</td>
            <td>${team.form.map(result => `<span class="form-result ${result.toLowerCase()}">${result}</span>`).join('')}</td>
        `;
        tbody.appendChild(row);
    });

    // Add competition legend
    const legendHTML = `
        <div class="competitions-legend">
            <div class="legend-item">
                <span class="legend-color champions"></span>
                <span>Champions League</span>
            </div>
            <div class="legend-item">
                <span class="legend-color europa"></span>
                <span>Europa League</span>
            </div>
            <div class="legend-item">
                <span class="legend-color conference"></span>
                <span>Conference League</span>
            </div>
            <div class="legend-item">
                <span class="legend-color relegation"></span>
                <span>Descenso</span>
            </div>
        </div>
    `;
    
    const tableContainer = document.querySelector('.table-container');
    tableContainer.insertAdjacentHTML('afterend', legendHTML);
}

// Función para renderizar los partidos de la jornada
function renderMatchdayResults() {
    const container = document.querySelector('.matchday-container');
    if (!container) return;
    
    container.innerHTML = '';

    // Mostrar los partidos de la jornada actual
    const currentMatchdayMatches = matchesByMatchday[currentMatchday] || [];
    
    // Agrupar partidos por día
    const matchesByDay = {};
    
    currentMatchdayMatches.forEach(match => {
        const dayMatch = match.date.split(' ')[0]; // Extrae 'Viernes', 'Sábado', etc.
        if (!matchesByDay[dayMatch]) {
            matchesByDay[dayMatch] = [];
        }
        matchesByDay[dayMatch].push(match);
    });
    
    // Orden específico de los días
    const dayOrder = ['Viernes', 'Sábado', 'Domingo', 'Lunes'];
    
    // Renderizar partidos agrupados por día
    dayOrder.forEach(day => {
        if (matchesByDay[day] && matchesByDay[day].length > 0) {
            // Crear grupo de día
            const dayGroup = document.createElement('div');
            dayGroup.className = 'matchday-day-group';
            
            // Crear encabezado del día
            const dayHeader = document.createElement('div');
            dayHeader.className = 'matchday-day-header';
            // Obtener la fecha del primer partido de ese día (ejemplo: '20/10')
            const dayDate = matchesByDay[day][0].date.split(' ')[1];
            dayHeader.textContent = `${day} ${dayDate}`;
            dayGroup.appendChild(dayHeader);
            
            // Agregar los partidos de ese día
            matchesByDay[day].forEach(match => {
        const matchElement = document.createElement('div');
                matchElement.className = 'match-item';
        matchElement.innerHTML = `
            <div class="match-teams">
                <div class="team home">
                    <img src="${match.homeLogo}" alt="${match.home}" class="team-logo">
                    <span>${match.home}</span>
                </div>
                        <div class="score">${match.homeScore} - ${match.awayScore}</div>
                <div class="team away">
                    <img src="${match.awayLogo}" alt="${match.away}" class="team-logo">
                    <span>${match.away}</span>
                </div>
            </div>
                `;
                dayGroup.appendChild(matchElement);
            });
            
            container.appendChild(dayGroup);
        }
    });

    // Actualizar el número de jornada en el título
    const matchdayNumber = document.getElementById('matchday-number');
    if (matchdayNumber) {
        matchdayNumber.textContent = currentMatchday;
    }
}

// Función para cambiar a la jornada anterior
function prevMatchday() {
    const matchdays = Object.keys(matchesByMatchday);
    let currentIndex = matchdays.indexOf(currentMatchday);
    
    if (currentIndex > 0) {
        currentMatchday = matchdays[currentIndex - 1];
    } else {
        currentMatchday = matchdays[matchdays.length - 1]; // Volver a la última jornada si estamos en la primera
    }
    
    renderMatchdayResults();
}

// Función para cambiar a la jornada siguiente
function nextMatchday() {
    const matchdays = Object.keys(matchesByMatchday);
    let currentIndex = matchdays.indexOf(currentMatchday);
    
    if (currentIndex < matchdays.length - 1) {
        currentMatchday = matchdays[currentIndex + 1];
    } else {
        currentMatchday = matchdays[0]; // Volver a la primera jornada si estamos en la última
    }
    
    renderMatchdayResults();
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    renderLeagueTable();
    renderMatchdayResults();
    
    // Agregar eventos a los botones de navegación
    const prevButton = document.getElementById('prev-matchday');
    const nextButton = document.getElementById('next-matchday');
    
    if (prevButton) {
        prevButton.addEventListener('click', prevMatchday);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextMatchday);
    }
    
}); 