import { PaperAnalysis } from './analyst';

export interface Opportunity {
  name: string;
  type: 'platform' | 'feature' | 'api_plugin';
  oneLiner: string;
  coreValue: string;
  targetUser: string;
  whyNow: string;
  buildComplexity: 'Low' | 'Medium' | 'High';
}

export interface ArchitectOutput {
  opportunities: Opportunity[];
  recommendedPath: string;
  recommendationReason: string;
}

/**
 * Product Architect Agent
 * Turns research breakthroughs into concrete commercialization opportunities.
 */
export const runArchitectAgent = async (analysis: PaperAnalysis): Promise<ArchitectOutput> => {
  console.log(`[Product Architect] Brainstorming opportunities from breakthrough: ${analysis.coreBreakthrough}`);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const recommendedOpportunityName = "Nexus Insight Platform";

  return {
    opportunities: [
      {
        name: recommendedOpportunityName,
        type: "platform",
        oneLiner: "A B2B SaaS platform for automated code analysis using the novel method.",
        coreValue: analysis.coreBreakthrough,
        targetUser: "Engineering Managers at Mid-market SaaS companies",
        whyNow: "Increasing demand for automated quality assurance and reduced CI/CD costs.",
        buildComplexity: "Medium"
      },
      {
        name: "CodeLens API",
        type: "api_plugin",
        oneLiner: "An API for integrating the new analysis method into existing IDEs.",
        coreValue: "Seamless integration of advanced metrics.",
        targetUser: "Developer Tools companies",
        whyNow: "Shift-left movement in DevSecOps.",
        buildComplexity: "Low"
      }
    ],
    recommendedPath: recommendedOpportunityName,
    recommendationReason: "The platform approach offers the best balance of market timing and defensibility while leveraging the core breakthrough effectively."
  };
};
