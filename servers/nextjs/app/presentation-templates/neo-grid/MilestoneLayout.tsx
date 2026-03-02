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
                {/* Grid-dot background pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(var(--primary-color, #6366F1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />

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
                <div className="flex flex-col h-full px-12 py-10">
                    {/* Header */}
                    <div className="mb-4 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight tracking-wide pb-2"
                                style={{
                                    color: 'var(--background-text, #101828)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    borderBottom: '2px solid var(--primary-color, #6366F1)',
                                    display: 'inline-block',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p
                                className="text-[13px] leading-relaxed max-w-[540px] mt-3"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Timeline — vertical with square dots */}
                    <div className="flex-1 relative flex items-center min-h-0">
                        {/* Vertical center line — 1px straight line */}
                        <div
                            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-0"
                            style={{ width: '1px', backgroundColor: 'var(--stroke, #E5E7EB)' }}
                        />

                        <div className="relative w-full flex flex-col justify-between h-full py-1">
                            {milestones?.map((milestone, index) => {
                                const isLeft = index % 2 === 0;
                                return (
                                    <div key={index} className="relative flex items-center w-full">
                                        {/* Left side content */}
                                        <div className="flex-1 flex justify-end pr-5">
                                            {isLeft ? (
                                                <div className="flex flex-col items-end max-w-[44%]">
                                                    {/* Date label UPPERCASE */}
                                                    <span
                                                        className="text-[9px] font-bold uppercase tracking-widest mb-1"
                                                        style={{ color: 'var(--primary-color, #6366F1)', letterSpacing: '0.12em' }}
                                                    >
                                                        {milestone.date}
                                                    </span>
                                                    {/* Card — 1px border all sides, no radius */}
                                                    <div
                                                        className="text-right"
                                                        style={{
                                                            backgroundColor: 'var(--card-color, #F3F4F6)',
                                                            border: '1px solid var(--stroke, #E5E7EB)',
                                                            borderRadius: 0,
                                                        }}
                                                    >
                                                        {/* Horizontal connector line to card */}
                                                        <div
                                                            className="absolute"
                                                            style={{
                                                                right: '50%',
                                                                width: '20px',
                                                                height: '1px',
                                                                backgroundColor: 'var(--stroke, #E5E7EB)',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                            }}
                                                        />
                                                        <div className="px-4 py-2">
                                                            {milestone.title && (
                                                                <h3
                                                                    className="text-[12px] font-bold leading-tight mb-1 tracking-wide"
                                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                                >
                                                                    {milestone.title}
                                                                </h3>
                                                            )}
                                                            {milestone.description && (
                                                                <p
                                                                    className="text-[10.5px] leading-[1.5]"
                                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                                                >
                                                                    {milestone.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full" />
                                            )}
                                        </div>

                                        {/* Center — square dot (not circle) */}
                                        <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-5 h-5">
                                            {milestone.completed ? (
                                                <div
                                                    style={{
                                                        width: '12px',
                                                        height: '12px',
                                                        backgroundColor: 'var(--primary-color, #6366F1)',
                                                        borderRadius: 0,
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: 0,
                                                        border: '2px solid var(--primary-color, #6366F1)',
                                                        backgroundColor: 'var(--background-color, #ffffff)',
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Right side content */}
                                        <div className="flex-1 flex justify-start pl-5">
                                            {!isLeft ? (
                                                <div className="flex flex-col items-start max-w-[44%]">
                                                    {/* Date label UPPERCASE */}
                                                    <span
                                                        className="text-[9px] font-bold uppercase tracking-widest mb-1"
                                                        style={{ color: 'var(--primary-color, #6366F1)', letterSpacing: '0.12em' }}
                                                    >
                                                        {milestone.date}
                                                    </span>
                                                    {/* Card — 1px border all sides, no radius */}
                                                    <div
                                                        className="text-left"
                                                        style={{
                                                            backgroundColor: 'var(--card-color, #F3F4F6)',
                                                            border: '1px solid var(--stroke, #E5E7EB)',
                                                            borderRadius: 0,
                                                        }}
                                                    >
                                                        <div className="px-4 py-2">
                                                            {milestone.title && (
                                                                <h3
                                                                    className="text-[12px] font-bold leading-tight mb-1 tracking-wide"
                                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                                >
                                                                    {milestone.title}
                                                                </h3>
                                                            )}
                                                            {milestone.description && (
                                                                <p
                                                                    className="text-[10.5px] leading-[1.5]"
                                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                                                >
                                                                    {milestone.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
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
