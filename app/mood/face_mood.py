from fer import FER
import matplotlib.pyplot as plt
import cv2
import numpy as np

def detect_face_mood(image_bytes: bytes):
    try:
        # Convert image bytes to numpy array for OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        detector = FER()
        emotions = detector.detect_emotions(img)
        if not emotions:
            return {"mood": "no_face", "score": 0.0, "emotions": []}
        # Get the emotion with the highest score
        top_emotion = max(emotions[0]["emotions"], key=emotions[0]["emotions"].get)
        score = emotions[0]["emotions"][top_emotion]
        return {"mood": top_emotion, "score": score, "emotions": emotions[0]["emotions"]}
    except Exception as e:
        return {"error": str(e)}
