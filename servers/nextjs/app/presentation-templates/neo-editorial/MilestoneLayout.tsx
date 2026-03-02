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

                {/* Main content — asymmetric grid with editorial timeline */}
                <div className="flex flex-col h-full px-0 pt-0 pb-0">
                    {/* Header bar */}
                    <div className="px-16 pt-14 pb-0 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            TIMELINE
                        </span>
                        {title && (
                            <h1
                                className="text-[48px] font-black leading-[1.1] tracking-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Thick editorial rule */}
                        <div
                            className="h-1 w-full"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* Content — asymmetric 2fr/3fr */}
                    <div className="flex-1 grid grid-cols-[2fr_3fr] min-h-0">
                        {/* Left: description + context */}
                        <div
                            className="flex flex-col justify-center px-16 py-6"
                            style={{ borderRight: '1px solid var(--stroke, #E5E7EB)' }}
                        >
                            {description && (
                                <p className="text-[15px] leading-[1.85]" style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}>
                                    {description.length > 0 ? (
                                        <>
                                            <span
                                                className="float-left text-[52px] font-black leading-[0.8] mr-2 mt-1"
                                                style={{ color: 'var(--primary-color, #6366F1)' }}
                                            >
                                                {description.charAt(0)}
                                            </span>
                                            {description.slice(1)}
                                        </>
                                    ) : description}
                                </p>
                            )}
                        </div>

                        {/* Right: editorial timeline list */}
                        <div className="flex flex-col px-8 py-5 justify-between overflow-hidden">
                            {milestones?.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-5"
                                    style={{
                                        borderBottom: index < (milestones?.length ?? 0) - 1 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                        paddingBottom: index < (milestones?.length ?? 0) - 1 ? '10px' : '0',
                                        paddingTop: index > 0 ? '10px' : '0',
                                    }}
                                >
                                    {/* Date as category label */}
                                    <div className="flex flex-col items-start flex-shrink-0 w-[90px]">
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-[0.2em] block"
                                            style={{ color: 'var(--primary-color, #6366F1)' }}
                                        >
                                            {milestone.date}
                                        </span>
                                        {/* Thick rule separator */}
                                        <div
                                            className="h-1 w-6 mt-1"
                                            style={{ backgroundColor: milestone.completed ? 'var(--primary-color, #6366F1)' : 'var(--stroke, #E5E7EB)' }}
                                        />
                                    </div>

                                    {/* Column rule */}
                                    <div
                                        className="w-px self-stretch flex-shrink-0"
                                        style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                    />

                                    {/* Milestone content */}
                                    <div className="flex-1 min-w-0">
                                        {milestone.title && (
                                            <h3
                                                className="text-[15px] font-black leading-[1.1] tracking-tight mb-1"
                                                style={{
                                                    color: 'var(--background-text, #101828)',
                                                    fontFamily: 'var(--heading-font-family, Inter)',
                                                    opacity: milestone.completed ? 1 : 0.45,
                                                }}
                                            >
                                                {milestone.title}
                                            </h3>
                                        )}
                                        {milestone.description && (
                                            <p
                                                className="text-[12px] leading-[1.85]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.6, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {milestone.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status indicator */}
                                    <div className="flex-shrink-0 self-start pt-1">
                                        {milestone.completed ? (
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                                                style={{ color: 'var(--primary-color, #6366F1)' }}
                                            >
                                                DONE
                                            </span>
                                        ) : (
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.3 }}
                                            >
                                                AHEAD
                                            </span>
                                        )}
                                    </div>
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
