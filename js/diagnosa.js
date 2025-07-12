/**
 * Diagnosa functionality using Certainty Factor method
 */

// import { dataService } from './data.js';

const diagnosaService = {
    // Selected gejala with their CF values
    selectedGejala: {},
    
    // Confidence levels for dropdown
    confidenceLevels: [
        { value: 1.0, label: 'Sangat Yakin (1.0)' },
        { value: 0.8, label: 'Yakin (0.8)' },
        { value: 0.6, label: 'Cukup Yakin (0.6)' },
        { value: 0.4, label: 'Sedikit Yakin (0.4)' },
        { value: 0.2, label: 'Tidak Yakin (0.2)' },
        { value: 0, label: 'Ragu-ragu (0)' },
    ],
    
    // Initialize diagnosa functionality
    initialize: function() {
        console.log('Initializing diagnosa service...');
        this.loadGejalaForDiagnosa();
        this.setupEventListeners();
        console.log('Diagnosa service initialized successfully');
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Process diagnosa button
        const prosesDiagnosaBtn = document.getElementById('proses-diagnosa');
        if (prosesDiagnosaBtn) {
            prosesDiagnosaBtn.addEventListener('click', this.processDiagnosa.bind(this));
        }
        
        // Reset diagnosa button
        const resetDiagnosaBtn = document.getElementById('reset-diagnosa');
        if (resetDiagnosaBtn) {
            resetDiagnosaBtn.addEventListener('click', this.resetDiagnosa.bind(this));
        }
        
        // Search functionality
        const searchDiagnosaGejala = document.getElementById('search-diagnosa-gejala');
        if (searchDiagnosaGejala) {
            searchDiagnosaGejala.addEventListener('input', this.handleDiagnosaGejalaSearch.bind(this));
        }
    },
    
    // Load gejala for diagnosa
    loadGejalaForDiagnosa: function() {
        const gejalaList = document.getElementById('diagnosa-gejala-list');
        if (!gejalaList || typeof dataService === 'undefined') return;
        
        const gejalaData = dataService.getAllGejala();
        
        gejalaList.innerHTML = '';
        
        gejalaData.forEach(gejala => {
            const row = document.createElement('tr');
            
            // Create confidence dropdown
            const confidenceSelect = document.createElement('select');
            confidenceSelect.className = 'keyakinan-select';
            confidenceSelect.id = `keyakinan-${gejala.kode}`;
            confidenceSelect.disabled = true;
            
            this.confidenceLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = level.value;
                option.textContent = level.label;
                confidenceSelect.appendChild(option);
            });
            
            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `gejala-${gejala.kode}`;
            checkbox.dataset.kode = gejala.kode;
            checkbox.className = 'gejala-checkbox';
            
            // Add event listener to checkbox
            checkbox.addEventListener('change', (e) => {
                const konfidensSelect = document.getElementById(`keyakinan-${gejala.kode}`);
                konfidensSelect.disabled = !e.target.checked;
                
                if (e.target.checked) {
                    this.selectedGejala[gejala.kode] = parseFloat(konfidensSelect.value);
                    
                    // Add event listener to confidence select
                    konfidensSelect.addEventListener('change', (e) => {
                        this.selectedGejala[gejala.kode] = parseFloat(e.target.value);
                    });
                } else {
                    delete this.selectedGejala[gejala.kode];
                }
            });
            
            // Create cells
            const checkboxCell = document.createElement('td');
            checkboxCell.appendChild(checkbox);
            
            const kodeCell = document.createElement('td');
            kodeCell.textContent = gejala.kode;
            
            const deskripsiCell = document.createElement('td');
            deskripsiCell.textContent = gejala.deskripsi;
            
            const confidenceCell = document.createElement('td');
            confidenceCell.appendChild(confidenceSelect);
            
            // Add cells to row
            row.appendChild(checkboxCell);
            row.appendChild(kodeCell);
            row.appendChild(deskripsiCell);
            row.appendChild(confidenceCell);
            
            gejalaList.appendChild(row);
        });
    },
    
    // Process diagnosa
    processDiagnosa: function() {
        // Check if any gejala selected
        if (Object.keys(this.selectedGejala).length === 0) {
            alert('Silakan pilih minimal satu gejala untuk diagnosa.');
            return;
        }
        
        // Get all kerusakan
        const allKerusakan = dataService.getAllKerusakan();
        const allRules = dataService.getAllRules();
        
        // Calculate CF for each kerusakan
        const results = [];
        
        allKerusakan.forEach(kerusakan => {
            // Get rules for this kerusakan
            const kerusakanRules = allRules.filter(rule => rule.kode_kerusakan === kerusakan.kode);
            
            // Check if any selected gejala match with this kerusakan's rules
            const matchingRules = kerusakanRules.filter(rule => 
                Object.keys(this.selectedGejala).includes(rule.kode_gejala)
            );
            
            // If no matching rules, skip this kerusakan
            if (matchingRules.length === 0) return;
            
            // Calculate CF for each matching rule
            const cfValues = [];
            const matchedGejala = [];
            
            matchingRules.forEach(rule => {
                const userCF = this.selectedGejala[rule.kode_gejala];
                const expertCF = rule.mb - rule.md; // CF = MB - MD
                const ruleCF = userCF * expertCF;
                
                cfValues.push(ruleCF);
                
                // Store matched gejala for display
                const gejala = dataService.getGejalaByKode(rule.kode_gejala);
                matchedGejala.push({
                    kode: gejala.kode,
                    deskripsi: gejala.deskripsi,
                    userCF: userCF,
                    expertCF: expertCF,
                    ruleCF: ruleCF
                });
            });
            
            // Calculate combined CF using combination rule
            let combinedCF = cfValues[0];
            
            for (let i = 1; i < cfValues.length; i++) {
                combinedCF = combinedCF + cfValues[i] * (1 - combinedCF);
            }
            
            // Convert to percentage
            const percentage = (combinedCF * 100).toFixed(2);
            
            // Add to results if CF is greater than 0
            if (combinedCF > 0) {
                results.push({
                    kerusakan: kerusakan,
                    cf: combinedCF,
                    percentage: percentage,
                    matchedGejala: matchedGejala
                });
            }
        });
        
        // Sort results by CF in descending order
        results.sort((a, b) => b.cf - a.cf);
        
        // Display results
        this.displayResults(results);
    },
    
    // Display diagnosa results
    displayResults: function(results) {
        const hasilContainer = document.getElementById('hasil-diagnosa');
        const hasilContent = document.getElementById('hasil-diagnosa-content');
        
        if (!hasilContainer || !hasilContent) return;
        
        // Show hasil container
        hasilContainer.style.display = 'block';
        
        // Clear previous results
        hasilContent.innerHTML = '';
        
        // If no results found
        if (results.length === 0) {
            hasilContent.innerHTML = `
                <div class="no-results">
                    <p>Tidak ditemukan kerusakan yang sesuai dengan gejala yang dipilih.</p>
                    <p>Silakan pilih gejala lain atau konsultasikan dengan teknisi.</p>
                </div>
            `;
            return;
        }
        
        // Add intro text
        const introText = document.createElement('p');
        introText.textContent = 'Berdasarkan gejala yang dipilih, berikut adalah kemungkinan kerusakan pada Vespa Excel Anda:';
        introText.style.marginBottom = '20px';
        hasilContent.appendChild(introText);
        
        // Display each result
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'hasil-item';
            
            // Kerusakan header with percentage
            const kerusakanHeader = document.createElement('div');
            kerusakanHeader.className = 'hasil-kerusakan';
            kerusakanHeader.innerHTML = `
                <span>${index + 1}. ${result.kerusakan.kode} - ${result.kerusakan.deskripsi}</span>
                <span class="hasil-persentase">${result.percentage}%</span>
            `;
            
            // Gejala list
            const gejalaList = document.createElement('ul');
            result.matchedGejala.forEach(gejala => {
                const gejalaItem = document.createElement('li');
                gejalaItem.textContent = `${gejala.kode} - ${gejala.deskripsi}`;
                gejalaList.appendChild(gejalaItem);
            });
            
            // Add elements to result item
            resultItem.appendChild(kerusakanHeader);
            resultItem.appendChild(gejalaList);
            
            // Add result item to container
            hasilContent.appendChild(resultItem);
        });
        
        // Add conclusion
        const conclusion = document.createElement('p');
        conclusion.style.marginTop = '20px';
        conclusion.style.fontWeight = 'bold';
        conclusion.textContent = `Diagnosa tertinggi: ${results[0].kerusakan.deskripsi} (${results[0].percentage}%)`;
        hasilContent.appendChild(conclusion);
        
        // Scroll to results
        hasilContainer.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Reset diagnosa
    resetDiagnosa: function() {
        // Clear selected gejala
        this.selectedGejala = {};
        
        // Reset form
        const checkboxes = document.querySelectorAll('.gejala-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            
            const konfidensSelect = document.getElementById(`keyakinan-${checkbox.dataset.kode}`);
            if (konfidensSelect) {
                konfidensSelect.disabled = true;
                konfidensSelect.selectedIndex = 0;
            }
        });
        
        // Hide results
        const hasilDiagnosa = document.getElementById('hasil-diagnosa');
        if (hasilDiagnosa) {
            hasilDiagnosa.style.display = 'none';
        }
    },
    
    // Handle diagnosa gejala search
    handleDiagnosaGejalaSearch: function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#diagnosa-gejala-list tr');
        
        rows.forEach(row => {
            const kode = row.cells[1].textContent.toLowerCase();
            const deskripsi = row.cells[2].textContent.toLowerCase();
            
            if (kode.includes(searchTerm) || deskripsi.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
};

// Make diagnosaService globally available