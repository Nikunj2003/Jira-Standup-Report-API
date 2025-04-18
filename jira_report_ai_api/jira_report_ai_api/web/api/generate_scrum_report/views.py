from fastapi import APIRouter, HTTPException

from jira_report_ai_api.web.api.generate_scrum_report.schema import JiraData, ScrumReportResponse
from jira_report_ai_api.log import logger
from jira_report_ai_api.services.exceptions import OpenAIAPIException
from jira_report_ai_api.services.ai_service import generate_ai_report

router = APIRouter()


@router.post("/generate-scrum-report", response_model=ScrumReportResponse)
async def generate_scrum_report(data: JiraData):
    """
    Endpoint that receives Jira sprint data and returns a generated scrum report.
    """
    try:
        report = generate_ai_report(data.jira_data)
        return ScrumReportResponse(report=report)
    except OpenAIAPIException as e:
        logger.error("Error generating scrum report: %s", e.message)
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        logger.exception("Unhandled exception in generate_scrum_report endpoint")
        raise HTTPException(status_code=500, detail="Internal Server Error")
