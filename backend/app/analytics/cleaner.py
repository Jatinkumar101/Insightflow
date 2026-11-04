import pandas as pd


def analyze_cleaning(df: pd.DataFrame):

    missing_values = df.isnull().sum()

    missing_summary = {
        column: int(count)
        for column, count in missing_values.items()
        if count > 0
    }

    duplicate_rows = int(df.duplicated().sum())

    return {
        "missing_values": missing_summary,
        "total_missing_values": int(missing_values.sum()),
        "duplicate_rows": duplicate_rows
    }


def clean_dataset(df: pd.DataFrame):

    cleaned_df = df.copy()

    original_rows = len(cleaned_df)

    # Remove duplicate rows
    cleaned_df = cleaned_df.drop_duplicates()

    duplicates_removed = original_rows - len(cleaned_df)

    # Fill missing values
    numeric_columns = cleaned_df.select_dtypes(
        include="number"
    ).columns

    categorical_columns = cleaned_df.select_dtypes(
        include=["object", "category"]
    ).columns

    numeric_filled = 0
    categorical_filled = 0

    for column in numeric_columns:
        missing_count = cleaned_df[column].isnull().sum()

        if missing_count > 0:
            cleaned_df[column] = cleaned_df[column].fillna(
                cleaned_df[column].median()
            )
            numeric_filled += int(missing_count)

    for column in categorical_columns:
        missing_count = cleaned_df[column].isnull().sum()

        if missing_count > 0:
            mode_value = cleaned_df[column].mode()

            if not mode_value.empty:
                cleaned_df[column] = cleaned_df[column].fillna(
                    mode_value[0]
                )
                categorical_filled += int(missing_count)

    return cleaned_df, {
        "original_rows": original_rows,
        "final_rows": len(cleaned_df),
        "duplicates_removed": duplicates_removed,
        "numeric_missing_filled": numeric_filled,
        "categorical_missing_filled": categorical_filled
    }