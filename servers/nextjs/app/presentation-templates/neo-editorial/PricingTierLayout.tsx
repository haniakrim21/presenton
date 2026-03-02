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
                <div className="flex flex-col h-full px-16 pt-14 pb-12">
                    {/* Header — left-aligned editorial */}
                    <div className="mb-5 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            PRICING
                        </span>
                        {title && (
                            <h1
                                className="text-[48px] font-black leading-[1.1] tracking-tight mb-2"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Thick editorial rule */}
                        <div
                            className="h-1 w-full mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {subtitle && (
                            <p
                                className="text-[15px] leading-[1.85] max-w-[520px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Tier columns — editorial comparison, no card backgrounds, thin column rules */}
                    <div className="flex-1 flex items-stretch min-h-0">
                        {tiers?.map((tier, index) => (
                            <React.Fragment key={index}>
                                {/* Column rule between tiers */}
                                {index > 0 && (
                                    <div
                                        className="w-px self-stretch flex-shrink-0"
                                        style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                    />
                                )}
                                <div
                                    className="flex-1 flex flex-col px-7 py-4 overflow-hidden"
                                >
                                    {/* Tier name category label */}
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2 block"
                                        style={{ color: tier.highlighted ? 'var(--primary-color, #6366F1)' : 'var(--background-text, #101828)', opacity: tier.highlighted ? 1 : 0.5 }}
                                    >
                                        {tier.name}
                                        {tier.highlighted && ' — RECOMMENDED'}
                                    </span>

                                    {/* Thick rule under tier name */}
                                    <div
                                        className="h-1 w-full mb-4 flex-shrink-0"
                                        style={{ backgroundColor: tier.highlighted ? 'var(--primary-color, #6366F1)' : 'var(--stroke, #E5E7EB)' }}
                                    />

                                    {/* Price — large editorial */}
                                    {tier.price && (
                                        <div className="mb-1">
                                            <span
                                                className="font-black leading-none tracking-tight"
                                                style={{
                                                    fontSize: '52px',
                                                    color: 'var(--background-text, #101828)',
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
                                            className="text-[13px] font-medium uppercase tracking-[0.2em] mb-5"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.45, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {tier.period}
                                        </p>
                                    )}

                                    {/* Features list — no bullets, thin bottom borders only */}
                                    <ul className="flex flex-col flex-1 overflow-hidden">
                                        {tier.features?.map((feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-center gap-3 py-[7px]"
                                                style={{ borderBottom: '1px solid var(--stroke, #E5E7EB)' }}
                                            >
                                                <span
                                                    className="text-[13px] font-medium uppercase tracking-[0.1em] flex-shrink-0"
                                                    style={{ color: 'var(--primary-color, #6366F1)', opacity: tier.highlighted ? 1 : 0.5 }}
                                                >
                                                    —
                                                </span>
                                                <span
                                                    className="text-[13px] leading-[1.5]"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.8, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingTierLayout;
