import pandas as pd


def generate_eda(df: pd.DataFrame):

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    numerical_analysis = {}

    for column in numeric_columns:
        numerical_analysis[column] = {
            "mean": float(df[column].mean()),
            "median": float(df[column].median()),
            "min": float(df[column].min()),
            "max": float(df[column].max())
        }

    categorical_analysis = {}

    for column in categorical_columns:
        counts = df[column].value_counts().head(10)

        categorical_analysis[column] = {
            str(value): int(count)
            for value, count in counts.items()
        }

    correlation = {}

    if len(numeric_columns) >= 2:
        correlation = (
            df[numeric_columns]
            .corr()
            .round(3)
            .to_dict()
        )

    return {
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,
        "numerical_analysis": numerical_analysis,
        "categorical_analysis": categorical_analysis,
        "correlation": correlation
    }