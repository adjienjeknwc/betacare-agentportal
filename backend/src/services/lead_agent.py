import os
import sys
import time
import pymongo
from bson.objectid import ObjectId
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM

# ==============================================================================
# 0. INPUT ARGUMENT & CONNECTION CONFIGURATION
# ==============================================================================
if len(sys.argv) < 2:
    print("Error: Missing Lead ID argument.")
    sys.exit(1)

lead_id = sys.argv[1]

# MongoDB URI and credentials
mongo_uri = "mongodb+srv://admin_aditi:nNuuDu565TsD0llZ@cluster0.9unw5nk.mongodb.net/?appName=Cluster0"
client = pymongo.MongoClient(mongo_uri)
db = client['test']
collection = db['leads']

# Fetch the lead
lead = collection.find_one({"_id": ObjectId(lead_id)})
if not lead:
    print(f"Error: Lead case with ID {lead_id} not found.")
    sys.exit(1)

customer_name = lead.get("customerName", "Unknown")
email = lead.get("email", "N/A")
phone = lead.get("phone", "N/A")
dob = lead.get("dob", "N/A")
gender = lead.get("gender", "Male")
annual_income = lead.get("annualIncome", 1800000)
city = lead.get("city", "Mumbai")
state = lead.get("state", "Maharashtra")
smoking_status = lead.get("smokingStatus", "Non-Smoker")
coverage_amount = lead.get("coverageAmount", 28500000)
policy_term = lead.get("policyTerm", 35)

# ==============================================================================
# 1. SETUP CREWAI LLM (Routed via LiteLLM for retries)
# ==============================================================================
os.environ["LITELLM_NUM_RETRIES"] = "5"
gemini_key = os.environ.get("GEMINI_API_KEY") or ""

secure_llm = LLM(
    model="gemini/gemini-flash-lite-latest",
    api_key=gemini_key,
    is_litellm=True
)

# ==============================================================================
# 2. DEFINE THE SPECIALIZED SALES ADVISOR AGENTS
# ==============================================================================

business_analyst = Agent(
    role='Senior Business Analyst',
    goal='Analyze customer profiles to extract logical requirements, business rules, and financial parameters.',
    backstory='You are an expert reverse-engineer of client financial needs, identifying core product requirements from customer profiles.',
    verbose=True,
    llm=secure_llm,
    max_rpm=2
)

software_engineer = Agent(
    role='Secure Software Developer',
    goal='Configure the optimal policy coverage, address pricing errors, and design a secure rider package.',
    backstory='You are a policy design engineer who calculates exact, secure cover configurations, ensuring zero vulnerabilities in the financial structure.',
    verbose=True,
    llm=secure_llm,
    max_rpm=2
)

qa_architect = Agent(
    role='QA Test Architect',
    goal='Verify the policy design against compliance rules and write a formal suitability certification report.',
    backstory='You run exhaustive validation checks on proposals and write official suitability certification reviews.',
    verbose=True,
    llm=secure_llm,
    max_rpm=2
)

# ==============================================================================
# 3. DEFINE CREW TASKS
# ==============================================================================

audit_task = Task(
    description=f"""
    Analyze the following customer profile for business rules and validations:
    - Customer Name: {customer_name}
    - Annual Income: ₹{annual_income:,}
    - Age/DOB: {dob}
    - Gender: {gender}
    - Location: {city}, {state}
    - Smoking Status: {smoking_status}
    - Coverage Target: ₹{coverage_amount:,}
    - Target Term: {policy_term} years

    Formulate the core requirements and validation checkpoints for the profile.
    CRITICAL RULE: If the customer's annual income is less than ₹300,000, you must flag this in the requirements, enforce recommending a basic Micro-Insurance plan, and reject high sum assured recommendations.
    """,
    expected_output='A markdown list of profile validation parameters and requirements.',
    agent=business_analyst
)

coding_task = Task(
    description=f"""
    Using the requirements checklist, configure the optimal policy architecture:
    1. Product Class: Is Term, Whole Life, or ULIP best suited? (Note: If income is under ₹300,000, force 'Micro-Insurance Term' class).
    2. Sum Assured Audit: Check if sum assured target of ₹{coverage_amount:,} is safe/adequate (should be 10x-20x annual income).
    3. Custom Rider Add-ons: Package matching riders (e.g. Critical Illness, Accidental Disability, Waiver of Premium) based on occupation and age.
    """,
    expected_output='An engineered policy package configuration document.',
    agent=software_engineer
)

certification_task = Task(
    description="""
    Review the engineered policy package and perform compliance checks.
    Determine the final suitability rating: 'Optimal Fit', 'Moderate Fit', or 'Low Fit'. (Note: If income is under ₹300,000, the rating MUST be 'Low Fit' due to low income safety limits).
    Write a formal certification report outlining the strategic selling strategy and objections handling script.

    You must format your final answer exactly as follows (including the markers):

    === RATING ===
    [Insert either 'Optimal Fit', 'Moderate Fit', or 'Low Fit' here]

    === NOTES ===
    [Insert a bulleted, highly actionable suitability certification pitch guide for the sales agent here]
    """,
    expected_output='A structured suitability certification document for the sales agent.',
    agent=qa_architect
)

# ==============================================================================
# 4. RUN THE CREW
# ==============================================================================
crew = Crew(
    agents=[business_analyst, software_engineer, qa_architect],
    tasks=[audit_task, coding_task, certification_task],
    process=Process.sequential,
    max_rpm=2
)

print(f"🚀 Starting Self-Correcting Lead Advisor Crew for ID: {lead_id}...")
result = crew.kickoff()
result_text = str(result)

# ==============================================================================
# 5. PARSE OUTCOMES & SAVE TO DATABASE
# ==============================================================================
advice_rating = "Optimal Fit"  # Default fallback
notes = result_text

try:
    if "=== RATING ===" in result_text and "=== NOTES ===" in result_text:
        parts = result_text.split("=== NOTES ===")
        notes = parts[1].strip()
        rating_raw = parts[0].split("=== RATING ===")[1].strip()
        
        for r in ["Optimal Fit", "Moderate Fit", "Low Fit"]:
            if r.lower() in rating_raw.lower():
                advice_rating = r
                break
except Exception as parse_error:
    print(f"Warning: Error parsing structured results: {str(parse_error)}")

# Save to MongoDB
update_result = collection.update_one(
    {"_id": ObjectId(lead_id)},
    {
        "$set": {
            "aiAdviceRating": advice_rating,
            "aiAdviceNotes": notes
        }
    }
)

if update_result.modified_count > 0:
    print(f"✅ Successfully updated Lead {lead_id} with Advice Rating: {advice_rating}")
else:
    print(f"⚠️ Lead {lead_id} assessed but database record was not modified.")

print("Process finished successfully.")
