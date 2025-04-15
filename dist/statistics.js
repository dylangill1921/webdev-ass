export class StatisticsManager {
    constructor() {
        this.storageKey = 'harmonyHubStats';
        this.volunteerStorageKey = 'harmonyHubVolunteers';
        console.log('Initializing StatisticsManager...');
        this.stats = this.loadStats();
        this.volunteers = this.loadVolunteers();
        this.trackPageVisit(window.location.hash || '/');
        if (window.location.hash === '#/statistics') {
            console.log('On statistics page, setting up charts...');
            setTimeout(() => {
                this.setupCharts();
                this.updateUI();
            }, 100);
        }
        window.addEventListener('hashchange', () => {
            if (window.location.hash === '#/statistics') {
                console.log('Navigation to statistics page, setting up charts...');
                setTimeout(() => {
                    this.setupCharts();
                    this.updateUI();
                }, 100);
            }
        });
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
        console.log('Setting up charts...');
        if (typeof window.Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }
        try {
            const visitsElement = document.getElementById('visitsChart');
            const volunteerElement = document.getElementById('volunteerChart');
            const memberElement = document.getElementById('memberChart');
            if (!visitsElement || !volunteerElement || !memberElement) {
                console.error('One or more chart canvases not found');
                return;
            }
            if (this.visitsChart)
                this.visitsChart.destroy();
            if (this.volunteerChart)
                this.volunteerChart.destroy();
            if (this.memberChart)
                this.memberChart.destroy();
            const createConfig = (label, color) => ({
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                            label,
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
            console.log('Creating charts...');
            this.visitsChart = new window.Chart(visitsElement, createConfig('Daily Visits', '#3498db'));
            this.volunteerChart = new window.Chart(volunteerElement, createConfig('Volunteer Signups', '#2ecc71'));
            this.memberChart = new window.Chart(memberElement, createConfig('New Members', '#e74c3c'));
            this.updateCharts();
            console.log('Charts created and updated successfully');
        }
        catch (error) {
            console.error('Error setting up charts:', error);
        }
    }
    updateCharts() {
        if (!this.visitsChart && !this.volunteerChart && !this.memberChart) {
            this.setupCharts();
            return;
        }
        const dates = Object.keys(this.stats).sort().slice(-7);
        console.log('Updating charts with dates:', dates);
        const updateChart = (chart, key) => {
            if (chart) {
                const data = dates.map(date => this.stats[date]?.[key] || 0);
                const total = data.reduce((sum, val) => sum + val, 0);
                console.log(`Chart data for ${key}:`, { data, total });
                chart.data.labels = dates.map(date => new Date(date).toLocaleDateString());
                chart.data.datasets[0].data = data;
                chart.update('none');
            }
        };
        updateChart(this.visitsChart, 'visits');
        updateChart(this.volunteerChart, 'volunteers');
        updateChart(this.memberChart, 'members');
    }
    updateUI() {
        const totals = Object.values(this.stats).reduce((acc, dayStats) => ({
            visits: (acc.visits || 0) + (dayStats.visits || 0),
            volunteers: (acc.volunteers || 0) + (dayStats.volunteers || 0),
            members: (acc.members || 0) + (dayStats.members || 0)
        }), { visits: 0, volunteers: 0, members: 0 });
        console.log('Calculated totals:', totals);
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
        this.volunteers.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        this.saveStats();
        this.saveVolunteers();
    }
    trackMemberRegistration() {
        console.log('Tracking new member registration');
        this.ensureTodayStats();
        const today = this.getTodayKey();
        this.stats[today].members = (this.stats[today].members || 0) + 1;
        console.log('Updated members for today:', this.stats[today].members);
        this.saveStats();
    }
    attachToWindow() {
        window.statisticsManager = this;
        if (window.location.hash === '#/statistics') {
            console.log('Statistics page loaded, initializing charts');
            setTimeout(() => {
                this.setupCharts();
                this.updateUI();
            }, 100);
        }
    }
    waitForChart(callback) {
        const check = () => {
            if (window.Chart) {
                callback();
            }
            else {
                console.log('Waiting for Chart.js to load...');
                setTimeout(check, 100);
            }
        };
        check();
    }
}
StatisticsManager.getInstance();
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing StatisticsManager');
    StatisticsManager.getInstance();
});
//# sourceMappingURL=statistics.js.map