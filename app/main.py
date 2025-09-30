from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.mood.text_mood import detect_mood
from app.mood.face_mood import detect_face_mood
from app.mood.voice_mood import detect_voice_mood

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Mood Recommender API is running!"}

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

@app.post("/detect-voice-mood")
async def detect_voice_mood_api(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        result = detect_voice_mood(audio_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
