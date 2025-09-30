from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.mood.text_mood import detect_mood
from app.mood.face_mood import detect_face_mood_and_age
from app.mood.voice_mood import detect_voice_mood_and_age
from app.recommend import recommend_content

app = FastAPI()

class TextInput(BaseModel):
    text: str
    goal: str = None

class GoalInput(BaseModel):
    goal: str

@app.get("/")
def read_root():
    return {"message": "Mood Recommender API is running!"}

@app.post("/detect-text-mood")
def detect_text_mood(input: TextInput):
    try:
        mood_result = detect_mood(input.text)
        mood_result["goal"] = input.goal
        rec = recommend_content(mood_result["mood"], age=None, goal=input.goal)
        mood_result["recommendation"] = rec
        return mood_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-face-mood")
async def detect_face_mood_api(file: UploadFile = File(...), goal: str = None):
    try:
        image_bytes = await file.read()
        result = detect_face_mood_and_age(image_bytes)
        rec = recommend_content(result["mood"], result["age"], goal)
        result["goal"] = goal
        result["recommendation"] = rec
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-voice-mood")
async def detect_voice_mood_api(file: UploadFile = File(...), goal: str = None):
    try:
        audio_bytes = await file.read()
        result = detect_voice_mood_and_age(audio_bytes)
        rec = recommend_content(result["mood"], result.get("age"), goal)
        result["goal"] = goal
        result["recommendation"] = rec
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
