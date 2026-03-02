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
                <div className="flex flex-col h-full px-16 pt-14 pb-12">
                    {/* Header */}
                    <div className="mb-5 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            ROADMAP
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
                            className="h-1 w-full mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[15px] leading-[1.85] max-w-[580px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Editorial timeline — phases as editorial columns */}
                    <div className="flex-1 flex items-stretch min-h-0">
                        {milestones?.map((milestone, index) => {
                            const statusColor = milestone.status === 'completed'
                                ? 'var(--primary-color, #6366F1)'
                                : milestone.status === 'in-progress'
                                    ? 'var(--primary-color, #6366F1)'
                                    : 'var(--stroke, #E5E7EB)';
                            const statusLabel = milestone.status === 'completed' ? 'COMPLETED' : milestone.status === 'in-progress' ? 'IN PROGRESS' : 'UPCOMING';
                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && (
                                        <div
                                            className="w-px self-stretch flex-shrink-0"
                                            style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                        />
                                    )}
                                    <div className="flex-1 flex flex-col px-6 py-3 overflow-hidden">
                                        {/* Phase as category label */}
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2 block"
                                            style={{ color: 'var(--primary-color, #6366F1)' }}
                                        >
                                            {milestone.phase}
                                        </span>

                                        {/* Thick rule separator — color based on status */}
                                        <div
                                            className="h-1 w-full mb-3 flex-shrink-0"
                                            style={{ backgroundColor: statusColor }}
                                        />

                                        {milestone.title && (
                                            <h3
                                                className="text-[18px] font-black leading-[1.1] tracking-tight mb-2"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                            >
                                                {milestone.title}
                                            </h3>
                                        )}

                                        {milestone.description && (
                                            <p
                                                className="text-[13px] leading-[1.85] flex-1"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {milestone.description}
                                            </p>
                                        )}

                                        {/* Status label at bottom */}
                                        <span
                                            className="text-[11px] font-medium uppercase tracking-[0.2em] mt-3 block"
                                            style={{
                                                color: milestone.status === 'upcoming'
                                                    ? 'var(--background-text, #101828)'
                                                    : 'var(--primary-color, #6366F1)',
                                                opacity: milestone.status === 'upcoming' ? 0.35 : 1,
                                            }}
                                        >
                                            {statusLabel}
                                        </span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoadmapLayout;
