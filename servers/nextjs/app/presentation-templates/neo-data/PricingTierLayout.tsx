import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the pricing slide').default('Choose Your Plan'),
    subtitle: z.string().max(100).describe('A short subtitle shown below the title').default('Flexible pricing for teams of all sizes'),
    tiers: z.array(z.object({
        name: z.string().max(20).describe('The name of this pricing tier, e.g. Basic'),
        price: z.string().max(15).describe('The price of this tier, e.g. $49 or Free'),
        period: z.string().max(15).describe('The billing period, e.g. per month or per user/mo'),
        features: z.array(
            z.string().max(60).describe('A feature included in this tier')
        ).max(6).describe('Up to 6 features for this tier'),
        highlighted: z.boolean().describe('Whether this tier is visually highlighted as the recommended option'),
    })).max(3).describe('Up to 3 pricing tiers shown side by side').default([
        {
            name: 'Basic',
            price: '$29',
            period: 'per month',
            features: [
                'Up to 5 team members',
                '10 GB storage',
                'Basic analytics',
                'Email support',
                'API access',
            ],
            highlighted: false,
        },
        {
            name: 'Pro',
            price: '$79',
            period: 'per month',
            features: [
                'Up to 25 team members',
                '100 GB storage',
                'Advanced analytics',
                'Priority support',
                'API access',
                'Custom integrations',
            ],
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'contact us',
            features: [
                'Unlimited team members',
                'Unlimited storage',
                'Full analytics suite',
                'Dedicated account manager',
                'SSO & advanced security',
                'SLA guarantee',
            ],
            highlighted: false,
        },
    ]),
});

export const layoutId = 'pricing-tier-layout';
export const layoutName = 'Pricing Tiers';
export const layoutDescription = 'Two to three column pricing comparison with features';

const PricingTierLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, subtitle, tiers } = data;

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
                <div className="flex flex-col h-full px-10 pt-10 pb-8">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-2 flex-shrink-0">
                        <div>
                            {title && (
                                <h1
                                    className="text-[22px] font-semibold tracking-tight leading-tight"
                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                >
                                    {title}
                                </h1>
                            )}
                        </div>
                        <span
                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-1"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                        >
                            {tiers?.length ?? 0} TIERS
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>PRICING MATRIX</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        {subtitle && <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{subtitle}</span>}
                    </div>

                    {/* Tier columns */}
                    <div className="flex-1 grid gap-2 min-h-0" style={{ gridTemplateColumns: `repeat(${tiers?.length ?? 3}, 1fr)` }}>
                        {tiers?.map((tier, index) => (
                            <div
                                key={index}
                                className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    border: tier.highlighted
                                        ? '1px dashed var(--primary-color, #6366F1)'
                                        : '1px dashed var(--stroke, #E5E7EB)',
                                }}
                            >
                                {/* Tier header */}
                                <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-[0.15em]"
                                        style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                    >
                                        {tier.name}
                                    </span>
                                    {tier.highlighted && (
                                        <span
                                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                        >
                                            POPULAR
                                        </span>
                                    )}
                                </div>

                                {/* Monospace price */}
                                <div className="flex items-baseline gap-1 mb-0.5 flex-shrink-0">
                                    <span
                                        className="font-light leading-none"
                                        style={{
                                            fontSize: '42px',
                                            color: tier.highlighted ? 'var(--primary-color, #6366F1)' : 'var(--background-text, #101828)',
                                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                        }}
                                    >
                                        {tier.price}
                                    </span>
                                </div>

                                {/* Period */}
                                {tier.period && (
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 flex-shrink-0"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.4, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        {tier.period}
                                    </span>
                                )}

                                {/* Thin separator */}
                                <div className="w-full mb-2 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />

                                {/* Features list */}
                                <ul className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                                    {tier.features?.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-2">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[4px]"
                                                style={{ backgroundColor: tier.highlighted ? 'var(--primary-color, #6366F1)' : 'var(--stroke, #E5E7EB)' }}
                                            />
                                            <span
                                                className="text-[11px] leading-[1.5]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Feature count */}
                                <div className="mt-1.5 flex-shrink-0">
                                    <span
                                        className="text-[9px] font-bold"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.3, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        {tier.features?.length ?? 0} FEATURES INCLUDED
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingTierLayout;
