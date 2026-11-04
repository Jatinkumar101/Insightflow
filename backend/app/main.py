from fastapi import FastAPI
from app.api.upload import router as upload_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="InsightFlow",
    description="Automated Data Analysis & Insights Generation Platform",
    version="1.0.0"
)

# Allow the Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(upload_router)


@app.get("/")
def home():
    return {
        "message": "InsightFlow Backend is running!"
    }