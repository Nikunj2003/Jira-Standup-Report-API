from pydantic import BaseModel


class JiraData(BaseModel):
    jira_data: dict
    
class ScrumReportResponse(BaseModel):
    report: str