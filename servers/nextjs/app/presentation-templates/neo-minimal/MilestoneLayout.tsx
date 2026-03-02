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
                <div className="flex flex-col h-full px-20 pt-16 pb-12">
                    {/* Header */}
                    <div className="mb-8 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[28px] font-medium leading-tight"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        <div
                            className="w-1 h-1 rounded-full mt-3 mb-4"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {description && (
                            <p
                                className="text-[13px] font-light leading-loose max-w-[460px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Timeline — single 1px hairline with tiny 3px dots */}
                    <div className="flex-1 relative flex items-center min-h-0">
                        {/* Vertical hairline — 1px, opacity-20 */}
                        <div
                            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-0"
                            style={{
                                width: '1px',
                                backgroundColor: 'var(--stroke, #E5E7EB)',
                                opacity: 0.2,
                            }}
                        />

                        <div className="relative w-full flex flex-col justify-between h-full py-2">
                            {milestones?.map((milestone, index) => {
                                const isLeft = index % 2 === 0;
                                return (
                                    <div key={index} className="relative flex items-center w-full">
                                        {/* Left side — plain text, no card */}
                                        <div className="flex-1 flex justify-end pr-8">
                                            {isLeft ? (
                                                <div className="flex flex-col items-end max-w-[42%]">
                                                    <span
                                                        className="text-[10px] font-light uppercase tracking-widest mb-1"
                                                        style={{ color: 'var(--primary-color, #6366F1)', letterSpacing: '0.12em', opacity: 0.7 }}
                                                    >
                                                        {milestone.date}
                                                    </span>
                                                    {milestone.title && (
                                                        <h3
                                                            className="text-[13px] font-medium leading-tight mb-1 text-right"
                                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                        >
                                                            {milestone.title}
                                                        </h3>
                                                    )}
                                                    {milestone.description && (
                                                        <p
                                                            className="text-[11px] font-light leading-loose text-right"
                                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.45, fontFamily: 'var(--body-font-family, Inter)' }}
                                                        >
                                                            {milestone.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full" />
                                            )}
                                        </div>

                                        {/* Tiny 3px dot */}
                                        <div className="relative z-10 flex-shrink-0 flex items-center justify-center" style={{ width: '12px', height: '12px' }}>
                                            <div
                                                className="rounded-full"
                                                style={{
                                                    width: '3px',
                                                    height: '3px',
                                                    backgroundColor: milestone.completed
                                                        ? 'var(--primary-color, #6366F1)'
                                                        : 'var(--stroke, #E5E7EB)',
                                                }}
                                            />
                                        </div>

                                        {/* Right side — plain text, no card */}
                                        <div className="flex-1 flex justify-start pl-8">
                                            {!isLeft ? (
                                                <div className="flex flex-col items-start max-w-[42%]">
                                                    <span
                                                        className="text-[10px] font-light uppercase tracking-widest mb-1"
                                                        style={{ color: 'var(--primary-color, #6366F1)', letterSpacing: '0.12em', opacity: 0.7 }}
                                                    >
                                                        {milestone.date}
                                                    </span>
                                                    {milestone.title && (
                                                        <h3
                                                            className="text-[13px] font-medium leading-tight mb-1"
                                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                        >
                                                            {milestone.title}
                                                        </h3>
                                                    )}
                                                    {milestone.description && (
                                                        <p
                                                            className="text-[11px] font-light leading-loose"
                                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.45, fontFamily: 'var(--body-font-family, Inter)' }}
                                                        >
                                                            {milestone.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MilestoneLayout;
