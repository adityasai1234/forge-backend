"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyst_1 = require("../agents/analyst");
const architect_1 = require("../agents/architect");
const strategist_1 = require("../agents/strategist");
const supabase_1 = require("../db/supabase");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const input = req.body;
        if (!input.title || !input.abstract) {
            res.status(400).json({ error: 'Missing title or abstract in request body' });
            return;
        }
        console.log(`Starting ForgeFlow for paper: ${input.title}`);
        // Step 1: Analyst
        const analystResult = await (0, analyst_1.runAnalystAgent)(input);
        // Step 2: Architect
        const architectResult = await (0, architect_1.runArchitectAgent)(analystResult.paperAnalysis);
        // Step 3: Strategist
        const strategistResult = await (0, strategist_1.runStrategistAgent)(architectResult);
        // Prepare final output
        const output = {
            analyst_summary: analystResult.paperAnalysis,
            architect_design: architectResult,
            strategist_plan: strategistResult.strategy,
            nova_score: strategistResult.novaScore
        };
        // Save to Supabase (assuming forge_opportunities exists, skip if no credentials)
        // We generate a faux paper_id if none provided (normally this comes from forge_papers)
        const paperId = req.body.paper_id || (0, uuid_1.v4)();
        if (supabase_1.supabase) {
            console.log('Saving results to Supabase matching Python backend behavior...');
            const { error } = await supabase_1.supabase
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
        else {
            console.log('Skipping Supabase save: client not initialized (missing credentials).');
        }
        res.json(output);
    }
    catch (error) {
        console.error('Error during ForgeFlow execution:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
exports.default = router;
