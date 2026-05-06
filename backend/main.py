from fastapi import FastAPI
from routes import auth_routes , billing_routes , teacher_routes , student_routes , assessment_routes
from dotenv import load_dotenv
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
import os




frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app = FastAPI()


# This adds the Authorize button in Swagger
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Your App API",
        version="1.0.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


app.include_router(billing_routes.router)        # ← add this
app.include_router(auth_routes.router)
app.include_router(teacher_routes.router)
app.include_router(student_routes.router)
app.include_router(assessment_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   


@app.get("/")
def root():
    return {"message": "API is running"}