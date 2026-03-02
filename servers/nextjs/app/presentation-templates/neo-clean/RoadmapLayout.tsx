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

    const getStatusLabel = (status: 'completed' | 'in-progress' | 'upcoming') => {
        if (status === 'completed') return 'DONE';
        if (status === 'in-progress') return 'IN PROGRESS';
        return 'UPCOMING';
    };

    const getStatusOpacity = (status: 'completed' | 'in-progress' | 'upcoming') => {
        if (status === 'upcoming') return 0.45;
        return 1;
    };

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
                <div className="flex flex-col h-full px-14 pt-12 pb-10">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0 max-w-[960px] mx-auto w-full">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)' }}
                        >
                            ROADMAP
                        </span>
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight mb-1"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p
                                className="text-[14px] leading-relaxed max-w-[580px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Phase cards — horizontal row */}
                    <div className="flex-1 flex items-center min-h-0 max-w-[960px] mx-auto w-full">
                        <div className="w-full flex items-stretch gap-5">
                            {milestones?.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="flex-1 flex flex-col rounded-xl px-6 py-5 overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--card-color, #F3F4F6)',
                                        opacity: getStatusOpacity(milestone.status),
                                    }}
                                >
                                    {/* Date pill badge */}
                                    <span
                                        className="inline-flex items-center self-start px-3 py-1 rounded-full text-[11px] font-semibold mb-3 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)' }}
                                    >
                                        {milestone.phase}
                                    </span>

                                    {/* Title */}
                                    {milestone.title && (
                                        <h3
                                            className="text-[15px] font-bold leading-tight mb-2"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {milestone.title}
                                        </h3>
                                    )}

                                    {/* Description */}
                                    {milestone.description && (
                                        <p
                                            className="text-[13px] leading-relaxed flex-1"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {milestone.description}
                                        </p>
                                    )}

                                    {/* Status label at bottom */}
                                    <div className="mt-4 flex-shrink-0">
                                        <span
                                            className="text-[11px] font-medium"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.4, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {getStatusLabel(milestone.status)}
                                        </span>
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

export default RoadmapLayout;
