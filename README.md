# AI Model Comparison Report

## Overview

This report compares three different AI models for semantic similarity detection:

1. **SentenceTransformer (BERT-based)**
2. **OpenAI Embedding Model (text-embedding-3-small)**
3. **Google Gemini Embedding**

We analyze how accurately and consistently these models detect semantic similarity (or potential plagiarism) across a set of five input texts.

## Input Texts

Here are the five texts used in the evaluation:

1. *Artificial intelligence is transforming industries by automating tasks, enhancing decision-making, and enabling new technologies like self-driving cars and virtual assistants.*
2. *AI is revolutionizing industries through automation, smarter decision-making, and innovations such as autonomous vehicles and digital assistants.*
3. *Bananas are a rich source of potassium and provide a quick source of energy. They are commonly consumed as a snack or added to smoothies and cereals.*
4. *Artificial intelligence is changing industries by automating work, helping in decision-making, and powering technologies like self-driving cars and AI assistants.*
5. *let's have fun*

## SentenceTransformer Results

* Detected Clones (Similarity ≥ 80%):

  * Text 1 & 2 → 84.18%
  * Text 1 & 4 → 90.35%
  * Text 2 & 4 → 82.05%
* Limitations: Occasionally produces negative similarity scores, which can be confusing or misleading.

## OpenAI Embedding Results

* Detected Clones:

  * Text 1 & 2 → 93.44%
  * Text 1 & 4 → 98.12%
  * Text 2 & 4 → 93.07%
* Performance: Strong and reliable semantic clustering with no negative values.
* Model Used: `text-embedding-3-small`

## Gemini Embedding Results

* Detected Clones:

  * Text 1 & 2 → 98.11%
  * Text 1 & 4 → 98.62%
  * Text 2 & 4 → 97.53%
* Performance: Very high agreement on semantic similarity, comparable to OpenAI.

## Observations & Comparison

| Pair       | ST (%) | OpenAI (%) | Gemini (%) |
| ---------- | ------ | ---------- | ---------- |
| Text 1 & 2 | 84.18  | 93.44      | 98.11      |
| Text 1 & 4 | 90.35  | 98.12      | 98.62      |
| Text 2 & 4 | 82.05  | 93.07      | 97.53      |
| Text 1 & 3 | -4.91  | 70.84      | 73.65      |
| Text 3 & 4 | -4.24  | 70.55      | 73         |

* **Most Accurate**: Gemini performed slightly better than OpenAI in both range and clarity.
* **Least Reliable**: SentenceTransformer sometimes yields negative similarity scores, which aren't interpretable.

## Conclusion

If you're building a production-grade system for detecting semantic similarity or plagiarism:

* Prefer **Gemini** or **OpenAI** models for reliability and accuracy.
* SentenceTransformer is free and fast, but best suited for approximate or non-critical use cases.

---

# Documentation (How It All Works)

## 1. What is this system doing?

The system checks how similar multiple pieces of text are. This is useful to detect if content was copied, rephrased, or plagiarized.

## 2. How does it work?

* You input 5 pieces of text.
* The system sends the text through 3 different AI models.
* Each model gives us a similarity score between each pair of texts (from 0 to 100).
* We build a matrix of these scores and highlight pairs above 80% as potential clones.

## 3. What are the models?

* **SentenceTransformer**: A local model based on BERT. It gives decent results but sometimes strange scores.
* **OpenAI Embedding**: A powerful model by OpenAI, accessed using your API key. Very accurate.
* **Gemini Embedding**: Google’s embedding service. Also very accurate and reliable.

## 4. Why use multiple models?

* To compare their strengths and weaknesses.
* To find the most accurate model for your needs.

## 5. Final Verdict

Use OpenAI or Gemini for high-quality results. SentenceTransformer is fast and cost-effective, but less precise.

---

Created as part of a plagiarism detection system using FastAPI backend + frontend for visualization.
