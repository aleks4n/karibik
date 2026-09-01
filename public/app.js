// Initialize the map
const map = L.map('map').setView([15, -60], 4);

// Add tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 1,
    zoom: 4
}).addTo(map);

// Store initial view
const initialLat = 15;
const initialLng = -60;
const initialZoom = 4;

// Search for a city or island and move the map to the first result.
const locationSearch = document.getElementById('locationSearch');
const locationQuery = document.getElementById('locationQuery');
const searchLocationBtn = document.getElementById('searchLocation');

locationSearch.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = locationQuery.value.trim();
    if (!query) return;

    searchLocationBtn.disabled = true;
    searchLocationBtn.textContent = 'Searching…';

    try {
        const params = new URLSearchParams({
            q: query,
            format: 'jsonv2',
            limit: '1'
        });
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);

        if (!response.ok) {
            throw new Error(`Location search failed with status ${response.status}`);
        }

        const results = await response.json();
        if (results.length === 0) {
            alert(`No location found for “${query}”.`);
            return;
        }

        const result = results[0];
        const bounds = result.boundingbox.map(Number);
        map.fitBounds([
            [bounds[0], bounds[2]],
            [bounds[1], bounds[3]]
        ], { maxZoom: 12, padding: [30, 30] });
    } catch (error) {
        console.error('Location search error:', error);
        alert('The location search is temporarily unavailable. Please try again.');
    } finally {
        searchLocationBtn.disabled = false;
        searchLocationBtn.textContent = '🔎 Search';
    }
});

// Path storage and creation state
let paths = [];
let isCreatingPath = false;
let pathPoints = [];
let currentPathColor = '#FF6B6B';
let drawnLines = [];
let drawnMarkers = [];
let wachtfuehrerMembers = [];
let crewMembers = [];
let pathsRef = null;
let drawnPathsMap = new Map();

// Initialize Firebase and load paths immediately
function initializeApp() {
    // Wait for Firebase to be initialized
    if (
        typeof firebase === 'undefined' ||
        !firebase.apps ||
        firebase.apps.length === 0
    ) {
        console.warn('⏳ Firebase not ready yet, retrying...');
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Get database reference
    const database = firebase.database();
    pathsRef = database.ref('shared/paths');
    
    // Load existing paths
    loadPathsFromFirebase();
    
    // Listen for real-time updates
    setupRealtimeListener();
    
    console.log('✅ Connected to shared Firebase database');
}

// Initialize on page load
initializeApp();

// Load paths from Firebase
function loadPathsFromFirebase() {
    if (!pathsRef) return;
    
    pathsRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            paths = Object.values(data);
            paths.forEach(path => {
                if (!drawnPathsMap.has(path.id)) {
                    drawPath(path);
                }
            });
            console.log(`Loaded ${paths.length} path(s) from Firebase`);
        }
    }).catch(error => {
        console.error('Error loading paths:', error);
    });
}

// Set up real-time listener
function setupRealtimeListener() {
    if (!pathsRef) return;
    
    // Listen for new paths
    pathsRef.on('child_added', (snapshot) => {
        const path = snapshot.val();
        if (path && !drawnPathsMap.has(path.id)) {
            paths.push(path);
            drawPath(path);
            console.log('New path added:', path.title);
        }
    });
    
    // Listen for removed paths
    pathsRef.on('child_removed', (snapshot) => {
        const path = snapshot.val();
        if (path) {
            paths = paths.filter(p => p.id !== path.id);
            removePath(path.id);
            console.log('Path removed:', path.title);
        }
    });
    
    // Listen for updated paths
    pathsRef.on('child_changed', (snapshot) => {
        const path = snapshot.val();
        if (path) {
            const index = paths.findIndex(p => p.id === path.id);
            if (index !== -1) {
                paths[index] = path;
            }
            removePath(path.id);
            drawPath(path);
            console.log('Path updated:', path.title);
        }
    });
}

// Save path to Firebase
function savePathToFirebase(newPath) {
    if (!pathsRef) return;
    
    pathsRef.child(newPath.id).set(newPath)
        .then(() => {
            console.log('Path saved to Firebase');
        })
        .catch(error => {
            console.error('Error saving path:', error);
            alert('Error saving path to Firebase');
        });
}

// Delete path from Firebase
function deletePathFromFirebase(pathId) {
    if (!pathsRef) return;
    
    pathsRef.child(pathId).remove()
        .then(() => {
            console.log('Path deleted from Firebase');
        })
        .catch(error => {
            console.error('Error deleting path:', error);
        });
}

// DOM Elements
const modal = document.getElementById('pathModal');
const closeBtn = document.querySelector('.close');
const createPathBtn = document.getElementById('createPath');
const pathForm = document.getElementById('pathForm');

// Add person functions
function addPersonField(listId, type) {
    const list = document.getElementById(listId);
    const personDiv = document.createElement('div');
    personDiv.className = 'person-input';
    personDiv.innerHTML = `
        <input type="text" placeholder="Enter ${type} name" class="person-field">
        <button type="button" class="remove-person-btn" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(personDiv);
    personDiv.querySelector('input').focus();
}

// Modal Functions
function openModal() {
    modal.classList.add('show');
    // Add one empty field for each if not already present
    if (document.getElementById('wachtfuehrerList').children.length === 0) {
        addPersonField('wachtfuehrerList', 'Wachführer');
    }
    if (document.getElementById('crewList').children.length === 0) {
        addPersonField('crewList', 'Crew member');
    }
}

function closeModal() {
    modal.classList.remove('show');
    isCreatingPath = false;
    pathPoints = [];
    drawnLines.forEach(line => map.removeLayer(line));
    drawnLines = [];
    drawnMarkers.forEach(marker => map.removeLayer(marker));
    drawnMarkers = [];
    map.dragging.enable();
    // Clear dynamic lists
    document.getElementById('wachtfuehrerList').innerHTML = '';
    document.getElementById('crewList').innerHTML = '';
    // Add one empty field for each
    addPersonField('wachtfuehrerList', 'Wachführer');
    addPersonField('crewList', 'Crew member');
}

closeBtn.addEventListener('click', closeModal);
createPathBtn.addEventListener('click', () => {
    isCreatingPath = true;
    pathPoints = [];
    drawnLines = [];
    map.dragging.disable();
    alert('Click on the map to select start point, then end point');
});

// Add Wachführer button
document.getElementById('addWachtfuehrer').addEventListener('click', (e) => {
    e.preventDefault();
    addPersonField('wachtfuehrerList', 'Wachführer');
});

// Add Crew button
document.getElementById('addCrew').addEventListener('click', (e) => {
    e.preventDefault();
    addPersonField('crewList', 'Crew member');
});

// Path Form Submission
pathForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (pathPoints.length !== 2) {
        alert('Please select exactly 2 points on the map (start and end)');
        return;
    }
    
    // Collect wachführer names
    const wachtfuehrerInputs = document.querySelectorAll('#wachtfuehrerList input');
    const wachtfuehrerList = Array.from(wachtfuehrerInputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');
    
    // Collect crew names
    const crewInputs = document.querySelectorAll('#crewList input');
    const crewList = Array.from(crewInputs)
        .map(input => input.value.trim())
        .filter(name => name !== '');
    
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    // Format dates for display
    const startDateStr = startDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    const endDateStr = endDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const newPath = {
        id: Date.now(),
        title: document.getElementById('pathTitle').value.trim(),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        dateRangeDisplay: `${startDateStr} - ${endDateStr}`,
        skipper: document.getElementById('skipper').value.trim(),
        wachtfuehrer: wachtfuehrerList,
        crew: crewList,
        color: document.getElementById('pathColor').value,
        startPoint: pathPoints[0],
        endPoint: pathPoints[1]
    };
    
    paths.push(newPath);
    drawPath(newPath);
    savePathToFirebase(newPath);
    closeModal();
    pathForm.reset();
    document.getElementById('pathColor').value = '#FF6B6B';
    wachtfuehrerMembers = [];
    crewMembers = [];
    document.getElementById('wachtfuehrerList').innerHTML = '';
    document.getElementById('crewList').innerHTML = '';
});

// Draw path on map
function drawPath(pathData) {
    const line = L.polyline([pathData.startPoint, pathData.endPoint], {
        color: pathData.color,
        weight: 4,
        opacity: 0.8
    }).addTo(map);
    
    const wachtfuehrerStr = Array.isArray(pathData.wachtfuehrer) 
        ? pathData.wachtfuehrer.join(', ') 
        : pathData.wachtfuehrer;
    const crewStr = Array.isArray(pathData.crew) 
        ? pathData.crew.join(', ') 
        : pathData.crew;
    
    const optionalDetails = [
        pathData.skipper
            ? `<small><strong>Skipper:</strong> ${pathData.skipper}</small>`
            : '',
        wachtfuehrerStr
            ? `<small><strong>Wachführer:</strong> ${wachtfuehrerStr}</small>`
            : '',
        crewStr
            ? `<small><strong>Crew:</strong> ${crewStr}</small>`
            : ''
    ].filter(Boolean).join('<br>');

    const popupContent = `
        <div class="path-popup">
            <strong>${pathData.title}</strong><br>
            <small><strong>Dates:</strong> ${pathData.dateRangeDisplay}</small>
            ${optionalDetails ? `<br>${optionalDetails}` : ''}<br>
            <button class="delete-path-btn" data-id="${pathData.id}" style="margin-top: 8px; width: 100%; padding: 4px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">Delete Path</button>
        </div>
    `;
    
    line.bindPopup(popupContent);
    
    // Show popup on hover
    line.on('mouseover', function() {
        this.openPopup();
        this.setStyle({ weight: 6, opacity: 1 });
    });
    
    line.on('mouseout', function() {
        this.setStyle({ weight: 4, opacity: 0.8 });
    });
    
    line.on('click', function() {
        this.openPopup();
    });
    
    // Store reference to the drawn path
    drawnPathsMap.set(pathData.id, line);
}

// Remove path from map
function removePath(pathId) {
    const line = drawnPathsMap.get(pathId);
    if (line) {
        map.removeLayer(line);
        drawnPathsMap.delete(pathId);
    }
}

// Map click to select path points
map.on('click', (e) => {
    if (isCreatingPath && pathPoints.length < 2) {
        pathPoints.push(e.latlng);
        
        // Draw marker
        const marker = L.circleMarker(e.latlng, {
            radius: 8,
            color: '#2c3e50',
            fillColor: pathPoints.length === 1 ? '#27ae60' : '#e74c3c',
            fillOpacity: 0.8,
            weight: 2
        }).addTo(map);
        drawnMarkers.push(marker);
        
        // If we have 2 points, draw line preview and open modal
        if (pathPoints.length === 2) {
            const previewLine = L.polyline([pathPoints[0], pathPoints[1]], {
                color: document.getElementById('pathColor').value || '#FF6B6B',
                weight: 3,
                dashArray: '5, 5',
                opacity: 0.6
            }).addTo(map);
            
            drawnLines.push(previewLine);
            
            // Open modal for details
            openModal();
        }
    }
});

// Zoom Controls
document.getElementById('zoomIn').addEventListener('click', () => {
    map.zoomIn();
});

document.getElementById('zoomOut').addEventListener('click', () => {
    map.zoomOut();
});

document.getElementById('reset').addEventListener('click', () => {
    map.setView([initialLat, initialLng], initialZoom);
});

document.getElementById('clearAll').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete ALL paths? This cannot be undone.')) {
        if (pathsRef) {
            pathsRef.remove().then(() => {
                paths = [];
                drawnPathsMap.forEach(line => map.removeLayer(line));
                drawnPathsMap.clear();
            }).catch(error => console.error('Error clearing paths:', error));
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isCreatingPath) {
            closeModal();
        }
    } else if (!isCreatingPath && !modal.classList.contains('show')) {
        switch(e.key) {
            case '+':
            case '=':
                map.zoomIn();
                break;
            case '-':
            case '_':
                map.zoomOut();
                break;
            case 'h':
            case 'H':
                map.setView([initialLat, initialLng], initialZoom);
                break;
        }
    }
});

// Add scale control
L.control.scale().addTo(map);

// Custom popup styling
const style = document.createElement('style');
style.textContent = `
    .path-popup {
        font-size: 12px;
        line-height: 1.5;
    }
    .path-popup strong {
        color: #2c3e50;
    }
    .path-popup small {
        color: #555;
    }
    .leaflet-popup-content {
        margin: 8px;
    }
`;
document.head.appendChild(style);

// Handle delete button clicks in popups
map.on('popupopen', function() {
    const deleteBtn = document.querySelector('.delete-path-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const pathId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this path?')) {
                deletePathFromFirebase(pathId);
            }
        });
    }
});

console.log('⛵ Karibik Saison loaded with Firebase!');
console.log('Waiting for authentication...');

// Force redeploy
