
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, reviews
from app.utils.database import engine, Base

app = FastAPI(title="Movie Review API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])

@app.get("/")
def read_root():
    return {"message": "Movie Review API is running!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "Movie Review API is running smoothly"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)