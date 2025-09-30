from fastapi import FastAPI
from app.utils.supabase_client import supabase

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Mood Recommender API is running!"}

@app.get("/test-supabase")
def test_supabase():
    try:
        # Try to select from a table called 'test_table'
        response = supabase.table("test_table").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
