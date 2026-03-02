/**
 * Composite template definitions — 90 use-case templates
 * Each curates layouts from existing template groups.
 * No new TSX files needed — just data references.
 */

export interface CompositeTemplateDef {
    id: string;
    name: string;
    description: string;
    /** IDs of source template groups whose layouts are included */
    sourceGroups: string[];
}

export const compositeTemplateDefs: CompositeTemplateDef[] = [
    // ── Business (15) ──────────────────────────────────────────────────
    { id: 'business-pitch', name: 'Business Pitch', description: 'Compelling pitch deck for business proposals and investor meetings', sourceGroups: ['neo-executive', 'neo-pulse'] },
    { id: 'investor-deck', name: 'Investor Deck', description: 'Data-driven presentation for fundraising and investor relations', sourceGroups: ['neo-data', 'neo-general'] },
    { id: 'quarterly-review', name: 'Quarterly Review', description: 'Quarterly business review with metrics, charts, and KPI tracking', sourceGroups: ['neo-general', 'neo-data'] },
    { id: 'annual-report', name: 'Annual Report', description: 'Comprehensive annual report with financial data and highlights', sourceGroups: ['neo-executive', 'neo-editorial'] },
    { id: 'budget-proposal', name: 'Budget Proposal', description: 'Budget justification and financial planning presentation', sourceGroups: ['neo-data', 'neo-minimal'] },
    { id: 'market-entry', name: 'Market Entry', description: 'Market entry strategy with competitive analysis and opportunity sizing', sourceGroups: ['neo-bold', 'neo-general'] },
    { id: 'growth-strategy', name: 'Growth Strategy', description: 'Growth strategy deck with roadmaps and scaling plans', sourceGroups: ['neo-pulse', 'neo-grid'] },
    { id: 'business-plan', name: 'Business Plan', description: 'Comprehensive business plan with market analysis and projections', sourceGroups: ['neo-executive', 'neo-data'] },
    { id: 'partnership-proposal', name: 'Partnership Proposal', description: 'Strategic partnership and collaboration pitch deck', sourceGroups: ['neo-clean', 'neo-general'] },
    { id: 'franchise-overview', name: 'Franchise Overview', description: 'Franchise opportunity presentation with unit economics', sourceGroups: ['neo-grid', 'neo-executive'] },
    { id: 'supply-chain-review', name: 'Supply Chain Review', description: 'Supply chain analysis and optimization presentation', sourceGroups: ['neo-data', 'neo-pulse'] },
    { id: 'operations-summary', name: 'Operations Summary', description: 'Operational performance summary with process flows', sourceGroups: ['neo-minimal', 'neo-data'] },
    { id: 'business-case', name: 'Business Case', description: 'Business case justification with ROI analysis and risk assessment', sourceGroups: ['neo-executive', 'neo-bold'] },
    { id: 'merger-acquisition', name: 'Merger & Acquisition', description: 'M&A proposal with valuation metrics and synergy analysis', sourceGroups: ['neo-editorial', 'neo-data'] },
    { id: 'board-meeting', name: 'Board Meeting', description: 'Board of directors meeting deck with strategic updates', sourceGroups: ['neo-executive', 'neo-general'] },

    // ── Sales & Marketing (15) ──────────────────────────────────────────
    { id: 'sales-playbook', name: 'Sales Playbook', description: 'Sales team playbook with methodology and objection handling', sourceGroups: ['neo-bold', 'neo-pulse'] },
    { id: 'go-to-market', name: 'Go-to-Market', description: 'Go-to-market strategy with launch timeline and channel plan', sourceGroups: ['neo-pulse', 'neo-vibrant'] },
    { id: 'competitive-analysis', name: 'Competitive Analysis', description: 'Competitive landscape analysis with positioning and differentiation', sourceGroups: ['neo-grid', 'neo-data'] },
    { id: 'product-launch', name: 'Product Launch', description: 'Product launch deck with feature highlights and pricing', sourceGroups: ['neo-vibrant', 'neo-bold'] },
    { id: 'marketing-strategy', name: 'Marketing Strategy', description: 'Marketing strategy with channel mix and campaign planning', sourceGroups: ['neo-editorial', 'neo-general'] },
    { id: 'brand-positioning', name: 'Brand Positioning', description: 'Brand strategy with positioning framework and messaging', sourceGroups: ['neo-clean', 'neo-editorial'] },
    { id: 'campaign-overview', name: 'Campaign Overview', description: 'Marketing campaign results and performance analysis', sourceGroups: ['neo-data', 'neo-vibrant'] },
    { id: 'customer-acquisition', name: 'Customer Acquisition', description: 'Customer acquisition strategy with funnel metrics', sourceGroups: ['neo-pulse', 'neo-data'] },
    { id: 'market-research', name: 'Market Research', description: 'Market research findings with segmentation and insights', sourceGroups: ['neo-editorial', 'neo-data'] },
    { id: 'pricing-strategy', name: 'Pricing Strategy', description: 'Pricing model analysis with competitive benchmarking', sourceGroups: ['neo-grid', 'neo-executive'] },
    { id: 'sales-forecast', name: 'Sales Forecast', description: 'Sales projections with pipeline analysis and quota tracking', sourceGroups: ['neo-data', 'neo-general'] },
    { id: 'channel-strategy', name: 'Channel Strategy', description: 'Distribution channel strategy with partner ecosystem', sourceGroups: ['neo-minimal', 'neo-pulse'] },
    { id: 'content-strategy', name: 'Content Strategy', description: 'Content marketing strategy with editorial calendar', sourceGroups: ['neo-editorial', 'neo-clean'] },
    { id: 'customer-journey', name: 'Customer Journey', description: 'Customer journey mapping with touchpoints and experience analysis', sourceGroups: ['neo-pulse', 'neo-minimal'] },
    { id: 'lead-generation', name: 'Lead Generation', description: 'Lead generation playbook with conversion optimization', sourceGroups: ['neo-bold', 'neo-data'] },

    // ── Technical (15) ──────────────────────────────────────────────────
    { id: 'architecture-review', name: 'Architecture Review', description: 'System architecture review with component analysis', sourceGroups: ['neo-grid', 'neo-general'] },
    { id: 'api-overview', name: 'API Overview', description: 'API documentation overview with endpoints and integration guides', sourceGroups: ['neo-data', 'neo-minimal'] },
    { id: 'sprint-retro', name: 'Sprint Retrospective', description: 'Sprint retrospective with wins, learnings, and action items', sourceGroups: ['neo-pulse', 'neo-clean'] },
    { id: 'roadmap-planning', name: 'Roadmap Planning', description: 'Technical roadmap with milestones and resource allocation', sourceGroups: ['neo-executive', 'neo-pulse'] },
    { id: 'technical-deep-dive', name: 'Technical Deep Dive', description: 'In-depth technical analysis with diagrams and benchmarks', sourceGroups: ['neo-dark', 'neo-data'] },
    { id: 'system-design', name: 'System Design', description: 'System design proposal with architecture decisions', sourceGroups: ['neo-grid', 'neo-dark'] },
    { id: 'migration-plan', name: 'Migration Plan', description: 'Technology migration roadmap with risk mitigation', sourceGroups: ['neo-pulse', 'neo-executive'] },
    { id: 'infrastructure-overview', name: 'Infrastructure Overview', description: 'Infrastructure landscape with monitoring and scaling', sourceGroups: ['neo-data', 'neo-dark'] },
    { id: 'performance-review-tech', name: 'Performance Review', description: 'Technical performance review with benchmarks and optimization', sourceGroups: ['neo-data', 'neo-grid'] },
    { id: 'security-assessment', name: 'Security Assessment', description: 'Security posture assessment with vulnerability analysis', sourceGroups: ['neo-dark', 'neo-executive'] },
    { id: 'devops-pipeline', name: 'DevOps Pipeline', description: 'CI/CD pipeline overview with deployment strategy', sourceGroups: ['neo-grid', 'neo-pulse'] },
    { id: 'code-review-deck', name: 'Code Review', description: 'Code review presentation with patterns and best practices', sourceGroups: ['neo-minimal', 'neo-dark'] },
    { id: 'technical-debt', name: 'Technical Debt', description: 'Technical debt analysis with prioritized remediation plan', sourceGroups: ['neo-data', 'neo-pulse'] },
    { id: 'integration-plan', name: 'Integration Plan', description: 'System integration plan with API contracts and timelines', sourceGroups: ['neo-grid', 'neo-executive'] },
    { id: 'release-notes-deck', name: 'Release Notes', description: 'Product release highlights with feature showcase', sourceGroups: ['neo-vibrant', 'neo-general'] },

    // ── Corporate (15) ──────────────────────────────────────────────────
    { id: 'executive-summary', name: 'Executive Summary', description: 'High-level executive summary for leadership', sourceGroups: ['neo-executive', 'neo-general'] },
    { id: 'board-presentation', name: 'Board Presentation', description: 'Board presentation with governance and strategic updates', sourceGroups: ['neo-executive', 'neo-editorial'] },
    { id: 'company-culture', name: 'Company Culture', description: 'Company culture and values showcase', sourceGroups: ['neo-vibrant', 'neo-clean'] },
    { id: 'team-onboarding', name: 'Team Onboarding', description: 'New hire onboarding with processes and team introductions', sourceGroups: ['neo-clean', 'neo-pulse'] },
    { id: 'hr-overview', name: 'HR Overview', description: 'Human resources overview with policies and benefits', sourceGroups: ['neo-minimal', 'neo-general'] },
    { id: 'compliance-report', name: 'Compliance Report', description: 'Regulatory compliance status with audit findings', sourceGroups: ['neo-executive', 'neo-data'] },
    { id: 'change-management', name: 'Change Management', description: 'Change management plan with stakeholder impact analysis', sourceGroups: ['neo-pulse', 'neo-executive'] },
    { id: 'stakeholder-update', name: 'Stakeholder Update', description: 'Stakeholder progress update with key milestones', sourceGroups: ['neo-editorial', 'neo-general'] },
    { id: 'corporate-strategy', name: 'Corporate Strategy', description: 'Corporate strategy with vision, mission, and objectives', sourceGroups: ['neo-bold', 'neo-executive'] },
    { id: 'employee-engagement', name: 'Employee Engagement', description: 'Employee engagement survey results and action plans', sourceGroups: ['neo-clean', 'neo-data'] },
    { id: 'diversity-inclusion', name: 'Diversity & Inclusion', description: 'D&I initiatives with metrics and progress tracking', sourceGroups: ['neo-vibrant', 'neo-data'] },
    { id: 'organizational-review', name: 'Organizational Review', description: 'Organization structure review with team composition', sourceGroups: ['neo-grid', 'neo-general'] },
    { id: 'risk-assessment', name: 'Risk Assessment', description: 'Enterprise risk assessment with mitigation strategies', sourceGroups: ['neo-dark', 'neo-data'] },
    { id: 'governance-overview', name: 'Governance Overview', description: 'Corporate governance framework and oversight', sourceGroups: ['neo-executive', 'neo-minimal'] },
    { id: 'sustainability-report', name: 'Sustainability Report', description: 'ESG and sustainability metrics with progress tracking', sourceGroups: ['neo-clean', 'neo-editorial'] },

    // ── Education & Research (15) ───────────────────────────────────────
    { id: 'academic-report', name: 'Academic Report', description: 'Academic research report with methodology and findings', sourceGroups: ['neo-editorial', 'neo-data'] },
    { id: 'research-findings', name: 'Research Findings', description: 'Research findings presentation with data visualization', sourceGroups: ['neo-data', 'neo-minimal'] },
    { id: 'workshop-deck', name: 'Workshop Deck', description: 'Interactive workshop presentation with exercises and activities', sourceGroups: ['neo-vibrant', 'neo-pulse'] },
    { id: 'training-module', name: 'Training Module', description: 'Training module with learning objectives and assessments', sourceGroups: ['neo-clean', 'neo-general'] },
    { id: 'case-study', name: 'Case Study', description: 'Detailed case study with problem, solution, and outcomes', sourceGroups: ['neo-editorial', 'neo-bold'] },
    { id: 'literature-review', name: 'Literature Review', description: 'Literature review with thematic analysis and citations', sourceGroups: ['neo-minimal', 'neo-editorial'] },
    { id: 'thesis-defense', name: 'Thesis Defense', description: 'Thesis defense presentation with research methodology', sourceGroups: ['neo-executive', 'neo-data'] },
    { id: 'curriculum-overview', name: 'Curriculum Overview', description: 'Curriculum structure with learning outcomes and progression', sourceGroups: ['neo-grid', 'neo-clean'] },
    { id: 'lab-results', name: 'Lab Results', description: 'Laboratory results presentation with data analysis', sourceGroups: ['neo-data', 'neo-dark'] },
    { id: 'conference-talk', name: 'Conference Talk', description: 'Conference presentation with key insights and takeaways', sourceGroups: ['neo-bold', 'neo-general'] },
    { id: 'teaching-portfolio', name: 'Teaching Portfolio', description: 'Teaching philosophy and accomplishments portfolio', sourceGroups: ['neo-editorial', 'neo-clean'] },
    { id: 'student-project', name: 'Student Project', description: 'Student project presentation with objectives and outcomes', sourceGroups: ['neo-vibrant', 'neo-grid'] },
    { id: 'data-analysis-deck', name: 'Data Analysis', description: 'Data analysis presentation with statistical findings', sourceGroups: ['neo-data', 'neo-executive'] },
    { id: 'methodology-review', name: 'Methodology Review', description: 'Research methodology comparison and evaluation', sourceGroups: ['neo-minimal', 'neo-data'] },
    { id: 'peer-review-deck', name: 'Peer Review', description: 'Peer review presentation with evaluation criteria', sourceGroups: ['neo-editorial', 'neo-general'] },

    // ── Creative (15) ───────────────────────────────────────────────────
    { id: 'portfolio-showcase', name: 'Portfolio Showcase', description: 'Creative portfolio with project highlights and process', sourceGroups: ['neo-vibrant', 'neo-editorial'] },
    { id: 'design-review-deck', name: 'Design Review', description: 'Design review with user research and iteration history', sourceGroups: ['neo-clean', 'neo-minimal'] },
    { id: 'brand-guidelines', name: 'Brand Guidelines', description: 'Brand identity guidelines with colors, typography, and usage', sourceGroups: ['neo-editorial', 'neo-vibrant'] },
    { id: 'creative-brief', name: 'Creative Brief', description: 'Creative project brief with goals and deliverables', sourceGroups: ['neo-bold', 'neo-clean'] },
    { id: 'event-pitch', name: 'Event Pitch', description: 'Event sponsorship or speaking engagement pitch', sourceGroups: ['neo-vibrant', 'neo-pulse'] },
    { id: 'media-kit', name: 'Media Kit', description: 'Press and media kit with brand assets and key facts', sourceGroups: ['neo-editorial', 'neo-executive'] },
    { id: 'product-design-deck', name: 'Product Design', description: 'Product design showcase with UX flows and prototypes', sourceGroups: ['neo-clean', 'neo-grid'] },
    { id: 'ux-review', name: 'UX Review', description: 'User experience audit with heuristic evaluation', sourceGroups: ['neo-minimal', 'neo-pulse'] },
    { id: 'photography-portfolio', name: 'Photography Portfolio', description: 'Photography portfolio with series and collections', sourceGroups: ['neo-dark', 'neo-editorial'] },
    { id: 'art-direction', name: 'Art Direction', description: 'Art direction concept presentation with mood boards', sourceGroups: ['neo-vibrant', 'neo-bold'] },
    { id: 'social-media-plan', name: 'Social Media Plan', description: 'Social media content strategy with calendar and KPIs', sourceGroups: ['neo-grid', 'neo-vibrant'] },
    { id: 'video-production', name: 'Video Production', description: 'Video production proposal with storyboard and timeline', sourceGroups: ['neo-dark', 'neo-pulse'] },
    { id: 'packaging-design', name: 'Packaging Design', description: 'Packaging design concepts with material specifications', sourceGroups: ['neo-clean', 'neo-bold'] },
    { id: 'typography-showcase', name: 'Typography Showcase', description: 'Typography system showcase with hierarchy and pairing', sourceGroups: ['neo-editorial', 'neo-minimal'] },
    { id: 'motion-design', name: 'Motion Design', description: 'Motion design concepts with animation principles', sourceGroups: ['neo-vibrant', 'neo-dark'] },
];
