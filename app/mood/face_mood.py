from deepface import DeepFace
import cv2
import numpy as np

def detect_face_mood_and_age(image_bytes: bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    result = DeepFace.analyze(img, actions=['emotion', 'age'], enforce_detection=False)
    first = result[0] if isinstance(result, list) else result
    return {
        "mood": first['dominant_emotion'],
        "emotions": first['emotion'],
        "age": int(first['age'])
    }
