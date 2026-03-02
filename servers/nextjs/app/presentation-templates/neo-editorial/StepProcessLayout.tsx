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
                <div className="flex flex-col h-full px-16 pt-14 pb-12">
                    {/* Header */}
                    <div className="mb-6 flex-shrink-0">
                        <span
                            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block"
                            style={{ color: 'var(--primary-color, #6366F1)' }}
                        >
                            METHODOLOGY
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
                        {description && (
                            <p
                                className="text-[15px] leading-[1.85] max-w-[560px]"
                                style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Steps row — asymmetric editorial sections */}
                    <div className="flex-1 flex items-stretch gap-0 min-h-0">
                        {steps?.map((step, index) => (
                            <React.Fragment key={index}>
                                {/* Step editorial section */}
                                <div
                                    className="flex flex-col flex-1 px-6 py-4"
                                    style={{
                                        borderBottom: '1px solid var(--stroke, #E5E7EB)',
                                    }}
                                >
                                    {/* Step number — editorial style */}
                                    <span
                                        className="text-[13px] font-medium uppercase tracking-[0.2em] mb-2 block"
                                        style={{ color: 'var(--primary-color, #6366F1)' }}
                                    >
                                        STEP {step.number}
                                    </span>

                                    {/* Thick rule separator */}
                                    <div
                                        className="h-1 w-10 mb-4 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--primary-color, #6366F1)' }}
                                    />

                                    {step.title && (
                                        <h3
                                            className="text-[20px] font-black leading-[1.1] tracking-tight mb-3"
                                            style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                        >
                                            {step.title}
                                        </h3>
                                    )}
                                    {step.description && (
                                        <p
                                            className="text-[13px] leading-[1.85] flex-1"
                                            style={{ color: 'var(--background-text, #101828)', opacity: 0.7, fontFamily: 'var(--body-font-family, Inter)' }}
                                        >
                                            {step.description}
                                        </p>
                                    )}
                                </div>

                                {/* Column rule between steps */}
                                {index < (steps?.length ?? 0) - 1 && (
                                    <div
                                        className="w-px self-stretch flex-shrink-0"
                                        style={{ backgroundColor: 'var(--stroke, #E5E7EB)' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepProcessLayout;
