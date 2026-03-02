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
                <div className="flex flex-col h-full px-16 pt-12 pb-10">
                    {/* Header — centered */}
                    <div className="flex flex-col items-center mb-6 flex-shrink-0 max-w-[960px] mx-auto w-full">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)' }}
                        >
                            PRICING
                        </span>
                        {title && (
                            <h1
                                className="text-[32px] font-bold leading-tight text-center mb-1"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p
                                className="text-[14px] text-center max-w-[480px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.6, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Tier cards row */}
                    <div className="flex-1 flex gap-5 items-stretch min-h-0 max-w-[960px] mx-auto w-full">
                        {tiers?.map((tier, index) => (
                            <div
                                key={index}
                                className="flex-1 flex flex-col rounded-xl overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                }}
                            >
                                {/* Card body */}
                                <div className="flex flex-col flex-1 px-7 py-6">
                                    {/* Tier name row with optional POPULAR pill */}
                                    <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                                        {tier.name && (
                                            <h3
                                                className="text-[13px] font-medium"
                                                style={{
                                                    color: 'var(--background-text, #101828)',
                                                    opacity: 0.65,
                                                    fontFamily: 'var(--heading-font-family, Inter)',
                                                }}
                                            >
                                                {tier.name}
                                            </h3>
                                        )}
                                        {tier.highlighted && (
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold"
                                                style={{
                                                    backgroundColor: 'var(--primary-color, #6366F1)',
                                                    color: 'var(--primary-text, #FFFFFF)',
                                                }}
                                            >
                                                POPULAR
                                            </span>
                                        )}
                                    </div>

                                    {/* Price */}
                                    {tier.price && (
                                        <div className="mb-1 flex-shrink-0">
                                            <span
                                                className="font-semibold leading-none"
                                                style={{
                                                    fontSize: '40px',
                                                    color: tier.highlighted ? 'var(--primary-color, #6366F1)' : 'var(--background-text, #101828)',
                                                    fontFamily: 'var(--heading-font-family, Inter)',
                                                }}
                                            >
                                                {tier.price}
                                            </span>
                                        </div>
                                    )}

                                    {/* Period */}
                                    {tier.period && (
                                        <p
                                            className="text-[13px] font-medium mb-5 flex-shrink-0"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.45, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {tier.period}
                                        </p>
                                    )}

                                    {/* Features list */}
                                    <ul className="flex flex-col gap-[9px] flex-1">
                                        {tier.features?.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-2">
                                                <span
                                                    className="flex-shrink-0 w-[5px] h-[5px] rounded-full mt-[6px]"
                                                    style={{ backgroundColor: 'var(--background-text, #101828)', opacity: 0.3 }}
                                                />
                                                <span
                                                    className="text-[13px] leading-relaxed"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.75, fontFamily: 'var(--body-font-family, Inter)' }}
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
