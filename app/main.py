from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.utils.supabase_client import supabase
from app.mood.text_mood import detect_mood
from app.mood.face_mood import detect_face_mood

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
        return mood_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-face-mood")
async def detect_face_mood_api(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = detect_face_mood(image_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
