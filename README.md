<!--
  Profile README for github.com/vinzlercodes
  Focus: AI-native product/platform engineering, LLM systems, applied ML, and analytics products.
-->

<div align="center">

# Hi, I'm Vinayak Sengupta

### AI-Native Product & Platform Engineer | LLM Systems | Data Science

I build production AI systems that turn model capability into usable enterprise workflows: agent orchestration, fine-tuning, retrieval evaluation, explainability, analytics products, and the platform plumbing needed to keep all of it observable.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Vinayak%20Sengupta-blue?logo=linkedin)](https://www.linkedin.com/in/vinayak-sengupta)
[![Medium](https://img.shields.io/badge/Medium-@vinayak.sengupta-12100E?logo=medium)](https://medium.com/@vinayak.sengupta)
[![GitHub](https://img.shields.io/badge/GitHub-vinzlercodes-181717?logo=github)](https://github.com/vinzlercodes)
[![Email](https://img.shields.io/badge/Email-vinayak.sengupta%40gmail.com-red?logo=gmail)](mailto:vinayak.sengupta@gmail.com)
[![Resume](https://img.shields.io/badge/Resume-View-darkgreen)](https://drive.google.com/file/d/16ZBHCigkBxbTVZG2-Oo9yRuEE1MRx8PI/view?usp=sharing)

</div>

---

## What I Build

| Area | Current focus |
| --- | --- |
| Agent platforms | Multi-agent coordination, deterministic tool execution, human-in-the-loop confirmations, tool-call graphs, and enterprise workflow automation. |
| LLM operations | SFT, DPO, PPO, QLoRA, Axolotl, vLLM, checkpoint recovery, model serving, and failure diagnostics for production AI workflows. |
| Retrieval and evaluation | RAG/GraphRAG over long-form and graph-structured documents, ranking quality, BM25, MMR, reranking, and nDCG@k measurement. |
| Explainability and analytics | Model-agnostic attribution, PDP workflows, KPI design, DuckDB/Arrow pipelines, SHAP alignment, and stakeholder-facing analytics products. |
| Platform engineering | FastAPI services, Kubernetes reconciliation loops, productized launch flows, health checks, observability, and reusable enterprise assets. |

I care about systems that are measurable, debuggable, and useful to the people who have to run them after the demo is over.

## Recent Work

### Aible - Data Scientist, AI-Native Systems & Enterprise Workflows

- Architected an NVIDIA NeMo Agent Toolkit LLM runtime for dynamic reasoning chains, multi-agent coordination, deterministic tool execution, and enterprise workflow automation.
- Built a FastAPI execution layer that converts user/model intent into runnable agent configurations across tools, document workflows, prediction scoring, and human-in-the-loop approvals.
- Designed a pluggable enterprise tool registry with persisted execution metadata and tool-call graphs for observability, reproducibility, workflow reuse, and operational debugging.
- Productized an OpenClaw-based agent platform with sandbox launch flows, tenant configuration, health checks, gateway reachability checks, Slack access, streaming responses, and failure diagnostics.

### AI Operations, Fine-Tuning & Reliability

- Led a fault-tolerant fine-tune-and-serve platform for enterprise AI use cases, translating customer requirements into scalable experimentation and deployment workflows.
- Implemented SFT and DPO workflows using Axolotl and QLoRA; automated checkpoint detection and recovery, reducing manual setup and monitoring effort by **80%**.
- Enabled a Fortune 50 telecom client to launch a security metadata classifier on schedule through a productionized fine-tuning and serving workflow.

### Retrieval, Document Intelligence & Explainability

- Designed retrieval workflows for graph-structured and long-form enterprise documents while balancing ranking quality, token constraints, modular experimentation, and production evaluation.
- Improved retrieval nDCG@k by **25%** through iterative tuning of BM25, Maximal Marginal Relevance, and reranking components.
- Led a standardized model explainability/PDP analytics workflow that reduced per-feature computation time by **17x** while maintaining median curve fidelity around **0.90**.

## Current Product Builds

| Build | What it explores |
| --- | --- |
| Open Prior Auth Workbench | A FHIR-first healthcare AI workbench for discovering coverage requirements, prefilling documentation questionnaires, assembling submission-ready packets, and tracking case status through human review. |
| Multi-agent commerce systems | A Swiggy-style production multi-agent system spanning food, delivery, and dine-out domains. |
| LLM workflow tools | Obsidian/n8n LLM-wiki writing agents, MiroFish-style LLM councils for risk decisioning, GEN-1 robotics concepts, and Codex agentic OS experiments. |

## Technical Toolkit

**Agentic AI & LLM systems**
`multi-agent orchestration` · `tool registries` · `AgentOps` · `human-in-the-loop flows` · `RAG` · `GraphRAG` · `SFT` · `DPO` · `PPO` · `QLoRA` · `Axolotl` · `vLLM` · `LangChain` · `LlamaIndex` · `NVIDIA NeMo Toolkit` · `NeMo Guardrails` · `OpenAI` · `Vertex AI`

**Platforms, data & backend**
`Python` · `SQL` · `Cypher` · `FastAPI` · `Flask` · `PySpark` · `DuckDB` · `PostgreSQL` · `MongoDB` · `Neo4j` · `Chroma` · `AWS` · `GCP` · `Docker` · `Kubernetes` · `GitHub Actions` · `OpenTelemetry` · `Langfuse`

**ML, product & analytics**
`PyTorch` · `TensorFlow` · `Keras` · `scikit-learn` · `LightGBM` · `SHAP` · `ONNX` · `PDP` · `KPI design` · `stakeholder discovery` · `PRDs` · `MVP roadmaps` · `success metrics`

## Selected Public Projects

| Project | Signal |
| --- | --- |
| [Gaming-Industry-Analysis](https://github.com/vinzlercodes/Gaming-Industry-Analysis) | Data analysis of a 40-year gaming dataset, including genre/platform trends, sales patterns, publisher contributions, and a companion long-form article. |
| [Prediction-of-Customer-Churn](https://github.com/vinzlercodes/Prediction-of-Customer-Churn) | ANN-based churn prediction for banking customers with ROC, confusion matrix, pie chart, KDE, and counter-plot analysis. |
| [Disaster-Response-Pipeline-Web-App](https://github.com/vinzlercodes/Disaster-Response-Pipeline-Web-App) | End-to-end ETL, NLP, and ML pipeline powering a web app for classifying disaster-response messages. |
| [Recommendation-of-Refactoring-Techniques-to-address-Self-Admitted-Technical-Debt](https://github.com/vinzlercodes/Recommendation-of-Refactoring-Techniques-to-address-Self-Admitted-Technical-Debt) | SATD detection and refactoring recommendation work from my RIT capstone. |

## Writing & Research

<!-- BLOG-POST-LIST:START -->
- [The Essential Guide to Effectively Summarizing Massive Documents, Part 1](https://medium.com/data-science/demystifying-document-digestion-a-deep-dive-into-summarizing-massive-documents-part-1-53f2ed9a669d?source=rss-315151b8e67d------2)
- [Advancing the Power of Retrievers in RAG Frameworks](https://medium.com/data-science-collective/exploring-the-core-of-augmented-intelligence-advancing-the-power-of-retrievers-in-rag-frameworks-3ef9fe273764?source=rss-315151b8e67d------2)
- [Customer Segmentation, Identifying the Profit Among the Loose Ends.](https://medium.com/swlh/customer-segmentation-identifying-the-profit-among-the-loose-ends-6fe4d6279873?source=rss-315151b8e67d------2)
- [The Last 40 Years of Gaming Industry, Unlocked.](https://medium.com/swlh/the-last-40-years-of-gaming-industry-unlocked-baf4699ad8ba?source=rss-315151b8e67d------2)
<!-- BLOG-POST-LIST:END -->

<sub>Auto-updated from my Medium RSS feed.</sub>

Other work: PPO post-training for Llama text-to-SQL, SATD detection and refactoring recommendation, and histopathology carcinoma classification using multi-level spatial fusion.

## Talks & Community

- Authored the core problem statement and evaluation metrics for the **UC Berkeley AI Summit 2023 - Data Science Hackathon**.
- Represented Aible at **Ai4 2023**, **Google Next 2024**, and **AWS Summit 2024**, translating technical systems into demos and customer conversations.
- Write long-form pieces on document summarization, retrieval systems, RAG evaluation, customer segmentation, applied AI, and gaming industry analysis.

## GitHub Activity & Analytics

<p align="center">
  <img
    src="./github-metrics.png"
    alt="Generated GitHub metrics for vinzlercodes, including contribution activity, repository counts, community stats, and most-used languages"
    width="520"
  />
</p>

| Signal | What to look for |
| --- | --- |
| Languages | A practical mix of data, backend, notebooks, and web-facing work rather than a single narrow stack. |
| Repositories | Public projects skew older but show the arc from analytics and ML pipelines toward AI-native systems. |
| Writing | Medium activity makes the technical reasoning visible, especially around retrieval, summarization, and applied analytics. |
| Activity feed | Recent public GitHub events are generated below so profile movement is visible between larger project updates. |

### Recent GitHub Activity

<!--START_SECTION:activity-->
1. 🎉 Merged PR [#36](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/36) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
2. 💪 Opened PR [#36](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/36) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
3. 🎉 Merged PR [#33](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/33) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
4. 🎉 Merged PR [#32](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/32) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
5. 🎉 Merged PR [#34](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/34) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
6. 🎉 Merged PR [#35](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/35) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
7. 💪 Opened PR [#35](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/35) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
8. 💪 Opened PR [#34](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/34) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
9. 💪 Opened PR [#33](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/33) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
10. 💪 Opened PR [#32](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench/pull/32) in [vinzlercodes/Open_Prior_Auth_Workbench](https://github.com/vinzlercodes/Open_Prior_Auth_Workbench)
<!--END_SECTION:activity-->

---

<sub>Fun fact: I will absolutely over-analyze both fragrance notes and video-game industry trends.</sub>
