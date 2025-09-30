def get_age_group(age):
    if age is None:
        return "unknown"
    if age <= 3:     return "baby"
    if age <= 12:    return "child"
    if age <= 19:    return "teen"
    if age <= 59:    return "adult"
    return "senior"

def recommend_content(mood, age, goal=None):
    age_group = get_age_group(age)
    # Example best YouTube channels by topic and age
    channel_map = {
        "learn python": {
            "child": ["CodeChum Kids"],
            "teen": ["CodeWithHarry", "Tech With Tim"],
            "adult": ["Corey Schafer", "freeCodeCamp"]
        },
        "math": {
            "child": ["Mathantics"],
            "teen": ["MindYourDecisions", "Think School"],
            "adult": ["3Blue1Brown", "Mathologer"]
        },
        "cooking": {
            "child": ["Kids Cooking Club"],
            "teen": ["Hebbars Kitchen", "Kabita's Kitchen"],
            "adult": ["Binging With Babish", "Food Wishes"]
        },
        "study": {
            "teen": ["Mariana's Study Corner"],
            "adult": ["Ali Abdaal"]
        },
        "relaxation": {
            "baby": ["Relaxing Music for Babies"],
            "child": ["Cosmic Kids Yoga"],
            "teen": ["Lo-Fi Girl"],
            "adult": ["Chillhop Music", "Calm"]
        }
    }
    # Default recommendations if no goal given
    mood_recs = {
        "joy":  ["Upbeat music", "Comedy", "Trending fun videos"],
        "sadness": ["Motivational talks", "Inspirational podcasts", "Soft visuals"],
        "anger": ["Relaxing music", "Stress relief content"],
        "fear": ["Reassuring podcasts", "Positive stories"],
        "surprise": ["Exciting news", "New trending videos"],
        "love": ["Romantic movies", "Feel-good playlists"],
        "neutral": ["Documentaries", "Educational channels", "News"]
    }
    # Build recommendations
    rec = {
        "age_group": age_group,
        "youtube_channels": [],
        "content": []
    }
    if goal and goal.lower() in channel_map:
        channels = channel_map[goal.lower()].get(age_group, channel_map[goal.lower()].get("adult", []))
        rec["youtube_channels"] = channels
        rec["content"] = mood_recs.get(mood, [])
    else:
        rec["content"] = mood_recs.get(mood, [])
    return rec
