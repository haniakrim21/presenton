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

                {/* Main content */}
                <div className="flex flex-col h-full px-14 pt-10 pb-8">
                    {/* Header */}
                    <div className="mb-7">
                        {title && (
                            <h1
                                className="text-[42px] font-extrabold leading-tight mb-1"
                                style={{ color: 'var(--primary-color, #6366F1)', fontFamily: 'var(--heading-font-family, Inter)' }}
                            >
                                {title}
                            </h1>
                        )}
                        {/* Heavy accent bar */}
                        <div
                            className="h-[8px] w-20 rounded-full mt-2 mb-3"
                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                        />
                        {description && (
                            <p
                                className="text-[15px] font-medium leading-relaxed max-w-[560px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Steps row */}
                    <div className="flex-1 flex items-center">
                        <div className="relative w-full flex items-stretch gap-0">
                            {/* Thick connector bar behind step badges */}
                            <div
                                className="absolute left-0 right-0 z-0"
                                style={{
                                    height: '4px',
                                    top: '24px',
                                    backgroundColor: 'var(--primary-color, #6366F1)',
                                    opacity: 0.18,
                                }}
                            />

                            {steps?.map((step, index) => (
                                <React.Fragment key={index}>
                                    {/* Step card */}
                                    <div
                                        className="relative z-10 flex flex-col flex-1 mx-2 rounded-xl px-7 py-6 shadow-xl"
                                        style={{
                                            backgroundColor: 'var(--card-color, #F3F4F6)',
                                            borderTop: '6px solid var(--primary-color, #6366F1)',
                                            minHeight: '210px',
                                        }}
                                    >
                                        {/* Large numbered circle badge */}
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4"
                                            style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                        >
                                            <span
                                                className="font-extrabold leading-none"
                                                style={{ color: '#ffffff', fontSize: '18px', fontFamily: 'var(--heading-font-family, Inter)' }}
                                            >
                                                {step.number}
                                            </span>
                                        </div>
                                        {step.title && (
                                            <h3
                                                className="text-[16px] font-bold mb-2 leading-tight"
                                                style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                            >
                                                {step.title}
                                            </h3>
                                        )}
                                        {step.description && (
                                            <p
                                                className="text-[13px] leading-[1.55] flex-1"
                                                style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                            >
                                                {step.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Arrow between steps */}
                                    {index < (steps?.length ?? 0) - 1 && (
                                        <div className="relative z-10 flex-shrink-0 flex items-center">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12H19M19 12L13 6M19 12L13 18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
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
