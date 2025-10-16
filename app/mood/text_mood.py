import nltk
from transformers import pipeline
from nltk.corpus import wordnet as wn

try:
    wn.synsets('happy')
except LookupError:
    nltk.download('wordnet')

emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

EMOTION_TO_CONTENT = {
    "joy": "upbeat music, fun videos, comedy",
    "sadness": "calming podcasts, soft visuals, motivational talks",
    "anger": "relaxing music, stress relief content",
    "fear": "reassuring podcasts, positive stories",
    "surprise": "exciting news, trending videos",
    "love": "romantic movies, feel-good playlists",
    "neutral": "trending content, documentaries, news",
}

def get_emotion_from_dictionary(text):
    tokens = text.lower().split()
    emotion_keys = list(EMOTION_TO_CONTENT.keys())
    for token in tokens:
        for emotion in emotion_keys:
            if emotion in token:
                return emotion
            for syn in wn.synsets(token):
                for lemma in syn.lemma_names():
                    if lemma.lower() == emotion:
                        return emotion
    return None

def detect_mood(text: str):
    dictionary_emotion = get_emotion_from_dictionary(text)
    if dictionary_emotion:
        mood = dictionary_emotion
        content = EMOTION_TO_CONTENT[mood]
        return {"mood": mood, "score": 1.0, "recommended_content": content, "method": "dictionary"}
    result = emotion_analyzer(text)[0]
    label = result["label"].lower()
    mood = label if label in EMOTION_TO_CONTENT else "neutral"
    content = EMOTION_TO_CONTENT.get(mood, "trending content")
    score = result["score"]
    return {"mood": mood, "score": score, "recommended_content": content, "method": "ml"}
