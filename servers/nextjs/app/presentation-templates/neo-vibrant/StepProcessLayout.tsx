import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Our Process'),
    description: z.string().max(200).describe('A short description of the process shown on the slide').default('A step-by-step guide to our approach'),
    steps: z.array(z.object({
        number: z.string().max(2).describe('The step number or short label, e.g. 01'),
        title: z.string().max(30).describe('The title of this step'),
        description: z.string().max(120).describe('A short description of what happens in this step'),
    })).max(5).describe('A list of up to 5 process steps shown horizontally').default([
        { number: '01', title: 'Discovery', description: 'We identify your core challenges, goals, and opportunities through deep research and stakeholder interviews.' },
        { number: '02', title: 'Strategy', description: 'We craft a tailored roadmap aligned with your business objectives and technical constraints.' },
        { number: '03', title: 'Execution', description: 'Our team delivers fast, iterative cycles with clear milestones and transparent communication.' },
        { number: '04', title: 'Launch', description: 'We ship with confidence, providing end-to-end support through deployment and beyond.' },
    ]),
});

export const layoutId = 'step-process-layout';
export const layoutName = 'Step Process';
export const layoutDescription = 'Numbered horizontal steps with descriptions for process flows';

const StepProcessLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, description, steps } = data;

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
                <div className="flex flex-col h-full px-16 pt-14 pb-12">
                    {/* Header */}
                    <div className="mb-8">
                        {title && (
                            <h1
                                className="text-[38px] font-extrabold leading-tight mb-1"
                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Gradient accent bar */}
                        <div
                            className="h-[6px] w-28 rounded-full mt-2 mb-3"
                            style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--primary-color)44)' }}
                        />
                        {description && (
                            <p
                                className="text-[14px] leading-relaxed max-w-[560px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Steps row */}
                    <div className="flex-1 flex items-center">
                        <div className="relative w-full flex items-stretch gap-3">
                            {steps?.map((step, index) => (
                                <React.Fragment key={index}>
                                    {/* Step card — two-tone with rounded-2xl */}
                                    <div
                                        className="relative z-10 flex flex-col flex-1 rounded-2xl overflow-hidden"
                                        style={{
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                            minHeight: '200px',
                                        }}
                                    >
                                        {/* Two-tone header band */}
                                        <div
                                            className="h-8 w-full flex-shrink-0 flex items-center px-5"
                                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                        >
                                            {/* Pill badge step number */}
                                            <span
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[16px] font-bold flex-shrink-0"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                                    color: 'var(--primary-text, #FFFFFF)',
                                                }}
                                            >
                                                {step.number}
                                            </span>
                                        </div>

                                        {/* Card body */}
                                        <div
                                            className="flex flex-col flex-1 px-5 py-4"
                                            style={{ backgroundColor: 'var(--card-color, #F3F4F6)' }}
                                        >
                                            {step.title && (
                                                <h3
                                                    className="text-[17px] font-bold mb-2 leading-tight"
                                                    style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                                >
                                                    {step.title}
                                                </h3>
                                            )}
                                            {step.description && (
                                                <p
                                                    className="text-[13px] leading-relaxed flex-1"
                                                    style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                                >
                                                    {step.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Arrow between steps */}
                                    {index < (steps?.length ?? 0) - 1 && (
                                        <div className="relative z-10 flex-shrink-0 flex items-center self-center">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    style={{ stroke: 'var(--primary-color, #6366F1)' }}
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepProcessLayout;
