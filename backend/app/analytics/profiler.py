import pandas as pd


def profile_dataset(df: pd.DataFrame):

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    missing_values = df.isnull().sum()

    statistical_summary = {}

    for column in numeric_columns:
        statistical_summary[column] = {
            "mean": float(df[column].mean()),
            "median": float(df[column].median()),
            "minimum": float(df[column].min()),
            "maximum": float(df[column].max()),
            "standard_deviation": float(df[column].std())
        }
    outlier_summary = {}

    for column in numeric_columns:

        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)

        IQR = Q3 - Q1

        lower_bound = Q1 - (1.5 * IQR)
        upper_bound = Q3 + (1.5 * IQR)

        outliers = df[
            (df[column] < lower_bound) |
            (df[column] > upper_bound)
        ]

        outlier_summary[column] = {
            "outlier_count": int(len(outliers)),
            "lower_bound": float(lower_bound),
            "upper_bound": float(upper_bound)
        }
    correlation_matrix = {}

    if len(numeric_columns) >= 2:
        correlation_matrix = (
            df[numeric_columns]
            .corr()
            .round(3)
            .to_dict()
        )
    categorical_summary = {}

    for column in categorical_columns:
        value_counts = df[column].value_counts(dropna=False)

        categorical_summary[column] = {
            str(value): int(count)
            for value, count in value_counts.items()
        }
    return {
        "total_rows": len(df),
        "total_columns": len(df.columns),

        "columns": df.columns.tolist(),

        "data_types": {
            column: str(df[column].dtype)
            for column in df.columns
        },

        "missing_values": {
            column: int(count)
            for column, count in missing_values.items()
            if count > 0
        },

        "duplicate_rows": int(df.duplicated().sum()),

        "numeric_columns": numeric_columns,

        "outlier_summary": outlier_summary,

        "correlation_matrix": correlation_matrix,

        "categorical_columns": categorical_columns,

        "statistical_summary": statistical_summary
    }