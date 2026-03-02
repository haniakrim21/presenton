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
                <div className="flex flex-col h-full px-14 pt-10 pb-8">
                    {/* Header — centered */}
                    <div className="flex flex-col items-center mb-6 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[42px] font-extrabold leading-tight text-center"
                                style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Heavy accent bar — centered */}
                        <div
                            className="h-[8px] w-20 rounded-full mt-2 mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[15px] font-medium text-center max-w-[480px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Tier cards row */}
                    <div className="flex-1 flex gap-5 items-stretch min-h-0">
                        {tiers?.map((tier, index) => (
                            <div
                                key={index}
                                className="flex-1 flex flex-col rounded-xl overflow-hidden"
                                style={
                                    tier.highlighted
                                        ? {
                                            boxShadow: '0 20px 48px 0 rgba(99,102,241,0.28)',
                                        }
                                        : {
                                            backgroundColor: 'var(--card-color, #F3F4F6)',
                                            borderTop: '6px solid var(--primary-color, #6366F1)',
                                            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.10)',
                                        }
                                }
                            >
                                {/* Highlighted tier: FULL primary-color top section */}
                                {tier.highlighted && (
                                    <div
                                        className="flex-shrink-0 px-7 pt-6 pb-5"
                                        style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                    >
                                        {/* Tier name + badge */}
                                        {tier.name && (
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3
                                                    className="font-extrabold uppercase tracking-widest"
                                                    style={{
                                                        fontSize: '16px',
                                                        color: '#ffffff',
                                                        fontFamily: 'var(--heading-font-family, Inter)',
                                                        letterSpacing: '0.1em',
                                                    }}
                                                >
                                                    {tier.name}
                                                </h3>
                                                <span
                                                    className="font-bold uppercase tracking-widest rounded-full px-3 py-[3px]"
                                                    style={{
                                                        fontSize: '10px',
                                                        backgroundColor: 'rgba(255,255,255,0.22)',
                                                        color: '#ffffff',
                                                        fontFamily: 'var(--body-font-family, Inter)',
                                                        letterSpacing: '0.1em',
                                                    }}
                                                >
                                                    POPULAR
                                                </span>
                                            </div>
                                        )}
                                        {/* Price — 48px extrabold */}
                                        {tier.price && (
                                            <div className="flex items-baseline gap-1 mb-1">
                                                <span
                                                    className="font-extrabold leading-none"
                                                    style={{
                                                        fontSize: '48px',
                                                        color: '#ffffff',
                                                        fontFamily: 'var(--heading-font-family, Inter)',
                                                    }}
                                                >
                                                    {tier.price}
                                                </span>
                                            </div>
                                        )}
                                        {tier.period && (
                                            <p
                                                className="text-[13px] font-medium"
                                                style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {tier.period}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Card body */}
                                <div
                                    className="flex flex-col flex-1 px-7 py-6"
                                    style={{ backgroundColor: tier.highlighted ? 'var(--card-color, #F3F4F6)' : 'transparent' }}
                                >
                                    {/* Non-highlighted: name + price */}
                                    {!tier.highlighted && (
                                        <>
                                            {tier.name && (
                                                <h3
                                                    className="font-extrabold uppercase tracking-widest mb-2"
                                                    style={{
                                                        fontSize: '16px',
                                                        color: 'var(--primary-color, #6366F1)',
                                                        fontFamily: 'var(--heading-font-family, Inter)',
                                                        letterSpacing: '0.1em',
                                                    }}
                                                >
                                                    {tier.name}
                                                </h3>
                                            )}
                                            {tier.price && (
                                                <div className="flex items-baseline gap-1 mb-1">
                                                    <span
                                                        className="font-extrabold leading-none"
                                                        style={{
                                                            fontSize: '48px',
                                                            color: 'var(--background-text, #101828)',
                                                            fontFamily: 'var(--heading-font-family, Inter)',
                                                        }}
                                                    >
                                                        {tier.price}
                                                    </span>
                                                </div>
                                            )}
                                            {tier.period && (
                                                <p
                                                    className="text-[12px] font-medium mb-4"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.45, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {tier.period}
                                                </p>
                                            )}
                                            {/* Thick divider */}
                                            <div
                                                className="w-full mb-4 flex-shrink-0"
                                                style={{ height: '3px', backgroundColor: 'var(--primary-color, #6366F1)', opacity: 0.18 }}
                                            />
                                        </>
                                    )}

                                    {/* Highlighted: just the divider before features */}
                                    {tier.highlighted && (
                                        <div
                                            className="w-full mb-4 flex-shrink-0"
                                            style={{ height: '3px', backgroundColor: 'var(--primary-color, #6366F1)', opacity: 0.18 }}
                                        />
                                    )}

                                    {/* Features list */}
                                    <ul className="flex flex-col gap-[10px] flex-1">
                                        {tier.features?.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-3">
                                                {/* Bold checkmark circle */}
                                                <span
                                                    className="flex-shrink-0 rounded-full flex items-center justify-center mt-[1px]"
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        backgroundColor: 'var(--primary-color, #6366F1)',
                                                    }}
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path
                                                            d="M2 5L4.2 7.2L8 3"
                                                            stroke="white"
                                                            strokeWidth="1.8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <span
                                                    className="text-[13px] font-medium leading-[1.5]"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.8, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
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
