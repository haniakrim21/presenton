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

                {/* Main content — asymmetric 2fr/3fr split */}
                <div className="flex flex-col h-full px-0 pt-0 pb-0">
                    {/* Full-width header */}
                    <div className="px-16 pt-14 pb-0 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            KEY METRIC
                        </span>
                        {title && (
                            <h1
                                className="text-[48px] font-black leading-[1.1] tracking-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Thick editorial rule above stat */}
                        <div
                            className="h-1 w-full"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                    </div>

                    {/* Content area — giant ultralight stat with pull-quote description */}
                    <div className="flex-1 grid grid-cols-[2fr_3fr] min-h-0">
                        {/* Left: ultra-thin giant stat */}
                        <div
                            className="flex flex-col justify-center px-16 py-6"
                            style={{ borderRight: '1px solid var(--stroke, #E5E7EB)' }}
                        >
                            {statValue && (
                                <span
                                    className="font-extralight leading-none tracking-tight"
                                    style={{
                                        fontSize: '110px',
                                        color: 'var(--background-text, #101828)',
                                        fontFamily: 'var(--heading-font-family, Inter)',
                                        lineHeight: 0.9,
                                    }}
                                >
                                    {statValue}
                                </span>
                            )}
                            {statLabel && (
                                <p
                                    className="text-[13px] font-medium uppercase tracking-[0.2em] mt-4"
                                    style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--body-font-family, Inter)' }}
                                >
                                    {statLabel}
                                </p>
                            )}
                            {/* Thick editorial rule below stat */}
                            <div
                                className="h-1 w-20 mt-4"
                                style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                            />
                        </div>

                        {/* Right: pull-quote style description + highlights */}
                        <div className="flex flex-col justify-center px-10 py-6 gap-5">
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

                            {/* Thin rule before highlights */}
                            {highlights && highlights.length > 0 && (
                                <div
                                    className="h-px w-full flex-shrink-0"
                                    style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                />
                            )}

                            {/* Supporting highlights */}
                            {highlights && highlights.length > 0 && (
                                <div className="flex flex-col gap-[10px]">
                                    {highlights.map((highlight, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 pb-2"
                                            style={{ borderBottom: '1px solid var(--stroke, #E5E7EB)' }}
                                        >
                                            <span
                                                className="text-[13px] font-medium uppercase tracking-[0.2em] flex-shrink-0 mt-[1px]"
                                                style={{ color: 'var(--primary-color, #6366F1)' }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span
                                                className="text-[13px] leading-[1.85]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.75, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {highlight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DataCalloutLayout;
