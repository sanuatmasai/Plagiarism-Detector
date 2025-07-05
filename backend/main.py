from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
import google.generativeai as genai  # Gemini Flash
import os

# ============ API Keys ============
# OpenAI
openai_api_key = "your_openAi_key"  # Truncated for safety
client = OpenAI(api_key=openai_api_key)

# Gemini (Google)
genai.configure(api_key="your_gemini_key")

# ============ FastAPI App ============
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Models ============
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

# ============ Pydantic ============
class TextData(BaseModel):
    texts: list[str]
    model: str  # "openai", "sentence", or "gemini"

# ============ Utils ============
def preprocess(text):
    return text.strip().lower()

def get_sentence_embeddings(texts):
    return sentence_model.encode(texts)

def get_openai_embeddings(texts):
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-ada-002"
    )
    return [record.embedding for record in response.data]

def get_gemini_embeddings(texts):
    embeddings = []
    for text in texts:
        response = genai.embed_content(
            model="models/embedding-001",  # Correct path
            content=text,
            task_type="RETRIEVAL_DOCUMENT"
        )
        embeddings.append(response['embedding'])
    return embeddings


def detect_clones(sim_matrix, threshold=0.8):
    clones = []
    for i in range(len(sim_matrix)):
        for j in range(i + 1, len(sim_matrix)):
            if sim_matrix[i][j] > threshold:
                clones.append((i, j, round(float(sim_matrix[i][j]) * 100, 2)))
    return clones

# ============ API ============
@app.post("/analyze")
def analyze(data: TextData):
    texts = [preprocess(t) for t in data.texts if t.strip() != ""]

    # Model selection
    if data.model == "openai":
        embeddings = get_openai_embeddings(texts)
    elif data.model == "gemini":
        embeddings = get_gemini_embeddings(texts)
    else:
        embeddings = get_sentence_embeddings(texts)

    sim_matrix = cosine_similarity(embeddings)
    clones = detect_clones(sim_matrix)

    return {
        "similarity_matrix": [[round(float(score) * 100, 2) for score in row] for row in sim_matrix],
        "clones": clones
    }
