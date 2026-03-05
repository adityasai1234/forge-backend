import { Router, Request, Response } from 'express';
import { runAnalystAgent, AnalystInput } from '../agents/analyst';
import { runArchitectAgent } from '../agents/architect';
import { runStrategistAgent } from '../agents/strategist';
import { supabase } from '../db/supabase';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: AnalystInput = req.body;

    if (!input.title || !input.abstract) {
      res.status(400).json({ error: 'Missing title or abstract in request body' });
      return;
    }

    console.log(`Starting ForgeFlow for paper: ${input.title}`);

    // Step 1: Analyst
    const analystResult = await runAnalystAgent(input);

    // Step 2: Architect
    const architectResult = await runArchitectAgent(analystResult.paperAnalysis);

    // Step 3: Strategist
    const strategistResult = await runStrategistAgent(architectResult);

    // Prepare final output
    const output = {
      analyst_summary: analystResult.paperAnalysis,
      architect_design: architectResult,
      strategist_plan: strategistResult.strategy,
      nova_score: strategistResult.novaScore
    };

    // Save to Supabase (assuming forge_opportunities exists, skip if no credentials)
    // We generate a faux paper_id if none provided (normally this comes from forge_papers)
    const paperId = req.body.paper_id || uuidv4();
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('Saving results to Supabase matching Python backend behavior...');
      const { error } = await supabase
        .from('forge_opportunities')
        .upsert({
          paper_id: paperId,
          analyst_summary: output.analyst_summary,
          architect_design: output.architect_design,
          strategist_plan: output.strategist_plan,
          nova_score: output.nova_score
        });

      if (error) {
        console.error('Failed to save to Supabase:', error.message);
      }
    }

    res.json(output);
  } catch (error: any) {
    console.error('Error during ForgeFlow execution:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
