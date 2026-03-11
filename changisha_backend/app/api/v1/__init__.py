from fastapi import APIRouter

from app.api.v1 import auth, bills, contributions, payments, payment_methods

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(bills.router, prefix="/bills", tags=["bills"])
api_router.include_router(contributions.router, prefix="/contributions", tags=["contributions"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(payment_methods.router, prefix="/payment-methods", tags=["payment-methods"])