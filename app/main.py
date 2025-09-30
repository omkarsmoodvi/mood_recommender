from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.utils.supabase_client import supabase
from app.mood.text_mood import detect_mood

app = FastAPI()

class MoodEntry(BaseModel):
    name: str
    mood: str

class TextInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Mood Recommender API is running!"}

@app.get("/test-supabase")
def test_supabase():
    try:
        response = supabase.table("test_table").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/add-mood")
def add_mood(entry: MoodEntry):
    try:
        response = supabase.table("test_table").insert({
            "name": entry.name,
            "mood": entry.mood
        }).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-text-mood")
def detect_text_mood(input: TextInput):
    try:
        mood_result = detect_mood(input.text)
        # Example: map mood to content type
        mood_to_content = {
            "happy": "upbeat music, fun videos",
            "sad": "calming podcasts, soft visuals",
            "neutral": "trending content, news"
        }
        content = mood_to_content.get(mood_result["mood"], "trending content")
        return {"mood": mood_result["mood"], "score": mood_result["score"], "recommended_content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
