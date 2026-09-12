# SEBI Investor Behaviour Dashboard

Analysis of the **SEBI Investor Survey 2025** (a study of investor behaviour conducted by SEBI — not an INDmoney app-usage or conversion dataset), with a Next.js dashboard for publishing selected, reviewed results.

Official data source: see [`docs/data_sources.md`](docs/data_sources.md).

## Workflow

```
data/raw/  →  analysis/ (Python/Jupyter)  →  data/processed/  →  scripts/ (export)  →  public/data/  →  Next.js dashboard
```

1. Original SEBI files are placed, unmodified, in `data/raw/`.
2. Notebooks in `analysis/` inspect, clean, and explore the data, producing respondent-level working data in `data/processed/`.
3. Scripts in `scripts/` turn processed data into reviewed, aggregate exports written to `public/data/`.
4. The Next.js app in `src/app/` reads only from `public/data/` to render the dashboard.

Raw and processed data are **not** committed to Git. Only reviewed aggregates in `public/data/` are intended to become public, since Next.js serves that folder directly.

## Repository layout

- `analysis/` — Jupyter notebooks for inspection, exploration, and explanations.
- `scripts/` — reusable data preparation and export scripts (added as the analysis matures).
- `data/raw/` — original, unmodified SEBI data files (gitignored).
- `data/processed/` — generated respondent-level working data (gitignored).
- `public/data/` — reviewed aggregate results for the dashboard (tracked in Git).
- `docs/` — supporting documentation, including data sources.
- `src/app/` — Next.js (App Router) dashboard.

## Next.js dashboard

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful commands:

```bash
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check
npm run build    # production build
```

## Python analysis environment

Uses a project-local virtual environment (`.venv`), kept separate from the Next.js/Node dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m ipykernel install --user --name sebi-investor-survey --display-name "Python (.venv)"
```

Then launch JupyterLab:

```bash
jupyter lab
```

Open `analysis/01_data_inspection.ipynb` and select the **Python (.venv)** kernel (the notebook already references this kernel name). Run the environment-check cell to confirm `pandas`, `openpyxl`, and `matplotlib` import correctly.

## Adding the SEBI data

Download the source workbook(s) from the official SEBI page linked in [`docs/data_sources.md`](docs/data_sources.md) and place them, unmodified, in `data/raw/`. Do not assume filenames, sheet names, or column definitions ahead of inspecting the actual file — that inspection is the purpose of `analysis/01_data_inspection.ipynb`.
