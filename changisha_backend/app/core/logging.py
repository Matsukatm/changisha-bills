import structlog
import logging
import sys
from pythonjsonlogger import jsonlogger
from app.core.config import settings

def configure_logging():
    """Configure structured logging with JSON output"""
    
    # Configure standard logging
    logHandler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        fmt='%(asctime)s %(name)s %(levelname)s %(message)s'
    )
    logHandler.setFormatter(formatter)
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        handlers=[logHandler]
    )
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

# Initialize logging
configure_logging()

# Create a logger instance
logger = structlog.get_logger()

def log_user_action(user_id: int, action: str, details: dict = None):
    """Log user actions for audit trail"""
    logger.info(
        "user_action",
        user_id=user_id,
        action=action,
        details=details or {}
    )

def log_api_request(method: str, endpoint: str, user_id: int = None, status_code: int = None):
    """Log API requests"""
    logger.info(
        "api_request",
        method=method,
        endpoint=endpoint,
        user_id=user_id,
        status_code=status_code
    )

def log_security_event(event_type: str, user_id: int = None, ip_address: str = None, details: dict = None):
    """Log security-related events"""
    logger.warning(
        "security_event",
        event_type=event_type,
        user_id=user_id,
        ip_address=ip_address,
        details=details or {}
    )

def log_payment_event(event_type: str, payment_id: int = None, bill_id: int = None, 
                     user_id: int = None, amount: float = None, status: str = None):
    """Log payment-related events"""
    logger.info(
        "payment_event",
        event_type=event_type,
        payment_id=payment_id,
        bill_id=bill_id,
        user_id=user_id,
        amount=amount,
        status=status
    )

def log_bill_event(event_type: str, bill_id: int = None, user_id: int = None, details: dict = None):
    """Log bill-related events"""
    logger.info(
        "bill_event",
        event_type=event_type,
        bill_id=bill_id,
        user_id=user_id,
        details=details or {}
    )

def log_contribution_event(event_type: str, contribution_id: int = None, bill_id: int = None,
                         user_id: int = None, amount: float = None):
    """Log contribution-related events"""
    logger.info(
        "contribution_event",
        event_type=event_type,
        contribution_id=contribution_id,
        bill_id=bill_id,
        user_id=user_id,
        amount=amount
    )

def log_system_event(event_type: str, details: dict = None, level: str = "info"):
    """Log system-level events"""
    log_func = getattr(logger, level, logger.info)
    log_func(
        "system_event",
        event_type=event_type,
        details=details or {}
    )
