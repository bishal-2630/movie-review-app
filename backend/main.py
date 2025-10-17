from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Movie Review API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.api.endpoints import auth, reviews

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])

@app.get("/")
def read_root():
    return {"message": "Movie Review API is running!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "Movie Review API is running smoothly"}

if __name__ == "__main__":
    # Initialize database tables
    from app.utils.db_init import init_db
    init_db()
    
    import uvicorn
    print("Starting Movie Review API server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)