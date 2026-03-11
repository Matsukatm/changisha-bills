from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import redis

# Initialize Redis for rate limiting
redis_client = redis.Redis.from_url("redis://localhost:6379", decode_responses=True)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Rate limit exception handler
rate_limit_exception_handler = _rate_limit_exceeded_handler
