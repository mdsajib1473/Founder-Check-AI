"""Mobile & Offline API Routes"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List
from app.services.mobile_offline import mobile_offline_service

router = APIRouter(prefix="/api/mobile", tags=["Mobile & Offline"])


@router.post("/notifications/send")
async def send_notification(startup_id: str, notification_type: str,
                           title: str, message: str, data: Dict):
    """Send push notification"""
    try:
        notification = mobile_offline_service.send_push_notification(
            startup_id, notification_type, title, message, data
        )
        return {'success': True, 'notification': {
            'id': notification.notification_id,
            'type': notification.type.value,
            'sent_at': notification.sent_at.isoformat()
        }}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/notifications/{startup_id}")
async def get_notifications(startup_id: str, limit: int = 20):
    """Get notifications for startup"""
    try:
        notifications = mobile_offline_service.get_notifications(startup_id, limit)
        return {'success': True, 'notifications': notifications, 'count': len(notifications)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark notification as read"""
    try:
        success = mobile_offline_service.mark_notification_read(notification_id)
        return {'success': success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/notifications/milestone")
async def send_milestone_notification(startup_id: str, milestone_name: str):
    """Send milestone notification"""
    try:
        notification = mobile_offline_service.send_milestone_notification(
            startup_id, milestone_name
        )
        return {'success': True, 'notification_id': notification.notification_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/notifications/competitor-alert")
async def send_competitor_alert(startup_id: str, competitor_name: str, alert_text: str):
    """Send competitor alert"""
    try:
        notification = mobile_offline_service.send_competitor_alert(
            startup_id, competitor_name, alert_text
        )
        return {'success': True, 'notification_id': notification.notification_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/notifications/funding-news")
async def send_funding_news(startup_id: str, news_title: str, amount: str):
    """Send funding news alert"""
    try:
        notification = mobile_offline_service.send_funding_news(
            startup_id, news_title, amount
        )
        return {'success': True, 'notification_id': notification.notification_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/offline/package")
async def create_offline_package(startup_id: str, data: Dict):
    """Create offline data package"""
    try:
        package = mobile_offline_service.create_offline_package(startup_id, data)
        return {'success': True, 'package': {
            'id': package.package_id,
            'size_mb': package.size_mb
        }}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/offline/package/{startup_id}")
async def get_offline_package(startup_id: str):
    """Get offline package for startup"""
    try:
        package = mobile_offline_service.get_offline_package(startup_id)
        if not package:
            return {'success': False, 'message': 'No offline package found'}
        return {'success': True, 'package': package}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/offline/download")
async def download_offline_data(startup_id: str):
    """Download offline data"""
    try:
        data = mobile_offline_service.download_offline_data(startup_id)
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sync/changes")
async def sync_offline_changes(startup_id: str, changes: List[Dict]):
    """Sync offline changes"""
    try:
        result = mobile_offline_service.sync_offline_changes(startup_id, changes)
        return {'success': True, 'sync_result': result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sync/status")
async def get_sync_status():
    """Get sync queue status"""
    try:
        status = mobile_offline_service.get_sync_status()
        return {'success': True, 'status': status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard/{startup_id}")
async def get_mobile_dashboard(startup_id: str):
    """Get mobile dashboard summary"""
    try:
        dashboard = mobile_offline_service.get_mobile_dashboard_summary(startup_id)
        return {'success': True, 'dashboard': dashboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
