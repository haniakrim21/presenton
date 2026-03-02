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
                    {/* Header — top-left */}
                    <div className="flex-shrink-0">
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
                    </div>

                    {/* Center: stat value in a bordered box + label + description */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-h-0 gap-5">
                        {/* Bordered box for stat value */}
                        {statValue && (
                            <div
                                className="flex flex-col items-center justify-center px-12 py-6"
                                style={{
                                    border: '1px solid var(--stroke, #E5E7EB)',
                                    borderRadius: 0,
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                }}
                            >
                                <span
                                    className="font-extrabold leading-none"
                                    style={{
                                        fontSize: '88px',
                                        color: 'var(--primary-color, #6366F1)',
                                        fontFamily: 'var(--heading-font-family, Inter)',
                                        lineHeight: 1,
                                    }}
                                >
                                    {statValue}
                                </span>
                                {statLabel && (
                                    <div
                                        className="mt-3 pt-3 w-full text-center"
                                        style={{ borderTop: '1px solid var(--stroke, #E5E7EB)' }}
                                    >
                                        <p
                                            className="text-[16px] font-bold tracking-wide uppercase"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.06em' }}
                                        >
                                            {statLabel}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        {description && (
                            <p
                                className="text-[14px] leading-relaxed max-w-[520px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.6, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Bottom highlights — 2x2 grid with borders */}
                    {highlights && highlights.length > 0 && (
                        <div
                            className="flex-shrink-0"
                            style={{
                                borderTop: '1px solid var(--stroke, #E5E7EB)',
                                paddingTop: '16px',
                            }}
                        >
                            <div
                                className="grid grid-cols-2 gap-5"
                                style={{}}
                            >
                                {highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        {/* 4x4 square bullet */}
                                        <span
                                            className="flex-shrink-0 mt-[5px]"
                                            style={{
                                                width: '4px',
                                                height: '4px',
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                borderRadius: 0,
                                            }}
                                        />
                                        <span
                                            className="text-[12px] leading-[1.5]"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.75, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {highlight}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DataCalloutLayout;
