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
                <div className="flex flex-col h-full px-14 pt-12 pb-10">
                    {/* Header — top-left */}
                    <div className="flex-shrink-0">
                        <h1
                            className="text-[36px] font-bold leading-tight mb-2"
                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                        >
                            {title}
                        </h1>
                        {/* Glowing accent line */}
                        <div
                            className="w-24 mb-4"
                            style={{
                                height: '3px',
                                background: 'var(--primary-color, #6366F1)',
                                boxShadow: '0 0 12px var(--primary-color, #6366F1)',
                            }}
                        />
                    </div>

                    {/* Center stat area — large inverted panel */}
                    <div className="flex-1 flex items-center justify-center min-h-0 py-4">
                        <div
                            className="rounded-lg px-16 py-8 flex flex-col items-center text-center"
                            style={{
                                backgroundColor: 'var(--primary-color, #6366F1)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)',
                                minWidth: '480px',
                                maxWidth: '640px',
                            }}
                        >
                            {/* Giant stat value with glow */}
                            {statValue && (
                                <span
                                    className="font-extrabold leading-none"
                                    style={{
                                        fontSize: '96px',
                                        color: 'var(--primary-text, #ffffff)',
                                        fontFamily: 'var(--heading-font-family, Inter)',
                                        lineHeight: 1,
                                        textShadow: '0 0 30px var(--primary-color, #6366F1)',
                                    }}
                                >
                                    {statValue}
                                </span>
                            )}

                            {/* Stat label */}
                            {statLabel && (
                                <p
                                    className="text-[20px] font-semibold mt-3 mb-4"
                                    style={{ color: 'var(--primary-text, #ffffff)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {statLabel}
                                </p>
                            )}

                            {/* Thin white separator */}
                            <div
                                className="w-24 mb-4"
                                style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}
                            />

                            {/* Description */}
                            {description && (
                                <p
                                    className="text-[14px] leading-relaxed max-w-[440px]"
                                    style={{ color: 'var(--primary-text, #ffffff)', opacity: 0.8, fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bottom highlights row */}
                    {highlights && highlights.length > 0 && (
                        <div
                            className="flex-shrink-0 flex items-start justify-center gap-6 pt-4"
                            style={{
                                borderTop: '1px solid var(--stroke, #E5E7EB)',
                            }}
                        >
                            {highlights.map((highlight, index) => (
                                <div key={index} className="flex items-start gap-2 max-w-[210px]">
                                    <span
                                        className="flex-shrink-0 w-[7px] h-[7px] rounded-full mt-[5px]"
                                        style={{ backgroundColor: 'var(--primary-text, #ffffff)', opacity: 0.7 }}
                                    />
                                    <span
                                        className="text-[12.5px] leading-[1.5]"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                    >
                                        {highlight}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DataCalloutLayout;
