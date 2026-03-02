import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Customer Success'),
    statValue: z.string().max(10).describe('The large featured statistic value, e.g. 98%').default('98%'),
    statLabel: z.string().max(40).describe('A short label describing what the statistic represents').default('Customer Satisfaction Score'),
    description: z.string().max(200).describe('Supporting context or explanation of the statistic').default('Based on over 4,200 responses collected across enterprise and mid-market accounts in the trailing twelve months.'),
    highlights: z.array(
        z.string().max(80).describe('A short highlight or supporting data point')
    ).max(4).describe('Up to 4 supporting highlights shown as a horizontal row of bullet points').default([
        'NPS score of 72, top quartile in SaaS',
        '< 2 hour average support response time',
        '94% renewal rate year over year',
        '3.2x average account expansion',
    ]),
});

export const layoutId = 'data-callout-layout';
export const layoutName = 'Data Callout';
export const layoutDescription = 'Large centered statistic with supporting context and bullet points';

const DataCalloutLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, statValue, statLabel, description, highlights } = data;

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
                    {/* Header — top-left */}
                    <div className="flex-shrink-0">
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
                    </div>

                    {/* Center stat area — massive spacing above and below */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-0 py-8">
                        {/* Giant stat value — LIGHT weight, not extrabold */}
                        {statValue && (
                            <span
                                className="font-light leading-none"
                                style={{
                                    fontSize: '80px',
                                    color: 'var(--primary-color, #6366F1)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    lineHeight: 1,
                                }}
                            >
                                {statValue}
                            </span>
                        )}

                        {/* Stat label */}
                        {statLabel && (
                            <p
                                className="text-[18px] font-medium mt-6 mb-5"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {statLabel}
                            </p>
                        )}

                        {/* Description */}
                        {description && (
                            <p
                                className="text-[13px] font-light leading-loose max-w-[480px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Bottom highlights row — en-dash prefix, no dots */}
                    {highlights && highlights.length > 0 && (
                        <>
                            <div
                                className="h-px w-full flex-shrink-0 mb-5"
                                style={{ backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.3 }}
                            />
                            <div className="flex-shrink-0 flex items-start justify-center gap-10">
                                {highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-start gap-2 max-w-[180px]">
                                        <span
                                            className="flex-shrink-0 text-[13px] font-light leading-none mt-[3px]"
                                            style={{ color: 'var(--primary-color, #6366F1)' }}
                                        >
                                            &ndash;
                                        </span>
                                        <span
                                            className="text-[13px] font-light leading-loose"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.55, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {highlight}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default DataCalloutLayout;
