import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Plan Comparison'),
    description: z.string().max(200).describe('A short description shown below the title').default('Compare our plans side by side to find the right fit for your team.'),
    columns: z.array(z.object({
        name: z.string().max(20).describe('The column header name, e.g. a product or option name'),
        highlighted: z.boolean().describe('Whether this column is highlighted as the recommended option'),
    })).max(4).describe('Up to 4 columns representing products, tiers, or options').default([
        { name: 'Starter', highlighted: false },
        { name: 'Growth', highlighted: true },
        { name: 'Enterprise', highlighted: false },
    ]),
    rows: z.array(z.object({
        feature: z.string().max(40).describe('The name of the feature or criterion for this row'),
        values: z.array(
            z.string().max(20).describe('The value for this column — use checkmark symbols or short text')
        ).describe('One value per column, in the same order as the columns array'),
    })).max(8).describe('Up to 8 feature rows comparing the columns').default([
        { feature: 'Monthly Price', values: ['$29', '$79', 'Custom'] },
        { feature: 'Team Members', values: ['Up to 5', 'Up to 25', 'Unlimited'] },
        { feature: 'Storage', values: ['10 GB', '100 GB', '1 TB'] },
        { feature: 'API Access', values: ['✗', '✓', '✓'] },
        { feature: 'Priority Support', values: ['✗', '✓', '✓'] },
        { feature: 'Custom Integrations', values: ['✗', '✗', '✓'] },
        { feature: 'SLA Guarantee', values: ['✗', '✗', '✓'] },
    ]),
});

export const layoutId = 'comparison-table-layout';
export const layoutName = 'Comparison Table';
export const layoutDescription = 'Feature comparison table for products or options';

const ComparisonTableLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, description, columns, rows } = data;

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
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[36px] font-bold leading-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Glowing accent line */}
                        <div
                            className="w-24 mb-3"
                            style={{
                                height: '3px',
                                background: 'var(--primary-color, #6366F1)',
                                boxShadow: '0 0 12px var(--primary-color, #6366F1)',
                            }}
                        />
                        {description && (
                            <p
                                className="text-[14px] leading-relaxed max-w-[520px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Table */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-lg" style={{ border: '1px solid var(--stroke, #E5E7EB)' }}>
                        {/* Header row — fully inverted with inset glow border */}
                        <div
                            className="flex flex-shrink-0"
                            style={{
                                backgroundColor: 'var(--primary-color, #6366F1)',
                                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                            }}
                        >
                            {/* Feature column header */}
                            <div
                                className="flex items-center px-5 py-3"
                                style={{
                                    width: '28%',
                                    minWidth: '160px',
                                    borderRight: '1px solid rgba(255,255,255,0.15)',
                                }}
                            >
                                <span
                                    className="text-[12px] font-semibold uppercase tracking-widest"
                                    style={{ color: 'var(--primary-text, #ffffff)', opacity: 0.7, fontFamily: 'var(--heading-font-family, Inter)', letterSpacing: '0.08em' }}
                                >
                                    Feature
                                </span>
                            </div>

                            {/* Column headers */}
                            {columns?.map((col, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="flex flex-1 items-center justify-center px-4 py-3"
                                    style={{
                                        borderRight: colIndex < (columns?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                                        filter: col.highlighted ? 'brightness(1.15)' : undefined,
                                    }}
                                >
                                    <span
                                        className="text-[14px] font-bold tracking-wide"
                                        style={{
                                            color: 'var(--primary-text, #ffffff)',
                                            fontFamily: 'var(--heading-font-family, Inter)',
                                        }}
                                    >
                                        {col.name}
                                    </span>
                                    {col.highlighted && (
                                        <span
                                            className="ml-2 text-[10px] font-semibold px-2 py-[2px] rounded-full"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'var(--primary-text, #ffffff)' }}
                                        >
                                            Popular
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Body rows */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {rows?.map((row, rowIndex) => {
                                const isEven = rowIndex % 2 === 0;
                                return (
                                    <div
                                        key={rowIndex}
                                        className="flex flex-1"
                                        style={{
                                            backgroundColor: isEven ? 'var(--background-color, #ffffff)' : 'var(--card-color, #F3F4F6)',
                                            borderBottom: rowIndex < (rows?.length ?? 0) - 1 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                        }}
                                    >
                                        {/* Feature name cell */}
                                        <div
                                            className="flex items-center px-5"
                                            style={{
                                                width: '28%',
                                                minWidth: '160px',
                                                borderRight: '1px solid var(--stroke, #E5E7EB)',
                                            }}
                                        >
                                            <span
                                                className="text-[13px] font-medium"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {row.feature}
                                            </span>
                                        </div>

                                        {/* Value cells */}
                                        {columns?.map((col, colIndex) => (
                                            <div
                                                key={colIndex}
                                                className="flex flex-1 items-center justify-center px-4"
                                                style={{
                                                    borderRight: colIndex < (columns?.length ?? 0) - 1 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                                    backgroundColor: col.highlighted ? 'var(--primary-color, #6366F1)' : 'transparent',
                                                    filter: col.highlighted ? 'brightness(1.15)' : undefined,
                                                }}
                                            >
                                                <span
                                                    className="text-[14px] font-medium"
                                                    style={{
                                                        color: col.highlighted
                                                            ? 'var(--primary-text, #ffffff)'
                                                            : 'var(--background-text, #101828)',
                                                        fontFamily: 'var(--body-font-family, Inter)',
                                                        opacity: col.highlighted ? 1 : 0.8,
                                                    }}
                                                >
                                                    {row.values?.[colIndex] ?? '—'}
                                                </span>
                                            </div>
                                        ))}
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

export default ComparisonTableLayout;
