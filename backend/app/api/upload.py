from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO
from app.analytics.profiler import profile_dataset
#from app.analytics.cleaner import analyze_cleaning
from app.analytics.cleaner import analyze_cleaning, clean_dataset
from app.analytics.eda import generate_eda

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    file_extension = file.filename.lower().split(".")[-1]

    if file_extension not in ["csv", "xlsx"]:
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel (.xlsx) files are supported."
        )

    contents = await file.read()

    try:
        if file_extension == "csv":
            df = pd.read_csv(BytesIO(contents))

        else:
            df = pd.read_excel(BytesIO(contents))

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded file."
        )

    profile = profile_dataset(df)
    cleaning_analysis = analyze_cleaning(df)
    cleaned_df, cleaning_summary = clean_dataset(df)
    cleaned_df, cleaning_summary = clean_dataset(df)
    eda = generate_eda(cleaned_df)

    return {
    "filename": file.filename,
    "profile": profile,
    "cleaning_analysis": cleaning_analysis,
    "cleaning_summary": cleaning_summary,
    "eda": eda
}