import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Project Milestones'),
    description: z.string().max(200).describe('A short description of the milestone timeline shown on the slide').default('Key milestones tracking our progress from concept to launch'),
    milestones: z.array(z.object({
        date: z.string().max(20).describe('The date or time label for this milestone, e.g. Jan 2024'),
        title: z.string().max(30).describe('The title of this milestone'),
        description: z.string().max(120).describe('A short description of what was achieved at this milestone'),
        completed: z.boolean().describe('Whether this milestone has been completed').default(true),
    })).max(6).describe('A list of up to 6 milestones displayed on a vertical alternating timeline').default([
        { date: 'Jan 2024', title: 'Project Kickoff', description: 'Formed the core team, defined the product vision, and aligned stakeholders on scope and success criteria.', completed: true },
        { date: 'Mar 2024', title: 'Alpha Release', description: 'Delivered the first functional prototype to internal testers. Collected structured feedback across 12 user sessions.', completed: true },
        { date: 'Jun 2024', title: 'Beta Launch', description: 'Opened access to 200 early adopters. Resolved critical bugs and stabilised the core user flows based on telemetry.', completed: true },
        { date: 'Sep 2024', title: 'GA Release', description: 'Shipped v1.0 to general availability. Achieved 98.9% uptime in the first 30 days post-launch.', completed: true },
        { date: 'Dec 2024', title: 'Series A Close', description: 'Secured $12M in Series A funding to accelerate go-to-market and double the engineering team.', completed: false },
        { date: 'Q2 2025', title: 'International Expansion', description: 'Planned rollout to EU and APAC markets, including localisation and regional compliance certifications.', completed: false },
    ]),
});

export const layoutId = 'milestone-layout';
export const layoutName = 'Milestone Timeline';
export const layoutDescription = 'Vertical alternating timeline for project milestones';

const MilestoneLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, description, milestones } = data;

    const completedCount = milestones?.filter(m => m.completed).length ?? 0;

    // Split into two columns for dense display
    const col1 = milestones?.filter((_, i) => i % 2 === 0) ?? [];
    const col2 = milestones?.filter((_, i) => i % 2 === 1) ?? [];

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <div
                className="relative w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video overflow-hidden z-20 mx-auto"
                style={{
                    fontFamily: 'var(--heading-font-family, Inter)',
                    background: 'var(--background-color, #ffffff)',
                }}
            >
                {/* Company branding block */}
                {((data as any)?.__companyName__ || (data as any)?._logo_url__) && (
                    <div className="absolute top-0 left-0 right-0 px-8 pt-4 z-10">
                        <div className="flex items-center gap-1">
                            {(data as any)?._logo_url__ && <img src={(data as any)?._logo_url__} alt="logo" className="w-[60px] object-contain" />}
                            <span style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }} className='w-[2px] h-4'></span>
                            {(data as any)?.__companyName__ && <span className="text-sm font-semibold" style={{ color: 'var(--background-text, #111827)' }}>{(data as any)?.__companyName__}</span>}
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="flex flex-col h-full px-10 pt-10 pb-8">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-2 flex-shrink-0">
                        <div>
                            {title && (
                                <h1
                                    className="text-[22px] font-semibold tracking-tight leading-tight"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {title}
                                </h1>
                            )}
                        </div>
                        <span
                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-1"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                        >
                            {completedCount}/{milestones?.length ?? 0} COMPLETE
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>MILESTONE LOG</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{milestones?.length ?? 0} ENTRIES</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        {description && <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{description}</span>}
                    </div>

                    {/* Progress bar */}
                    <div
                        className="w-full h-[2px] rounded mb-3 flex-shrink-0 overflow-hidden"
                        style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                    >
                        <div
                            className="h-full rounded"
                            style={{
                                width: `${((completedCount / (milestones?.length || 1)) * 100).toFixed(0)}%`,
                                backgroundColor: 'var(--primary-color, #6366F1)',
                            }}
                        />
                    </div>

                    {/* Two-column milestone grid */}
                    <div className="flex-1 grid grid-cols-2 gap-2 min-h-0 overflow-hidden">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-2 overflow-hidden">
                            {col1.map((milestone, idx) => (
                                <div
                                    key={idx * 2}
                                    className="rounded px-3 py-2.5 flex flex-col overflow-hidden flex-1"
                                    style={{
                                        backgroundColor: 'var(--card-color, #F3F4F6)',
                                        border: '1px dashed var(--stroke, #E5E7EB)',
                                    }}
                                >
                                    {/* Date badge + status dot */}
                                    <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
                                        <span
                                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            {milestone.date}
                                        </span>
                                        <span
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: milestone.completed ? 'var(--primary-color, #6366F1)' : 'var(--stroke, #E5E7EB)' }}
                                        />
                                        <span
                                            className="text-[9px] font-bold uppercase"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.35, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            {milestone.completed ? 'DONE' : 'PLANNED'}
                                        </span>
                                    </div>
                                    {/* Separator */}
                                    <div className="w-full mb-1.5 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                                    {/* Title */}
                                    {milestone.title && (
                                        <h3
                                            className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1 flex-shrink-0"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {milestone.title}
                                        </h3>
                                    )}
                                    {/* Description */}
                                    {milestone.description && (
                                        <p
                                            className="text-[11px] leading-[1.5] flex-1"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {milestone.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-2 overflow-hidden">
                            {col2.map((milestone, idx) => (
                                <div
                                    key={idx * 2 + 1}
                                    className="rounded px-3 py-2.5 flex flex-col overflow-hidden flex-1"
                                    style={{
                                        backgroundColor: 'var(--card-color, #F3F4F6)',
                                        border: '1px dashed var(--stroke, #E5E7EB)',
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
                                        <span
                                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            {milestone.date}
                                        </span>
                                        <span
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: milestone.completed ? 'var(--primary-color, #6366F1)' : 'var(--stroke, #E5E7EB)' }}
                                        />
                                        <span
                                            className="text-[9px] font-bold uppercase"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.35, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            {milestone.completed ? 'DONE' : 'PLANNED'}
                                        </span>
                                    </div>
                                    <div className="w-full mb-1.5 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                                    {milestone.title && (
                                        <h3
                                            className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1 flex-shrink-0"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {milestone.title}
                                        </h3>
                                    )}
                                    {milestone.description && (
                                        <p
                                            className="text-[11px] leading-[1.5] flex-1"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {milestone.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MilestoneLayout;
