from fastapi.routing import APIRouter

from jira_report_ai_api.web.api import docs, generate_scrum_report, monitoring

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(docs.router)
api_router.include_router(generate_scrum_report.router, tags=["generate scrum report"])
