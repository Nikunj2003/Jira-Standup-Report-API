import json
import openai
from jira_report_ai_api.log import logger
from jira_report_ai_api.settings import settings
from jira_report_ai_api.services.exceptions import OpenAIAPIException

# Get environment variables from settings
OPENAI_API_KEY = settings.openai_api_key
OPENAI_API_ENDPOINT = settings.openai_api_endpoint
MODEL_ID = settings.model_id
AZURE_ENABLED = settings.azure_openai_enabled
AZURE_API_VERSION = settings.azure_openai_api_version

# Initialize the appropriate client based on configuration
if AZURE_ENABLED:
    client = openai.AzureOpenAI(
        api_key=OPENAI_API_KEY,
        api_version=AZURE_API_VERSION,
        azure_endpoint=OPENAI_API_ENDPOINT
    )
else:
    client = openai.OpenAI(
        api_key=OPENAI_API_KEY,
        base_url=OPENAI_API_ENDPOINT
    )

def generate_ai_report(jira_data: dict) -> str:
    """
    Generate a scrum report using the AI API based on provided Jira sprint data.
    """
    json_string = json.dumps(jira_data, indent=4)
    prompt = (
        "You are an AI Scrum Master. Analyze the following Jira sprint data and generate a detailed sprint report. "
        "The report should include the following sections:\n"
        "1. 📊 **Sprint Overview:** Brief summary of the sprint, including start and end dates.\n"
        "2. ✅ **Completed Work:** List of completed user stories and tasks with their story points.\n"
        "3. ⏳ **Incompleted Work:** Highlight unfinished tasks, blockers, and reasons for incompletion.\n"
        "4. 📈 **Team Performance:** Analyze velocity, burndown trends, and team collaboration.\n"
        "5. ⚠️ **Risks and Issues:** Identify any risks or impediments faced during the sprint.\n"
        "6. 💡 **Recommendations:** Suggestions for process improvements and how to increase efficiency.\n\n"
        "Here is the Jira sprint data:\n"
        f"{json_string}"
    )
    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": "You are an AI Scrum Master assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=700,
            temperature=0.7
        )
        content = response.choices[0].message.content.strip()
        return content
    except openai.APIError as e:
        logger.error("AI API error: %s", e)
        raise OpenAIAPIException(f"AI API error: {str(e)}")
    except Exception as e:
        logger.exception("Unexpected error occurred while generating AI report")
        raise OpenAIAPIException(f"Unexpected error: {str(e)}")