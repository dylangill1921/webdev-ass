export class StatisticsManager {
    constructor() {
        this.storageKey = 'harmonyHubStats';
        this.volunteerStorageKey = 'harmonyHubVolunteers';
        this.stats = this.loadStats();
        this.volunteers = this.loadVolunteers();
        this.attachToWindow();
        // Initialize charts if we're on the statistics page
        if (window.location.hash === '#/statistics') {
            this.setupCharts();
        }
        // Add route change listener to reinitialize charts when needed
        window.addEventListener('hashchange', () => {
            if (window.location.hash === '#/statistics') {
                // Small delay to ensure DOM is ready
                setTimeout(() => this.setupCharts(), 100);
            }
        });
        // Track initial page visit
        this.trackPageVisit(window.location.hash || '/');
    }
    static getInstance() {
        if (!StatisticsManager.instance) {
            StatisticsManager.instance = new StatisticsManager();
        }
        return StatisticsManager.instance;
    }
    loadStats() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            }
            catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        return {};
    }
    loadVolunteers() {
        const stored = localStorage.getItem(this.volunteerStorageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            }
            catch (error) {
                console.error('Error loading volunteers:', error);
            }
        }
        return [];
    }
    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
        // Only update UI and charts if we're on the statistics page
        if (window.location.hash === '#/statistics') {
            console.log('Updating statistics display');
            this.updateUI();
            this.updateCharts();
        }
    }
    saveVolunteers() {
        localStorage.setItem(this.volunteerStorageKey, JSON.stringify(this.volunteers));
    }
    getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }
    ensureTodayStats() {
        const today = this.getTodayKey();
        if (!this.stats[today]) {
            this.stats[today] = {
                visits: 0,
                volunteers: 0,
                members: 0
            };
        }
    }
    setupCharts() {
        // Destroy existing charts if they exist
        if (this.visitsChart) {
            this.visitsChart.destroy();
        }
        if (this.volunteerChart) {
            this.volunteerChart.destroy();
        }
        if (this.memberChart) {
            this.memberChart.destroy();
        }
        const chartConfig = (label, color) => ({
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                        label: label,
                        data: [],
                        fill: true,
                        borderColor: color,
                        backgroundColor: `${color}33`,
                        tension: 0.4
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
        const visitsElement = document.getElementById('visitsChart');
        const volunteerElement = document.getElementById('volunteerChart');
        const memberElement = document.getElementById('memberChart');
        if (visitsElement) {
            this.visitsChart = new Chart(visitsElement, chartConfig('Daily Visits', '#3498db'));
        }
        if (volunteerElement) {
            this.volunteerChart = new Chart(volunteerElement, chartConfig('Volunteer Signups', '#2ecc71'));
        }
        if (memberElement) {
            this.memberChart = new Chart(memberElement, chartConfig('New Members', '#e74c3c'));
        }
        this.updateCharts();
    }
    updateCharts() {
        if (!this.visitsChart && !this.volunteerChart && !this.memberChart) {
            this.setupCharts();
            return;
        }
        // Get the last 7 days of data
        const dates = Object.keys(this.stats).sort().slice(-7);
        console.log('Updating charts with dates:', dates);
        const updateChart = (chart, key) => {
            if (chart) {
                const data = dates.map(date => { var _a; return ((_a = this.stats[date]) === null || _a === void 0 ? void 0 : _a[key]) || 0; });
                const total = data.reduce((sum, val) => sum + val, 0);
                console.log(`Chart data for ${key}:`, { data, total });
                chart.data.labels = dates.map(date => new Date(date).toLocaleDateString());
                chart.data.datasets[0].data = data;
                chart.update('none'); // Use 'none' for immediate update
            }
        };
        updateChart(this.visitsChart, 'visits');
        updateChart(this.volunteerChart, 'volunteers');
        updateChart(this.memberChart, 'members');
    }
    updateUI() {
        // Calculate totals from all dates
        const totals = Object.values(this.stats).reduce((acc, dayStats) => ({
            visits: (acc.visits || 0) + (dayStats.visits || 0),
            volunteers: (acc.volunteers || 0) + (dayStats.volunteers || 0),
            members: (acc.members || 0) + (dayStats.members || 0)
        }), { visits: 0, volunteers: 0, members: 0 });
        console.log('Calculated totals:', totals);
        // Update the display elements
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value.toString();
                console.log(`Updating ${id} to:`, value);
            }
            else {
                console.log(`Element ${id} not found`);
            }
        };
        updateElement('totalVisits', totals.visits);
        updateElement('totalVolunteers', totals.volunteers);
        updateElement('totalMembers', totals.members);
    }
    trackPageVisit(path) {
        console.log('Tracking page visit:', path);
        this.ensureTodayStats();
        const today = this.getTodayKey();
        this.stats[today].visits = (this.stats[today].visits || 0) + 1;
        console.log('Updated visits for today:', this.stats[today].visits);
        this.saveStats();
    }
    trackVolunteerSignup(data) {
        console.log('Tracking volunteer signup:', data);
        this.ensureTodayStats();
        const today = this.getTodayKey();
        this.stats[today].volunteers = (this.stats[today].volunteers || 0) + 1;
        console.log('Updated volunteers for today:', this.stats[today].volunteers);
        this.volunteers.push(Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() }));
        this.saveStats();
        this.saveVolunteers();
    }
    trackNewMember() {
        console.log('Tracking new member registration');
        this.ensureTodayStats();
        const today = this.getTodayKey();
        this.stats[today].members = (this.stats[today].members || 0) + 1;
        console.log('Updated members for today:', this.stats[today].members);
        this.saveStats();
    }
    attachToWindow() {
        window.statistics = {
            trackPageVisit: (path) => this.trackPageVisit(path),
            trackVolunteerSignup: (data) => this.trackVolunteerSignup(data),
            trackNewMember: () => this.trackNewMember()
        };
    }
}
// Initialize statistics manager when the module loads
StatisticsManager.getInstance();
// Initialize statistics when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing StatisticsManager');
    // Use getInstance instead of new constructor
    StatisticsManager.getInstance();
});
