from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.mood.text_mood import detect_mood
from app.mood.face_mood import detect_face_mood_and_age
from app.mood.voice_mood import detect_voice_mood_and_age
from app.recommend import recommend_content
from app.db import save_result
from datetime import datetime

app = FastAPI()

class TextInput(BaseModel):
    text: str
    goal: str = None

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
        record = {
            "analysis_type": "text",
            "mood": mood_result["mood"],
            "score": mood_result.get("score"),
            "recommended_content": mood_result.get("recommended_content"),
            "goal": input.goal,
            "timestamp": str(datetime.utcnow())
        }
        save_result(record)
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
        record = {
            "analysis_type": "face",
            "mood": result["mood"],
            "emotions": str(result["emotions"]),
            "age": result["age"],
            "goal": goal,
            "recommended_channels": str(rec.get("youtube_channels", [])),
            "recommended_content": str(rec.get("content", [])),
            "timestamp": str(datetime.utcnow())
        }
        save_result(record)
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
        record = {
            "analysis_type": "voice",
            "mood": result["mood"],
            "score": result.get("score"),
            "transcribed_text": result.get("transcribed_text"),
            "goal": goal,
            "recommended_channels": str(rec.get("youtube_channels", [])),
            "recommended_content": str(rec.get("content", [])),
            "timestamp": str(datetime.utcnow())
        }
        save_result(record)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
