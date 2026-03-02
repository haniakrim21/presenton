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
                <div className="flex flex-col h-full px-16 pt-14 pb-10">
                    {/* Header — centered */}
                    <div className="flex flex-col items-center mb-8 flex-shrink-0">
                        {title && (
                            <h1
                                className="text-[30px] font-semibold leading-tight text-center"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Hairline rule — centered */}
                        <div
                            className="w-full mt-3 mb-3"
                            style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.15 }}
                        />
                        {subtitle && (
                            <p
                                className="text-[14px] font-normal text-center max-w-[480px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.6, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Tier cards row */}
                    <div className="flex-1 flex gap-6 items-stretch min-h-0">
                        {tiers?.map((tier, index) => (
                            <div
                                key={index}
                                className="flex-1 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'transparent',
                                    borderBottom: tier.highlighted
                                        ? '1px solid var(--primary-color, #6366F1)'
                                        : '1px solid color-mix(in srgb, var(--stroke, #E5E7EB) 30%, transparent)',
                                }}
                            >
                                {/* Card body */}
                                <div className="flex flex-col flex-1 px-6 py-5">
                                    {/* Tier name */}
                                    {tier.name && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3
                                                className="text-[13px] font-medium uppercase tracking-widest"
                                                style={{
                                                    color: tier.highlighted
                                                        ? 'var(--primary-color, #6366F1)'
                                                        : 'var(--background-text, #101828)',
                                                    fontFamily: 'var(--heading-font-family, Inter)',
                                                    letterSpacing: '0.1em',
                                                    opacity: tier.highlighted ? 1 : 0.6,
                                                }}
                                            >
                                                {tier.name}
                                            </h3>
                                            {tier.highlighted && (
                                                <span
                                                    className="text-[10px] font-medium px-2 py-[2px]"
                                                    style={{
                                                        color: 'var(--primary-color, #6366F1)',
                                                        fontFamily: 'var(--body-font-family, Inter)',
                                                        border: '1px solid var(--primary-color, #6366F1)',
                                                        opacity: 0.7,
                                                    }}
                                                >
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Price */}
                                    {tier.price && (
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span
                                                className="text-[38px] font-normal leading-none"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                            >
                                                {tier.price}
                                            </span>
                                        </div>
                                    )}

                                    {/* Period */}
                                    {tier.period && (
                                        <p
                                            className="text-[12px] font-normal mb-4"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.45, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {tier.period}
                                        </p>
                                    )}

                                    {/* Thin divider */}
                                    <div
                                        className="w-full mb-4 flex-shrink-0"
                                        style={{ height: '1px', backgroundColor: 'var(--stroke, #E5E7EB)', opacity: 0.3 }}
                                    />

                                    {/* Features list — em-dash style */}
                                    <ul className="flex flex-col gap-[10px] flex-1">
                                        {tier.features?.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-2">
                                                <span
                                                    className="flex-shrink-0 text-[14px] font-normal leading-none mt-[2px]"
                                                    style={{
                                                        color: 'var(--primary-color, #6366F1)',
                                                        opacity: tier.highlighted ? 0.5 : 0.35,
                                                    }}
                                                >
                                                    —
                                                </span>
                                                <span
                                                    className="text-[14px] font-normal leading-[1.7]"
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
