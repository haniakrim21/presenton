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

                {/* Decorative floating circle */}
                <div
                    className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full pointer-events-none"
                    style={{ backgroundColor: 'var(--primary-color)', opacity: 0.05 }}
                />

                {/* Main content */}
                <div className="flex flex-col h-full px-16 pt-12 pb-10">
                    {/* Header — centered */}
                    <div className="flex flex-col items-center mb-8 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[38px] font-extrabold leading-tight text-center"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Gradient accent bar — centered */}
                        <div
                            className="h-[6px] w-28 rounded-full mt-2 mb-3"
                            style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--primary-color)44)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[14px] leading-relaxed text-center max-w-[480px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.6, fontFamily: 'var(--body-font-family, Inter)' }}
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
                                className="flex-1 flex flex-col rounded-2xl overflow-hidden"
                                style={{
                                    boxShadow: tier.highlighted
                                        ? '0 4px 16px rgba(0,0,0,0.08)'
                                        : '0 4px 16px rgba(0,0,0,0.08)',
                                }}
                            >
                                {/* Two-tone header band */}
                                <div
                                    className="flex-shrink-0 flex items-center justify-between px-7 py-4"
                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                >
                                    <div className="flex items-center gap-2">
                                        {tier.name && (
                                            <h3
                                                className="text-[15px] font-bold uppercase tracking-widest"
                                                style={{
                                                    color: 'var(--primary-text, #FFFFFF)',
                                                    fontFamily: 'var(--heading-font-family, Inter)',
                                                    letterSpacing: '0.08em',
                                                }}
                                            >
                                                {tier.name}
                                            </h3>
                                        )}
                                        {tier.highlighted && (
                                            <span
                                                className="text-[10px] font-semibold px-2 py-[2px] rounded-full"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                                    color: 'var(--primary-text, #FFFFFF)',
                                                    fontFamily: 'var(--body-font-family, Inter)',
                                                }}
                                            >
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card body */}
                                <div
                                    className="flex flex-col flex-1 px-7 py-5"
                                    style={{ backgroundColor: 'var(--card-color, #F3F4F6)' }}
                                >
                                    {/* Price */}
                                    {tier.price && (
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span
                                                className="text-[40px] font-extrabold leading-none"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                            >
                                                {tier.price}
                                            </span>
                                        </div>
                                    )}

                                    {/* Period as pill label */}
                                    {tier.period && (
                                        <span
                                            className="inline-flex rounded-full px-3 py-1 text-[11px] font-medium mb-4 w-fit"
                                            style={{
                                                backgroundColor: 'var(--primary-color, #6366F1)',
                                                color: 'var(--primary-text, #FFFFFF)',
                                                opacity: 0.12,
                                                fontFamily: 'var(--body-font-family, Inter)',
                                            }}
                                        >
                                            {tier.period}
                                        </span>
                                    )}
                                    {tier.period && (
                                        <span
                                            className="inline-flex rounded-full px-3 py-1 text-[11px] font-medium mb-4 w-fit -mt-[30px]"
                                            style={{
                                                color: 'var(--primary-color, #6366F1)',
                                                fontFamily: 'var(--body-font-family, Inter)',
                                            }}
                                        >
                                            {tier.period}
                                        </span>
                                    )}

                                    {/* Divider */}
                                    <div
                                        className="w-full h-[1px] mb-4 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                    />

                                    {/* Features list */}
                                    <ul className="flex flex-col gap-[10px] flex-1">
                                        {tier.features?.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-2">
                                                {/* Pill badge checkmark */}
                                                <span
                                                    className="flex-shrink-0 w-[16px] h-[16px] rounded-full flex items-center justify-center mt-[1px]"
                                                    style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                                >
                                                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                                        <path
                                                            d="M1.5 4.5L3.5 6.5L7.5 2.5"
                                                            stroke="white"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <span
                                                    className="text-[13px] leading-relaxed"
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
