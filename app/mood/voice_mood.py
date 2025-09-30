import io
import soundfile as sf
from vosk import Model, KaldiRecognizer
import json
from app.mood.text_mood import detect_mood

MODEL_PATH = "vosk-model-small-en-us-0.15"  # Download from https://alphacephei.com/vosk/models and extract to your project root

def transcribe_audio(audio_bytes: bytes):
    with sf.SoundFile(io.BytesIO(audio_bytes)) as audio_file:
        audio_data = audio_file.read(dtype='int16')
        sample_rate = audio_file.samplerate
    model = Model(MODEL_PATH)
    rec = KaldiRecognizer(model, sample_rate)
    rec.AcceptWaveform(audio_data)
    result = json.loads(rec.FinalResult())
    return result.get("text", "")

def detect_voice_mood(audio_bytes: bytes):
    text = transcribe_audio(audio_bytes)
    mood_result = detect_mood(text)
    mood_result["transcribed_text"] = text
    return mood_result
