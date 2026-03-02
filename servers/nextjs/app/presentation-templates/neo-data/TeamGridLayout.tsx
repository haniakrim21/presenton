import * as z from 'zod';
import React from 'react';

export const Schema = z.object({
    title: z.string().max(40).describe('The main title of the slide').default('Meet the Team'),
    subtitle: z.string().max(200).describe('A short subtitle or description shown beneath the title').default('The people behind our mission — passionate experts driving meaningful results every day'),
    members: z.array(z.object({
        name: z.string().max(30).describe('The full name of the team member'),
        role: z.string().max(40).describe('The job title or role of the team member'),
        image: z.string().describe('URL to the team member profile image').default('https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Team+Member'),
        description: z.string().max(80).describe('A short one-liner about this team member'),
    })).max(9).describe('A list of up to 9 team members displayed in a 3-column grid').default([
        { name: 'Sarah Chen', role: 'Chief Executive Officer', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Sarah+Chen', description: '15 years scaling B2B SaaS from seed to exit across three continents.' },
        { name: 'Marcus Rivera', role: 'Chief Technology Officer', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Marcus+Rivera', description: 'Ex-Google engineer, led infrastructure serving 200M daily active users.' },
        { name: 'Priya Nair', role: 'VP of Product', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Priya+Nair', description: 'Product leader with a track record of 0-to-1 launches in enterprise software.' },
        { name: 'James Okafor', role: 'Head of Design', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=James+Okafor', description: 'Award-winning UX designer focused on simplicity and accessibility at scale.' },
        { name: 'Lena Hoffmann', role: 'VP of Sales', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Lena+Hoffmann', description: 'Closed $40M in ARR over four years, building repeatable sales motions.' },
        { name: 'David Park', role: 'Head of Engineering', image: 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=David+Park', description: 'Full-stack architect passionate about developer experience and system reliability.' },
    ]),
});

export const layoutId = 'team-grid-layout';
export const layoutName = 'Team Grid';
export const layoutDescription = 'Grid of team member cards with roles and descriptions';

const TeamGridLayout: React.FC<{ data: Partial<z.infer<typeof Schema>> }> = ({ data }) => {
    const { title, subtitle, members } = data;

    // Determine columns: up to 4 per row for dense packing
    const colCount = members && members.length > 6 ? 4 : Math.min(members?.length ?? 4, 4);

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
                            {members?.length ?? 0} MEMBERS
                        </span>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center gap-4 py-1.5 px-3 rounded text-[10px] mb-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--card-color, #F3F4F6)', color: 'var(--background-text, #101828)', opacity: 0.6 }}
                    >
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>TEAM ROSTER</span>
                        <span style={{ color: 'var(--stroke, #E5E7EB)' }}>|</span>
                        {subtitle && <span style={{ fontFamily: 'var(--body-font-family, Inter)' }}>{subtitle}</span>}
                    </div>

                    {/* Dense 4-column team grid */}
                    <div
                        className="flex-1 grid gap-2 min-h-0 overflow-hidden"
                        style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
                    >
                        {members?.map((member, index) => (
                            <div
                                key={index}
                                className="rounded px-3 py-2.5 flex flex-col overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--card-color, #F3F4F6)',
                                    border: '1px dashed var(--stroke, #E5E7EB)',
                                }}
                            >
                                {/* Avatar badge row */}
                                <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                                    <div
                                        className="w-8 h-8 rounded overflow-hidden flex-shrink-0"
                                        style={{ border: '1px dashed var(--primary-color, #6366F1)' }}
                                    >
                                        <img
                                            src={member.image || 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=Team+Member'}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=6366F1&color=fff&size=128&name=${encodeURIComponent(member.name || 'TM')}`;
                                            }}
                                        />
                                    </div>
                                    {/* Index badge */}
                                    <span
                                        className="ml-auto text-[9px] font-bold"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.3, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Separator */}
                                <div className="w-full mb-1.5 flex-shrink-0" style={{ borderTop: '1px dashed var(--stroke, #E5E7EB)' }} />

                                {/* Name */}
                                {member.name && (
                                    <h3
                                        className="text-[11px] font-bold leading-tight mb-1 flex-shrink-0"
                                        style={{ color: 'var(--background-text, #101828)', fontFamily: 'var(--heading-font-family, Inter)' }}
                                    >
                                        {member.name}
                                    </h3>
                                )}

                                {/* Role badge */}
                                {member.role && (
                                    <span
                                        className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1.5 flex-shrink-0 self-start"
                                        style={{ backgroundColor: 'var(--primary-color, #6366F1)', color: 'var(--primary-text, #FFFFFF)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                                    >
                                        {member.role}
                                    </span>
                                )}

                                {/* Description */}
                                {member.description && (
                                    <p
                                        className="text-[10px] leading-[1.5] flex-1"
                                        style={{ color: 'var(--background-text, #101828)', opacity: 0.65, fontFamily: 'var(--body-font-family, Inter)' }}
                                    >
                                        {member.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamGridLayout;
