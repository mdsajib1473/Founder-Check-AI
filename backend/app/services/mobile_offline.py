"""
Mobile & Offline - Push notifications, offline data, sync
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass
from enum import Enum


class NotificationType(str, Enum):
    """Notification types"""
    MILESTONE = "milestone"
    COMPETITOR_ALERT = "competitor_alert"
    FUNDING_NEWS = "funding_news"
    MARKET_INSIGHT = "market_insight"
    INVESTOR_UPDATE = "investor_update"


@dataclass
class PushNotification:
    """Push notification"""
    notification_id: str
    startup_id: str
    type: NotificationType
    title: str
    message: str
    data: Dict
    sent_at: datetime
    read: bool = False


@dataclass
class OfflineDataPackage:
    """Offline data package"""
    package_id: str
    startup_id: str
    created_at: datetime
    data: Dict
    size_mb: float
    last_synced: Optional[datetime] = None


@dataclass
class SyncEvent:
    """Sync event for offline mode"""
    sync_id: str
    timestamp: datetime
    action: str
    entity_type: str
    entity_id: str
    data: Dict
    synced: bool = False


class MobileOfflineService:
    """Service for mobile & offline functionality"""

    def __init__(self):
        self.notifications: Dict[str, PushNotification] = {}
        self.offline_packages: Dict[str, OfflineDataPackage] = {}
        self.sync_queue: List[SyncEvent] = []
        self.notification_count = 0

    # ========== PUSH NOTIFICATIONS ==========

    def send_push_notification(self, startup_id: str, notification_type: str,
                               title: str, message: str, data: Dict) -> PushNotification:
        """Send push notification"""
        self.notification_count += 1
        notification_id = f"notif_{self.notification_count}"

        notification = PushNotification(
            notification_id=notification_id,
            startup_id=startup_id,
            type=NotificationType(notification_type),
            title=title,
            message=message,
            data=data,
            sent_at=datetime.utcnow()
        )

        self.notifications[notification_id] = notification
        return notification

    def get_notifications(self, startup_id: str, limit: int = 20) -> List[Dict]:
        """Get notifications for startup"""
        notifications = [
            n for n in self.notifications.values()
            if n.startup_id == startup_id
        ]
        notifications.sort(key=lambda x: x.sent_at, reverse=True)

        return [{
            'id': n.notification_id,
            'type': n.type.value,
            'title': n.title,
            'message': n.message,
            'data': n.data,
            'sent_at': n.sent_at.isoformat(),
            'read': n.read
        } for n in notifications[:limit]]

    def mark_notification_read(self, notification_id: str) -> bool:
        """Mark notification as read"""
        if notification_id in self.notifications:
            self.notifications[notification_id].read = True
            return True
        return False

    def send_milestone_notification(self, startup_id: str, milestone_name: str) -> PushNotification:
        """Send milestone notification"""
        return self.send_push_notification(
            startup_id,
            'milestone',
            f'🎯 Milestone Reached',
            f'Congratulations! You\'ve reached: {milestone_name}',
            {'milestone': milestone_name, 'icon': '🎯'}
        )

    def send_competitor_alert(self, startup_id: str, competitor_name: str, alert_text: str) -> PushNotification:
        """Send competitor alert"""
        return self.send_push_notification(
            startup_id,
            'competitor_alert',
            f'📊 Competitor Alert: {competitor_name}',
            alert_text,
            {'competitor': competitor_name}
        )

    def send_funding_news(self, startup_id: str, news_title: str, amount: str) -> PushNotification:
        """Send funding news alert"""
        return self.send_push_notification(
            startup_id,
            'funding_news',
            '💰 Funding News',
            f'{news_title} - {amount}',
            {'title': news_title, 'amount': amount}
        )

    def send_market_insight(self, startup_id: str, insight: str) -> PushNotification:
        """Send market insight"""
        return self.send_push_notification(
            startup_id,
            'market_insight',
            '📈 Market Insight',
            insight,
            {'insight': insight}
        )

    # ========== OFFLINE DATA ==========

    def create_offline_package(self, startup_id: str, analysis_data: Dict) -> OfflineDataPackage:
        """Create offline data package"""
        package_id = f"pkg_{len(self.offline_packages)}"
        size_mb = self._estimate_size(analysis_data)

        package = OfflineDataPackage(
            package_id=package_id,
            startup_id=startup_id,
            created_at=datetime.utcnow(),
            data=analysis_data,
            size_mb=size_mb
        )

        self.offline_packages[package_id] = package
        return package

    def _estimate_size(self, data: Dict) -> float:
        """Estimate data package size in MB"""
        import json
        json_str = json.dumps(data)
        size_bytes = len(json_str.encode('utf-8'))
        return round(size_bytes / (1024 * 1024), 2)

    def get_offline_package(self, startup_id: str) -> Optional[Dict]:
        """Get latest offline package for startup"""
        packages = [
            p for p in self.offline_packages.values()
            if p.startup_id == startup_id
        ]
        if not packages:
            return None

        latest = max(packages, key=lambda x: x.created_at)
        return {
            'id': latest.package_id,
            'startup_id': latest.startup_id,
            'created_at': latest.created_at.isoformat(),
            'size_mb': latest.size_mb,
            'last_synced': latest.last_synced.isoformat() if latest.last_synced else None,
            'data_summary': {
                'has_financial': 'financial' in latest.data,
                'has_market': 'market' in latest.data,
                'has_team': 'team' in latest.data,
                'has_product': 'product' in latest.data
            }
        }

    def download_offline_data(self, startup_id: str) -> Dict:
        """Prepare data for offline download"""
        return {
            'startup_id': startup_id,
            'timestamp': datetime.utcnow().isoformat(),
            'data': {
                'financial': self._get_financial_data(),
                'market': self._get_market_data(),
                'team': self._get_team_data(),
                'product': self._get_product_data(),
                'resources': self._get_educational_resources()
            },
            'sync_instructions': {
                'sync_frequency': 'daily',
                'conflict_resolution': 'server_wins',
                'encryption': 'AES-256'
            }
        }

    def _get_financial_data(self) -> Dict:
        """Get financial data"""
        return {
            'projections': {
                'revenue_3yr': [100, 250, 500],
                'expenses_3yr': [80, 150, 250],
                'runway_months': 18
            }
        }

    def _get_market_data(self) -> Dict:
        """Get market data"""
        return {
            'market_size': '$2.5B',
            'growth_rate': '25%',
            'competitors': 8,
            'market_position': 'growing'
        }

    def _get_team_data(self) -> Dict:
        """Get team data"""
        return {
            'team_size': 5,
            'advisors': 3,
            'key_roles': ['CEO', 'CTO', 'CFO']
        }

    def _get_product_data(self) -> Dict:
        """Get product data"""
        return {
            'mvp_features': 12,
            'user_retention': 0.68,
            'nps_score': 52
        }

    def _get_educational_resources(self) -> Dict:
        """Get educational resources"""
        return {
            'modules': 5,
            'articles': 12,
            'glossary_terms': 20
        }

    # ========== SYNC FUNCTIONALITY ==========

    def add_to_sync_queue(self, startup_id: str, action: str, entity_type: str,
                         entity_id: str, data: Dict) -> SyncEvent:
        """Add change to sync queue"""
        sync_id = f"sync_{len(self.sync_queue)}"

        sync_event = SyncEvent(
            sync_id=sync_id,
            timestamp=datetime.utcnow(),
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            data=data
        )

        self.sync_queue.append(sync_event)
        return sync_event

    def sync_offline_changes(self, startup_id: str, changes: List[Dict]) -> Dict:
        """Sync offline changes to server"""
        synced_count = 0
        conflicts = []

        for change in changes:
            try:
                self.add_to_sync_queue(
                    startup_id,
                    change.get('action', 'update'),
                    change.get('entity_type', 'unknown'),
                    change.get('entity_id', 'unknown'),
                    change.get('data', {})
                )
                synced_count += 1
            except Exception as e:
                conflicts.append({
                    'entity_id': change.get('entity_id'),
                    'error': str(e)
                })

        if startup_id in self.offline_packages:
            for pkg in self.offline_packages.values():
                if pkg.startup_id == startup_id:
                    pkg.last_synced = datetime.utcnow()

        return {
            'synced_count': synced_count,
            'total_changes': len(changes),
            'conflicts': conflicts,
            'timestamp': datetime.utcnow().isoformat()
        }

    def get_sync_status(self) -> Dict:
        """Get sync queue status"""
        synced = [s for s in self.sync_queue if s.synced]
        pending = [s for s in self.sync_queue if not s.synced]

        return {
            'total_events': len(self.sync_queue),
            'synced_count': len(synced),
            'pending_count': len(pending),
            'pending_events': [{
                'id': s.sync_id,
                'action': s.action,
                'entity_type': s.entity_type,
                'timestamp': s.timestamp.isoformat()
            } for s in pending[:10]]
        }

    # ========== MOBILE DASHBOARD ==========

    def get_mobile_dashboard_summary(self, startup_id: str) -> Dict:
        """Get mobile dashboard summary"""
        return {
            'startup_id': startup_id,
            'timestamp': datetime.utcnow().isoformat(),
            'quick_stats': {
                'financial_health': 72,
                'market_position': 'strong',
                'team_size': 5,
                'product_retention': 0.68
            },
            'recent_notifications': len(self.get_notifications(startup_id, 5)),
            'pending_sync': len([s for s in self.sync_queue if not s.synced]),
            'offline_ready': self.get_offline_package(startup_id) is not None
        }


# Global service instance
mobile_offline_service = MobileOfflineService()
