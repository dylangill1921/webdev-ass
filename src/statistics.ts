import { isLoggedIn } from './auth.js';

// Use Chart from the global scope since we're loading it from CDN
declare const Chart: any;

interface DailyStats {
    [date: string]: {
        visits: number;
        volunteers: number;
        members: number;
    }
}

interface VolunteerData {
    fullName: string;
    email: string;
    opportunityId: string;
    timestamp: string;
}

export class StatisticsManager {
    private static instance: StatisticsManager;
    private readonly storageKey = 'harmonyHubStats';
    private readonly volunteerStorageKey = 'harmonyHubVolunteers';
    private stats: DailyStats;
    private volunteers: VolunteerData[];
    private visitsChart: any;
    private volunteerChart: any;
    private memberChart: any;

    private constructor() {
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

    public static getInstance(): StatisticsManager {
        if (!StatisticsManager.instance) {
            StatisticsManager.instance = new StatisticsManager();
        }
        return StatisticsManager.instance;
    }

    private loadStats(): DailyStats {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        return {};
    }

    private loadVolunteers(): VolunteerData[] {
        const stored = localStorage.getItem(this.volunteerStorageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error loading volunteers:', error);
            }
        }
        return [];
    }

    private saveStats(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
        
        // Only update UI and charts if we're on the statistics page
        if (window.location.hash === '#/statistics') {
            console.log('Updating statistics display');
            this.updateUI();
            this.updateCharts();
        }
    }

    private saveVolunteers(): void {
        localStorage.setItem(this.volunteerStorageKey, JSON.stringify(this.volunteers));
    }

    private getTodayKey(): string {
        return new Date().toISOString().split('T')[0];
    }

    private ensureTodayStats(): void {
        const today = this.getTodayKey();
        if (!this.stats[today]) {
            this.stats[today] = {
                visits: 0,
                volunteers: 0,
                members: 0
            };
        }
    }

    private setupCharts(): void {
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

        const chartConfig = (label: string, color: string) => ({
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

    private updateCharts(): void {
        if (!this.visitsChart && !this.volunteerChart && !this.memberChart) {
            this.setupCharts();
            return;
        }

        // Get the last 7 days of data
        const dates = Object.keys(this.stats).sort().slice(-7);
        console.log('Updating charts with dates:', dates);
        
        const updateChart = (chart: any, key: keyof DailyStats[string]) => {
            if (chart) {
                const data = dates.map(date => this.stats[date]?.[key] || 0);
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

    private updateUI(): void {
        // Calculate totals from all dates
        const totals = Object.values(this.stats).reduce((acc, dayStats) => ({
            visits: (acc.visits || 0) + (dayStats.visits || 0),
            volunteers: (acc.volunteers || 0) + (dayStats.volunteers || 0),
            members: (acc.members || 0) + (dayStats.members || 0)
        }), { visits: 0, volunteers: 0, members: 0 });

        console.log('Calculated totals:', totals);

        // Update the display elements
        const updateElement = (id: string, value: number) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value.toString();
                console.log(`Updating ${id} to:`, value);
            } else {
                console.log(`Element ${id} not found`);
            }
        };

        updateElement('totalVisits', totals.visits);
        updateElement('totalVolunteers', totals.volunteers);
        updateElement('totalMembers', totals.members);
    }

    public trackPageVisit(path: string): void {
        console.log('Tracking page visit:', path);
        this.ensureTodayStats();
        const today = this.getTodayKey();
        this.stats[today].visits = (this.stats[today].visits || 0) + 1;
        console.log('Updated visits for today:', this.stats[today].visits);
        this.saveStats();
    }

    public trackVolunteerSignup(data: VolunteerData): void {
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

    public trackNewMember(): void {
        console.log('Tracking new member registration');
        this.ensureTodayStats();
        const today = this.getTodayKey();
        this.stats[today].members = (this.stats[today].members || 0) + 1;
        console.log('Updated members for today:', this.stats[today].members);
        this.saveStats();
    }

    private attachToWindow(): void {
        (window as any).statistics = {
            trackPageVisit: (path: string) => this.trackPageVisit(path),
            trackVolunteerSignup: (data: VolunteerData) => this.trackVolunteerSignup(data),
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