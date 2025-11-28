// Configuration
const API_URL = 'http://localhost:8000';

// Global state
let dashboardData = null;
let allPredictions = [];
let filteredPredictions = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadDashboardData();
    setInterval(loadDashboardData, 60000); // Auto-refresh every 60 seconds
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            switchSection(section);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update page title
        const titles = {
            'overview': 'Dashboard Overview',
            'predictions': 'All Predictions',
            'analytics': 'Analytics & Insights',
            'statistics': 'Detailed Statistics'
        };
        document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';
        
        // Load section-specific data
        if (sectionName === 'predictions') {
            loadAllPredictions();
        } else if (sectionName === 'analytics') {
            renderAnalytics();
        } else if (sectionName === 'statistics') {
            loadStatistics();
        }
    }
}

// Load dashboard data
async function loadDashboardData() {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/admin/dashboard`);
        dashboardData = await response.json();
        
        updateOverviewStats();
        renderPredictionsChart();
        renderSuccessRateChart();
        renderRecentPredictions();
        updateLastUpdated();
        
        showToast('Dashboard updated successfully', 'success');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
    } finally {
        showLoading(false);
    }
}

function refreshDashboard() {
    loadDashboardData();
    if (document.getElementById('predictions-section').classList.contains('active')) {
        loadAllPredictions();
    }
}

// Update overview statistics
function updateOverviewStats() {
    if (!dashboardData) return;
    
    document.getElementById('total-predictions').textContent = dashboardData.total_predictions || 0;
    document.getElementById('today-predictions').textContent = dashboardData.predictions_today || 0;
    document.getElementById('new-business-count').textContent = dashboardData.new_business_predictions || 0;
    document.getElementById('new-business-rate').textContent = `${dashboardData.success_rate_new || 0}% success rate`;
    document.getElementById('existing-business-count').textContent = dashboardData.existing_business_predictions || 0;
    document.getElementById('existing-business-rate').textContent = `${dashboardData.success_rate_existing || 0}% success rate`;
}

// Render predictions chart
function renderPredictionsChart() {
    if (!dashboardData || !dashboardData.predictions_by_date) return;
    
    const chartContainer = document.getElementById('predictions-chart');
    const data = dashboardData.predictions_by_date;
    
    if (Object.keys(data).length === 0) {
        chartContainer.innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><p>No data available</p></div>';
        return;
    }
    
    const maxValue = Math.max(...Object.values(data));
    
    let html = '<div class="bar-chart">';
    for (const [date, count] of Object.entries(data)) {
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
        html += `
            <div class="bar-item">
                <div class="bar-label">${date}</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${percentage}%">${count}</div>
                </div>
            </div>
        `;
    }
    html += '</div>';
    
    chartContainer.innerHTML = html;
}

// Render success rate chart
function renderSuccessRateChart() {
    if (!dashboardData) return;
    
    const chartContainer = document.getElementById('success-rate-chart');
    
    const newRate = dashboardData.success_rate_new || 0;
    const existingRate = dashboardData.success_rate_existing || 0;
    
    const html = `
        <div class="bar-chart">
            <div class="bar-item">
                <div class="bar-label">New Business</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${newRate}%">${newRate.toFixed(1)}%</div>
                </div>
            </div>
            <div class="bar-item">
                <div class="bar-label">Existing Business</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${existingRate}%">${existingRate.toFixed(1)}%</div>
                </div>
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = html;
}

// Render recent predictions
function renderRecentPredictions() {
    if (!dashboardData || !dashboardData.recent_predictions) return;
    
    const container = document.getElementById('recent-predictions-list');
    const predictions = dashboardData.recent_predictions.slice(0, 5);
    
    if (predictions.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No predictions yet</p></div>';
        return;
    }
    
    container.innerHTML = predictions.map(pred => createPredictionHTML(pred)).join('');
}

// Load all predictions
async function loadAllPredictions() {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/admin/predictions?limit=100`);
        const data = await response.json();
        allPredictions = data.predictions || [];
        filteredPredictions = [...allPredictions];
        renderAllPredictions();
    } catch (error) {
        console.error('Error loading predictions:', error);
        showToast('Failed to load predictions', 'error');
    } finally {
        showLoading(false);
    }
}

function renderAllPredictions() {
    const container = document.getElementById('all-predictions-list');
    
    if (filteredPredictions.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No predictions found</h3><p>Try adjusting your filters</p></div>';
        return;
    }
    
    container.innerHTML = filteredPredictions.map(pred => createPredictionHTML(pred, true)).join('');
}

function createPredictionHTML(prediction, detailed = false) {
    const isNewBusiness = prediction.prediction_type === 'new_business';
    const result = prediction.prediction_result;
    const isSuccess = isNewBusiness ? result.prediction === 1 : result.prediction === 'Success';
    
    const probability = (result.success_probability * 100).toFixed(1);
    const timestamp = new Date(prediction.timestamp).toLocaleString();
    
    return `
        <div class="prediction-item ${isSuccess ? 'success' : 'failure'}">
            <div class="prediction-info">
                <div class="prediction-badges">
                    <span class="badge ${isNewBusiness ? 'new-business' : 'existing-business'}">
                        ${isNewBusiness ? 'New Business' : 'Existing Business'}
                    </span>
                    <span class="badge ${isSuccess ? 'success' : 'failure'}">
                        ${isSuccess ? 'Success' : 'Failure'}
                    </span>
                </div>
                <div class="prediction-details">
                    <strong>ID:</strong> ${prediction.id} • 
                    ${isNewBusiness && result.confidence_level ? `<strong>Confidence:</strong> ${result.confidence_level} • ` : ''}
                    <strong>Time:</strong> ${timestamp}
                </div>
            </div>
            <div class="prediction-meta">
                <div class="probability">${probability}%</div>
                <div class="timestamp">Probability</div>
            </div>
        </div>
    `;
}

function filterPredictions() {
    const filterValue = document.getElementById('prediction-filter').value;
    
    if (filterValue === 'all') {
        filteredPredictions = [...allPredictions];
    } else {
        filteredPredictions = allPredictions.filter(pred => pred.prediction_type === filterValue);
    }
    
    renderAllPredictions();
}

function searchPredictions() {
    const searchTerm = document.getElementById('search-predictions').value.toLowerCase();
    const filterValue = document.getElementById('prediction-filter').value;
    
    filteredPredictions = allPredictions.filter(pred => {
        const matchesFilter = filterValue === 'all' || pred.prediction_type === filterValue;
        const matchesSearch = searchTerm === '' || 
            pred.id.toString().includes(searchTerm) ||
            pred.prediction_type.includes(searchTerm) ||
            JSON.stringify(pred.prediction_result).toLowerCase().includes(searchTerm);
        
        return matchesFilter && matchesSearch;
    });
    
    renderAllPredictions();
}

// Load and render statistics
async function loadStatistics() {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/admin/stats`);
        const stats = await response.json();
        renderStatistics(stats);
    } catch (error) {
        console.error('Error loading statistics:', error);
        showToast('Failed to load statistics', 'error');
    } finally {
        showLoading(false);
    }
}

function renderStatistics(stats) {
    if (!stats || !stats.statistics) return;
    
    // New business statistics
    const newBusiness = stats.statistics.new_business;
    const newBusinessHTML = `
        <div class="stat-row">
            <label>Total Predictions</label>
            <span>${newBusiness.total}</span>
        </div>
        <div class="stat-row">
            <label>Successful</label>
            <span style="color: var(--success-color)">${newBusiness.successful}</span>
        </div>
        <div class="stat-row">
            <label>Unsuccessful</label>
            <span style="color: var(--danger-color)">${newBusiness.unsuccessful}</span>
        </div>
        <div class="stat-row">
            <label>Avg Success Probability</label>
            <span>${(newBusiness.avg_success_probability * 100).toFixed(2)}%</span>
        </div>
        <div class="stat-row">
            <label>High Confidence</label>
            <span>${newBusiness.high_confidence}</span>
        </div>
        <div class="stat-row">
            <label>Medium Confidence</label>
            <span>${newBusiness.medium_confidence}</span>
        </div>
        <div class="stat-row">
            <label>Low Confidence</label>
            <span>${newBusiness.low_confidence}</span>
        </div>
    `;
    
    // Existing business statistics
    const existingBusiness = stats.statistics.existing_business;
    const existingBusinessHTML = `
        <div class="stat-row">
            <label>Total Predictions</label>
            <span>${existingBusiness.total}</span>
        </div>
        <div class="stat-row">
            <label>Successful</label>
            <span style="color: var(--success-color)">${existingBusiness.successful}</span>
        </div>
        <div class="stat-row">
            <label>Unsuccessful</label>
            <span style="color: var(--danger-color)">${existingBusiness.unsuccessful}</span>
        </div>
        <div class="stat-row">
            <label>Avg Success Probability</label>
            <span>${(existingBusiness.avg_success_probability * 100).toFixed(2)}%</span>
        </div>
        <div class="stat-row">
            <label>Avg Confidence</label>
            <span>${(existingBusiness.avg_confidence * 100).toFixed(2)}%</span>
        </div>
    `;
    
    document.getElementById('new-business-stats').innerHTML = newBusinessHTML;
    document.getElementById('existing-business-stats').innerHTML = existingBusinessHTML;
    
    // Detailed metrics
    const metricsHTML = `
        <div class="metric-item">
            <h4>Total Predictions</h4>
            <p>${stats.total_predictions}</p>
        </div>
        <div class="metric-item">
            <h4>Success Rate</h4>
            <p>${((newBusiness.successful + existingBusiness.successful) / stats.total_predictions * 100).toFixed(1)}%</p>
        </div>
        <div class="metric-item">
            <h4>New Business Rate</h4>
            <p>${(newBusiness.total / stats.total_predictions * 100).toFixed(1)}%</p>
        </div>
        <div class="metric-item">
            <h4>Existing Business Rate</h4>
            <p>${(existingBusiness.total / stats.total_predictions * 100).toFixed(1)}%</p>
        </div>
    `;
    
    document.getElementById('detailed-metrics').innerHTML = metricsHTML;
}

// Render analytics
function renderAnalytics() {
    if (!dashboardData) return;
    
    // Render trend chart (same as predictions chart)
    const trendContainer = document.getElementById('trend-chart');
    if (dashboardData.predictions_by_date) {
        const data = dashboardData.predictions_by_date;
        const maxValue = Math.max(...Object.values(data));
        
        let html = '<div class="bar-chart">';
        for (const [date, count] of Object.entries(data)) {
            const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
            html += `
                <div class="bar-item">
                    <div class="bar-label">${date}</div>
                    <div class="bar-wrapper">
                        <div class="bar-fill" style="width: ${percentage}%">${count}</div>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        trendContainer.innerHTML = html;
    }
    
    // Render distribution pie chart
    renderDistributionChart();
    
    // Render confidence chart
    if (allPredictions.length > 0) {
        renderConfidenceChart();
    }
}

function renderDistributionChart() {
    const canvas = document.getElementById('distribution-pie');
    const ctx = canvas.getContext('2d');
    
    const newCount = dashboardData.new_business_predictions || 0;
    const existingCount = dashboardData.existing_business_predictions || 0;
    const total = newCount + existingCount;
    
    if (total === 0) {
        document.getElementById('distribution-chart').innerHTML = '<div class="empty-state"><i class="fas fa-chart-pie"></i><p>No data available</p></div>';
        return;
    }
    
    // Draw pie chart
    canvas.width = 250;
    canvas.height = 250;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    const newAngle = (newCount / total) * 2 * Math.PI;
    
    // New Business slice
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, newAngle);
    ctx.closePath();
    ctx.fill();
    
    // Existing Business slice
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, newAngle, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
    // Legend
    const legendHTML = `
        <div class="legend-item">
            <div style="display: flex; align-items: center;">
                <div class="legend-color" style="background: #3b82f6;"></div>
                New Business
            </div>
            <strong>${newCount} (${((newCount/total)*100).toFixed(1)}%)</strong>
        </div>
        <div class="legend-item">
            <div style="display: flex; align-items: center;">
                <div class="legend-color" style="background: #8b5cf6;"></div>
                Existing Business
            </div>
            <strong>${existingCount} (${((existingCount/total)*100).toFixed(1)}%)</strong>
        </div>
    `;
    
    document.getElementById('pie-legend').innerHTML = legendHTML;
}

function renderConfidenceChart() {
    const newBusinessPredictions = allPredictions.filter(p => p.prediction_type === 'new_business');
    
    const high = newBusinessPredictions.filter(p => p.prediction_result.confidence_level === 'High').length;
    const medium = newBusinessPredictions.filter(p => p.prediction_result.confidence_level === 'Medium').length;
    const low = newBusinessPredictions.filter(p => p.prediction_result.confidence_level === 'Low').length;
    const total = high + medium + low;
    
    if (total === 0) {
        document.getElementById('confidence-chart').innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><p>No confidence data available</p></div>';
        return;
    }
    
    const html = `
        <div class="bar-chart">
            <div class="bar-item">
                <div class="bar-label">High Confidence</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${(high/total)*100}%; background: var(--success-color);">${high}</div>
                </div>
            </div>
            <div class="bar-item">
                <div class="bar-label">Medium Confidence</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${(medium/total)*100}%; background: var(--warning-color);">${medium}</div>
                </div>
            </div>
            <div class="bar-item">
                <div class="bar-label">Low Confidence</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${(low/total)*100}%; background: var(--danger-color);">${low}</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('confidence-chart').innerHTML = html;
}

// Utility functions
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateLastUpdated() {
    const now = new Date().toLocaleString();
    document.getElementById('last-updated').textContent = now;
}
