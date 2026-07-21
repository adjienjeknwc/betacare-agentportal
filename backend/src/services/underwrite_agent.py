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
    print("Error: Missing underwriting case ID argument.")
    sys.exit(1)

case_id = sys.argv[1]

# MongoDB URI and credentials
mongo_uri = "mongodb+srv://admin_aditi:nNuuDu565TsD0llZ@cluster0.9unw5nk.mongodb.net/?appName=Cluster0"
client = pymongo.MongoClient(mongo_uri)
db = client['test']
collection = db['underwritingcases']

# Fetch the case
case = collection.find_one({"_id": ObjectId(case_id)})
if not case:
    print(f"Error: Underwriting case with ID {case_id} not found.")
    sys.exit(1)

customer_name = case.get("customerName", "Unknown")
plan_name = case.get("planName", "Term Life")
sum_assured = case.get("sumAssured", 0)
premium = case.get("premium", 0)

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
# 2. DEFINE UNDERWRITING RISK AGENTS
# ==============================================================================

risk_analyst = Agent(
    role='Senior Risk Underwriter',
    goal='Analyze policy proposals and calculate liability thresholds.',
    backstory='You are an expert actuary with decades of experience at analyzing insurance fraud and risk ratios.',
    verbose=True,
    llm=secure_llm,
    max_rpm=2
)

compliance_officer = Agent(
    role='Compliance & Quality Inspector',
    goal='Certify the final risk rating tier and write a comprehensive audit report.',
    backstory='You are an insurance compliance officer ensuring all underwriting matches strict actuarial standards.',
    verbose=True,
    llm=secure_llm,
    max_rpm=2
)

# ==============================================================================
# 3. DEFINE CREW TASKS
# ==============================================================================

analysis_task = Task(
    description=f"""
    Analyze the following insurance proposal case details:
    - Customer: {customer_name}
    - Plan Product: {plan_name}
    - Sum Assured: ₹{sum_assured:,}
    - Premium Charged: ₹{premium:,}/yr

    Evaluate:
    1. Financial Risk: Is the ratio of Premium to Sum Assured reasonable? (e.g. less than 0.1% for high sum assured can be risky).
    2. Liability exposure: Assess the total potential claim liability for the company.
    3. Flag any potential red flags or concerns.
    """,
    expected_output='A detailed actuarial risk analysis report.',
    agent=risk_analyst
)

decision_task = Task(
    description="""
    Review the risk analysis report and make a final underwriting decision.
    Classify the risk into one of three tiers: Low, Medium, or High.

    You must format your final answer exactly as follows (including the markers):

    === RISK ===
    [Insert either 'Low', 'Medium', or 'High' here]

    === NOTES ===
    [Insert a detailed, professional markdown audit report justifying the decision here]
    """,
    expected_output='A structured underwriting risk decision report.',
    agent=compliance_officer
)

# ==============================================================================
# 4. RUN THE CREW
# ==============================================================================
crew = Crew(
    agents=[risk_analyst, compliance_officer],
    tasks=[analysis_task, decision_task],
    process=Process.sequential,
    max_rpm=2
)

print(f"🕵️ Running AI Underwriting Risk Crew for Case ID: {case_id}...")
result = crew.kickoff()
result_text = str(result)

# ==============================================================================
# 5. PARSE OUTCOMES & SAVE TO DATABASE
# ==============================================================================
risk_rating = "Medium"  # Default fallback
notes = result_text

try:
    if "=== RISK ===" in result_text and "=== NOTES ===" in result_text:
        parts = result_text.split("=== NOTES ===")
        notes = parts[1].strip()
        risk_raw = parts[0].split("=== RISK ===")[1].strip()
        
        for r in ["Low", "Medium", "High"]:
            if r.lower() in risk_raw.lower():
                risk_rating = r
                break
except Exception as parse_error:
    print(f"Warning: Error parsing structured results: {str(parse_error)}")

# Save to MongoDB
update_result = collection.update_one(
    {"_id": ObjectId(case_id)},
    {
        "$set": {
            "aiRiskRating": risk_rating,
            "aiNotes": notes
        }
    }
)

if update_result.modified_count > 0:
    print(f"✅ Successfully updated Case {case_id} with Risk: {risk_rating}")
else:
    print(f"⚠️ Case {case_id} assessed but database record was not modified.")

print("Process finished successfully.")
