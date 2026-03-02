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
                    {/* Header — centered */}
                    <div className="flex flex-col items-center mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight text-center tracking-wide pb-2"
                                style={{
                                    color: 'var(--background-text, #101828)',
                                    fontFamily: 'var(--heading-font-family, Inter)',
                                    borderBottom: '2px solid var(--primary-color, #6366F1)',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p
                                className="text-[14px] text-center max-w-[480px] mt-3"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.6, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Full table-style pricing cards — all borders visible */}
                    <div
                        className="flex-1 flex items-stretch min-h-0"
                        style={{ border: '1px solid var(--stroke, #E5E7EB)' }}
                    >
                        {tiers?.map((tier, index) => (
                            <div
                                key={index}
                                className="flex-1 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    borderRight: index < (tiers?.length ?? 0) - 1 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                }}
                            >
                                {/* Header row with primary-color background for highlighted tier */}
                                <div
                                    className="flex flex-col px-6 py-4 flex-shrink-0"
                                    style={{
                                        backgroundColor: tier.highlighted
                                            ? 'var(--primary-color, #6366F1)'
                                            : 'var(--card-color, #F3F4F6)',
                                        borderBottom: '1px solid var(--stroke, #E5E7EB)',
                                    }}
                                >
                                    {/* Tier name */}
                                    {tier.name && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3
                                                className="text-[13px] font-bold uppercase tracking-widest"
                                                style={{
                                                    color: tier.highlighted ? 'white' : 'var(--background-text, #101828)',
                                                    fontFamily: 'var(--heading-font-family, Inter)',
                                                    letterSpacing: '0.1em',
                                                }}
                                            >
                                                {tier.name}
                                            </h3>
                                            {tier.highlighted && (
                                                <span
                                                    className="text-[9px] font-bold px-2 py-[2px] uppercase tracking-wider"
                                                    style={{
                                                        backgroundColor: 'rgba(255,255,255,0.22)',
                                                        color: 'white',
                                                        fontFamily: 'var(--body-font-family, Inter)',
                                                        borderRadius: 0,
                                                    }}
                                                >
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Price */}
                                    {tier.price && (
                                        <span
                                            className="text-[36px] font-extrabold leading-none"
                                            style={{
                                                color: tier.highlighted ? 'white' : 'var(--background-text, #101828)',
                                                fontFamily: 'var(--heading-font-family, Inter)',
                                            }}
                                        >
                                            {tier.price}
                                        </span>
                                    )}

                                    {/* Period */}
                                    {tier.period && (
                                        <p
                                            className="text-[11px] mt-1 uppercase tracking-wider"
                                            style={{
                                                color: tier.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--background-text, #101828)',
                                                opacity: tier.highlighted ? 1 : 0.45,
                                                fontFamily: 'var(--body-font-family, Inter)',
                                            }}
                                        >
                                            {tier.period}
                                        </p>
                                    )}
                                </div>

                                {/* Features list with full border cell feel */}
                                <ul className="flex flex-col flex-1 overflow-hidden">
                                    {tier.features?.map((feature, featureIndex) => (
                                        <li
                                            key={featureIndex}
                                            className="flex items-center gap-3 px-5 py-[10px]"
                                            style={{
                                                borderBottom: featureIndex < (tier.features?.length ?? 0) - 1 ? '1px solid var(--stroke, #E5E7EB)' : 'none',
                                                backgroundColor: featureIndex % 2 === 0 ? 'var(--background-color, #ffffff)' : 'var(--card-color, #F3F4F6)',
                                            }}
                                        >
                                            {/* Square checkmark */}
                                            <span
                                                className="flex-shrink-0 w-4 h-4 flex items-center justify-center"
                                                style={{
                                                    backgroundColor: 'var(--primary-color, #6366F1)',
                                                    borderRadius: 0,
                                                }}
                                            >
                                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                                </svg>
                                            </span>
                                            <span
                                                className="text-[12px] leading-[1.4]"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.82, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingTierLayout;
