from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Mood Recommender API is running!"}
