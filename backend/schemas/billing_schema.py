from pydantic import BaseModel

class CreateCheckoutRequest(BaseModel):
    price_id: str      
    points: int         
    amount_usd: float  