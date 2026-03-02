import { createTemplateEntry, TemplateWithData } from '../utils';
import settings from './settings.json';

import StepProcessLayout, { Schema as stepProcessSchema, layoutId as stepProcessId, layoutName as stepProcessName, layoutDescription as stepProcessDesc } from './StepProcessLayout';
import SWOTGridLayout, { Schema as swotGridSchema, layoutId as swotGridId, layoutName as swotGridName, layoutDescription as swotGridDesc } from './SWOTGridLayout';
import PersonaCardLayout, { Schema as personaCardSchema, layoutId as personaCardId, layoutName as personaCardName, layoutDescription as personaCardDesc } from './PersonaCardLayout';
import PricingTierLayout, { Schema as pricingTierSchema, layoutId as pricingTierId, layoutName as pricingTierName, layoutDescription as pricingTierDesc } from './PricingTierLayout';
import RoadmapLayout, { Schema as roadmapSchema, layoutId as roadmapId, layoutName as roadmapName, layoutDescription as roadmapDesc } from './RoadmapLayout';
import DataCalloutLayout, { Schema as dataCalloutSchema, layoutId as dataCalloutId, layoutName as dataCalloutName, layoutDescription as dataCalloutDesc } from './DataCalloutLayout';
import QuoteHighlightLayout, { Schema as quoteHighlightSchema, layoutId as quoteHighlightId, layoutName as quoteHighlightName, layoutDescription as quoteHighlightDesc } from './QuoteHighlightLayout';
import ComparisonTableLayout, { Schema as comparisonTableSchema, layoutId as comparisonTableId, layoutName as comparisonTableName, layoutDescription as comparisonTableDesc } from './ComparisonTableLayout';
import MilestoneLayout, { Schema as milestoneSchema, layoutId as milestoneId, layoutName as milestoneName, layoutDescription as milestoneDesc } from './MilestoneLayout';
import TeamGridLayout, { Schema as teamGridSchema, layoutId as teamGridId, layoutName as teamGridName, layoutDescription as teamGridDesc } from './TeamGridLayout';

const templateName = 'neo-editorial';

export const neoEditorialTemplates: TemplateWithData[] = [
    createTemplateEntry(StepProcessLayout, stepProcessSchema, stepProcessId, stepProcessName, stepProcessDesc, templateName, 'StepProcessLayout'),
    createTemplateEntry(SWOTGridLayout, swotGridSchema, swotGridId, swotGridName, swotGridDesc, templateName, 'SWOTGridLayout'),
    createTemplateEntry(PersonaCardLayout, personaCardSchema, personaCardId, personaCardName, personaCardDesc, templateName, 'PersonaCardLayout'),
    createTemplateEntry(PricingTierLayout, pricingTierSchema, pricingTierId, pricingTierName, pricingTierDesc, templateName, 'PricingTierLayout'),
    createTemplateEntry(RoadmapLayout, roadmapSchema, roadmapId, roadmapName, roadmapDesc, templateName, 'RoadmapLayout'),
    createTemplateEntry(DataCalloutLayout, dataCalloutSchema, dataCalloutId, dataCalloutName, dataCalloutDesc, templateName, 'DataCalloutLayout'),
    createTemplateEntry(QuoteHighlightLayout, quoteHighlightSchema, quoteHighlightId, quoteHighlightName, quoteHighlightDesc, templateName, 'QuoteHighlightLayout'),
    createTemplateEntry(ComparisonTableLayout, comparisonTableSchema, comparisonTableId, comparisonTableName, comparisonTableDesc, templateName, 'ComparisonTableLayout'),
    createTemplateEntry(MilestoneLayout, milestoneSchema, milestoneId, milestoneName, milestoneDesc, templateName, 'MilestoneLayout'),
    createTemplateEntry(TeamGridLayout, teamGridSchema, teamGridId, teamGridName, teamGridDesc, templateName, 'TeamGridLayout'),
];

export { settings };
