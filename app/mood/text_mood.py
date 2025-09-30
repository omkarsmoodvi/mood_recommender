from transformers import pipeline

# Load sentiment analysis pipeline (using DistilBERT for speed)
sentiment_analyzer = pipeline("sentiment-analysis")

# You can also use emotion classification if you want (with a different model)
def detect_mood(text: str):
    result = sentiment_analyzer(text)[0]
    # Map sentiment to mood
    label = result["label"].lower()
    if label == "positive":
        mood = "happy"
    elif label == "negative":
        mood = "sad"
    else:
        mood = "neutral"
    return {"mood": mood, "score": result["score"]}
