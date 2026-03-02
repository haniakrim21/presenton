import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Product Roadmap'),
    subtitle: z.string().max(200).describe('A short subtitle or context description for the roadmap').default('Our strategic plan for delivering value across four key phases this year'),
    milestones: z.array(z.object({
        phase: z.string().max(20).describe('The phase label, e.g. Q1 2024'),
        title: z.string().max(30).describe('The milestone title'),
        description: z.string().max(100).describe('A short description of what this milestone delivers'),
        status: z.enum(['completed', 'in-progress', 'upcoming']).describe('The current status of this milestone'),
    })).max(6).describe('Up to 6 milestones displayed along a horizontal timeline').default([
        {
            phase: 'Q1 2024',
            title: 'Foundation',
            description: 'Core infrastructure setup, team onboarding, and initial architecture decisions finalized.',
            status: 'completed',
        },
        {
            phase: 'Q2 2024',
            title: 'Alpha Release',
            description: 'Feature-complete alpha shipped to internal stakeholders for early validation and feedback.',
            status: 'completed',
        },
        {
            phase: 'Q3 2024',
            title: 'Beta Launch',
            description: 'Closed beta opened to 50 design partners with dedicated onboarding support.',
            status: 'in-progress',
        },
        {
            phase: 'Q4 2024',
            title: 'General Availability',
            description: 'Public launch with full documentation, pricing tiers, and self-serve onboarding.',
            status: 'upcoming',
        },
    ]),
});

export const layoutId = 'roadmap-layout';
export const layoutName = 'Roadmap Timeline';
export const layoutDescription = 'Horizontal timeline with milestones for project roadmaps';

const RoadmapLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, subtitle, milestones } = data;

    const statusConfig = {
        completed: { label: 'DONE', dotStyle: { backgroundColor: 'var(--primary-color, #6366F1)' } },
        'in-progress': { label: 'ACTIVE', dotStyle: { backgroundColor: 'var(--primary-color, #6366F1)', opacity: 0.5 } },
        upcoming: { label: 'PLANNED', dotStyle: { backgroundColor: 'var(--stroke, #E5E7EB)' } },
    };

    const completedCount = milestones?.filter(m => m.status === 'completed').length ?? 0;
    const inProgressCount = milestones?.filter(m => m.status === 'in-progress').length ?? 0;

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
                            {milestones?.length ?? 0} PHASES
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-4 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>TIMELINE</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{completedCount} COMPLETED</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{inProgressCount} IN PROGRESS</span>
                        {subtitle && (
                            <>
                                <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                                <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{subtitle}</span>
                            </>
                        )}
                    </div>

                    {/* Horizontal timeline area */}
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                        {/* Progress bar */}
                        <div
                            className="w-full h-[3px] rounded mb-3 flex-shrink-0 overflow-hidden"
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

                        {/* Milestone cards row */}
                        <div
                            className="grid gap-2"
                            style={{ gridTemplateColumns: `repeat(${Math.min(milestones?.length ?? 4, 4)}, 1fr)` }}
                        >
                            {milestones?.slice(0, 4).map((milestone, index) => {
                                const sc = statusConfig[milestone.status] ?? statusConfig.upcoming;
                                return (
                                    <div
                                        key={index}
                                        className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                                        style={{
                                            backgroundColor: 'var(--card-color, #F3F4F6)',
                                            border: milestone.status === 'in-progress'
                                                ? '1px dashed var(--primary-color, #6366F1)'
                                                : '1px dashed var(--stroke, #E5E7EB)',
                                        }}
                                    >
                                        {/* Phase date badge + status */}
                                        <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                                            <span
                                                className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                                style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                            >
                                                {milestone.phase}
                                            </span>
                                            <span
                                                className="text-[9px] font-bold uppercase"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.4, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                            >
                                                {sc.label}
                                            </span>
                                        </div>

                                        {/* Dot + title */}
                                        <div className="flex items-center gap-1.5 mb-1 flex-shrink-0">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={sc.dotStyle}
                                            />
                                            <h3
                                                className="text-[11px] font-bold uppercase tracking-[0.15em]"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                            >
                                                {milestone.title}
                                            </h3>
                                        </div>

                                        {/* Separator */}
                                        <div className="w-full mb-1.5 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />

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
                                );
                            })}
                        </div>

                        {/* Second row if more than 4 milestones */}
                        {(milestones?.length ?? 0) > 4 && (
                            <div
                                className="grid gap-2 mt-2"
                                style={{ gridTemplateColumns: `repeat(${Math.min((milestones?.length ?? 0) - 4, 4)}, 1fr)` }}
                            >
                                {milestones?.slice(4).map((milestone, index) => {
                                    const sc = statusConfig[milestone.status] ?? statusConfig.upcoming;
                                    return (
                                        <div
                                            key={index + 4}
                                            className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                                            style={{
                                                backgroundColor: 'var(--card-color, #F3F4F6)',
                                                border: milestone.status === 'in-progress'
                                                    ? '1px dashed var(--primary-color, #6366F1)'
                                                    : '1px dashed var(--stroke, #E5E7EB)',
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                                                <span
                                                    className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                                >
                                                    {milestone.phase}
                                                </span>
                                                <span
                                                    className="text-[9px] font-bold uppercase"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.4, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                                >
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mb-1 flex-shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={sc.dotStyle} />
                                                <h3
                                                    className="text-[11px] font-bold uppercase tracking-[0.15em]"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {milestone.title}
                                                </h3>
                                            </div>
                                            <div className="w-full mb-1.5 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />
                                            {milestone.description && (
                                                <p
                                                    className="text-[11px] leading-[1.5] flex-1"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {milestone.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoadmapLayout;
