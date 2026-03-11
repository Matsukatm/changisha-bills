import redis
import json
from typing import Optional, Any, List
from datetime import timedelta
from app.core.config import settings

class CacheService:
    def __init__(self):
        self.redis_client = redis.Redis.from_url(
            settings.REDIS_URL, 
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True
        )
    
    def get(self, key: str) -> Optional[Any]:
        try:
            data = self.redis_client.get(key)
            return json.loads(data) if data else None
        except Exception:
            return None
    
    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        try:
            return self.redis_client.setex(key, expire, json.dumps(value, default=str))
        except Exception:
            return False
    
    def delete(self, key: str) -> bool:
        try:
            return bool(self.redis_client.delete(key))
        except Exception:
            return False
    
    def delete_pattern(self, pattern: str) -> bool:
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return bool(self.redis_client.delete(*keys))
            return True
        except Exception:
            return False
    
    # Cache keys for different entities
    @staticmethod
    def bill_progress_key(bill_id: int) -> str:
        return f"bill:progress:{bill_id}"
    
    @staticmethod
    def user_bills_key(user_id: int) -> str:
        return f"user:bills:{user_id}"
    
    @staticmethod
    def user_notifications_key(user_id: int) -> str:
        return f"user:notifications:{user_id}"
    
    @staticmethod
    def contribution_summary_key(bill_id: int) -> str:
        return f"bill:contributions:{bill_id}"

cache_service = CacheService()
