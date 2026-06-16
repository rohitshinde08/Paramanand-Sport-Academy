from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.database.connection import get_db
from app.models.postgres_models import Registration, Query, Sport, Coach
from app.core.dependencies import get_current_admin
from datetime import datetime, timedelta
from collections import OrderedDict

router = APIRouter(prefix="/admin/stats", tags=["Analytics"])

@router.get("/")
async def get_dashboard_stats(
    period: str = "all",
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    # Calculate the cutoff date based on period
    cutoff = None
    now = datetime.utcnow()
    if period == "month":
        cutoff = now - timedelta(days=30)
    elif period == "year":
        cutoff = now - timedelta(days=365)

    # Helper function to apply cutoff filter
    def apply_filter(query, model):
        if cutoff:
            return query.where(model.created_at >= cutoff)
        return query

    # 1. High-level counts
    total_athletes_q = select(func.count()).select_from(Registration).where(Registration.status == 'approved')
    total_athletes = (await db.execute(apply_filter(total_athletes_q, Registration))).scalar() or 0

    total_queries_q = select(func.count()).select_from(Query).where(Query.status == 'pending')
    total_queries = (await db.execute(apply_filter(total_queries_q, Query))).scalar() or 0

    total_sports = (await db.execute(select(func.count()).select_from(Sport))).scalar() or 0
    total_coaches = (await db.execute(select(func.count()).select_from(Coach))).scalar() or 0

    # 2. Registration status breakdown
    status_q = select(Registration.status, func.count(Registration.id)).group_by(Registration.status)
    status_result = await db.execute(apply_filter(status_q, Registration))
    registrations_by_status = [{"name": row[0].title(), "value": row[1]} for row in status_result.all()]

    # 3. Monthly Trends
    trend_q = select(Registration.created_at)
    trend_result = await db.execute(apply_filter(trend_q, Registration))
    dates = sorted([row[0] for row in trend_result.all()])
    
    trends = OrderedDict()
    for d in dates:
        key = d.strftime("%b %d") if period == "month" else d.strftime("%b %Y")
        trends[key] = trends.get(key, 0) + 1
    trend_data = [{"date": k, "registrations": v} for k, v in trends.items()]

    # 4. Registrations by Sport
    sports_q = select(Registration.sports)
    sports_result = await db.execute(apply_filter(sports_q, Registration))
    sports_lists = [row[0] for row in sports_result.all()]
    
    sport_counts = {}
    for s_list in sports_lists:
        if isinstance(s_list, list):
            for sport in s_list:
                sport_counts[sport] = sport_counts.get(sport, 0) + 1
                
    sports_data = [{"name": k, "value": v} for k, v in sport_counts.items()]

    return {
        "summary": {
            "total_athletes": total_athletes,
            "pending_queries": total_queries,
            "total_sports": total_sports,
            "total_coaches": total_coaches
        },
        "statusData": registrations_by_status,
        "trendData": trend_data,
        "sportsData": sports_data
    }
