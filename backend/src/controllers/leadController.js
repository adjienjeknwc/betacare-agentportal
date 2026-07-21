// backend/src/controllers/leadController.js
const Lead = require('../models/Lead');
const Quote = require('../models/Quote');

exports.createLead = async (req, res, next) => {
  try {
    const newLead = await Lead.create({ 
      ...req.body, 
      agentId: req.user.id 
    });
    return res.status(201).json({ success: true, data: newLead });
  } catch (err) {
    next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const filter = { agentId: req.user.id };
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, agentId: req.user.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or not authorized' });
    }
    return res.status(200).json(lead);
  } catch (err) {
    next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate({ _id: req.params.id, agentId: req.user.id }, req.body, { new: true, runValidators: true });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or not authorized' });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, agentId: req.user.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or not authorized' });
    }
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const scope = { agentId: req.user.id };

    const [total, hot, warm, cold, quotes] = await Promise.all([
      Lead.countDocuments(scope),
      Lead.countDocuments({ ...scope, temperature: 'Hot' }),
      Lead.countDocuments({ ...scope, temperature: 'Warm' }),
      Lead.countDocuments({ ...scope, temperature: 'Cold' }),
      Lead.countDocuments({ ...scope, status: 'Quote Shared' })
    ]);

    return res.status(200).json({
      success: true,
      metrics: { total, hot, warm, cold, quotes }
    });
  } catch (err) {
    next(err);
  }
};

exports.runLeadAiAudit = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const lead = await Lead.findOne({ _id: leadId, agentId: req.user.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or not authorized' });
    }

    const runDirectGeminiFallback = async () => {
      console.log("⚡ Executing direct Gemini fallback audit (Vercel serverless mode)...");
      const apiKey = process.env.GEMINI_API_KEY || "";
      const prompt = `You are a team of three specialized AI agents (Senior Business Analyst, Secure Software Developer, and QA Test Architect) advising a life insurance sales agent. Analyze this lead profile:
- Name: ${lead.customerName}
- Income: ₹${lead.annualIncome}
- DOB: ${lead.dob}
- Gender: ${lead.gender}
- Location: ${lead.city}, ${lead.state}
- Product Interest: ${lead.productInterest || 'Term Life'}

CRITICAL RULE: If the customer's annual income is less than ₹300,000, you must:
1. Flag the rating as 'Low Fit'.
2. Exclusively recommend a basic Micro-Insurance term plan rather than a high-value product class.
3. Suggest simple micro-term options in the notes.

Collaborate to perform the following:
1. Senior Business Analyst: Formulate lead validation parameters and requirements based on demographic data.
2. Secure Software Developer: Design the optimal policy class, sum assured fit, and package logical riders (Critical Illness, Accidental Disability, Waiver of Premium).
3. QA Test Architect: Run compliance checks on the proposed design and write the suitability certification review.

Provide your final suitability recommendation in the following format:
=== RATING ===
[Optimal Fit / Moderate Fit / Low Fit]
=== NOTES ===
[Provide a bulleted list of strategic pitch advice and rider packaging suggestions for the sales agent, referencing the agents' analysis]`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        let advice_rating = "Optimal Fit";
        let notes = text;

        if (text.includes("=== RATING ===") && text.includes("=== NOTES ===")) {
          const parts = text.split("=== NOTES ===");
          notes = parts[1].trim();
          const rating_raw = parts[0].split("=== RATING ===")[1];
          
          for (const r of ["Optimal Fit", "Moderate Fit", "Low Fit"]) {
            if (rating_raw.toLowerCase().includes(r.toLowerCase())) {
              advice_rating = r;
              break;
            }
          }
        }

        const updatedLead = await Lead.findOneAndUpdate({ _id: leadId, agentId: req.user.id }, {
          aiAdviceRating: advice_rating,
          aiAdviceNotes: notes
        }, { new: true });

        return res.status(200).json({ success: true, data: updatedLead });
      } catch (geminiError) {
        console.error("❌ Gemini Fallback Error:", geminiError);
        return res.status(500).json({ success: false, message: 'AI Lead Audit failed on Vercel', error: geminiError.message });
      }
    };

    // If running on Vercel, immediately run the Gemini API fallback (bypass subprocess)
    if (process.env.VERCEL) {
      return runDirectGeminiFallback();
    }

    const { exec } = require('child_process');
    const path = require('path');

    // Path to the python interpreter in the virtual environment
    const pythonPath = "/Users/aditi/my-first-agents/venv/bin/python";
    const scriptPath = path.join(__dirname, '..', 'services', 'lead_agent.py');

    console.log(`🤖 Launching AI Lead Strategy Advisor Crew for Lead ID: ${leadId}`);
    
    // Pass Lead ID to the Python script
    exec(`"${pythonPath}" "${scriptPath}" ${leadId}`, {
      env: { 
        ...process.env, 
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || "" 
      }
    }, async (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Python execution error: ${error.message}. Falling back to direct Gemini...`);
        return runDirectGeminiFallback();
      }

      console.log(`💡 Python Output:\n${stdout}`);

      const updatedLead = await Lead.findOne({ _id: leadId, agentId: req.user.id });
      return res.status(200).json({ success: true, data: updatedLead });
    });
  } catch (err) {
    next(err);
  }
};