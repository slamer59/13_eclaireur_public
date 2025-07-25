from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
import pytest

from back.scripts.utils.dataframe_operation import (
    IdentifierFormat,
    clean_file_format,
    expand_json_columns,
    is_dayfirst,
    normalize_commune_code,
    normalize_date,
    normalize_identifiant,
    normalize_montant,
    safe_rename,
)


@pytest.mark.parametrize(
    "schema_dict, expected_columns",
    [
        ({}, ["a", "b"]),
        ({"a": "x"}, ["x", "b"]),
        ({"a": "x", "b": "y"}, ["x", "y"]),
        (
            {"c": "z"},
            ["a", "b"],
        ),  # if a column does not exist in the DataFrame, it is not raised as an error, but rather ignored
        ({"a": "x", "c": "z"}, ["x", "b"]),
    ],
)
def test_safe_rename(schema_dict, expected_columns):
    inp = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
    out = safe_rename(inp, schema_dict)
    assert out.columns.tolist() == expected_columns


def test_safe_rename_remove_accents():
    inp = pd.DataFrame({"idBénéficiaire": [1, 2, 3]})
    out = safe_rename(inp, {})
    assert out.columns.tolist() == ["idBeneficiaire"]


class TestNormalizeBeneficiaireIdentifiant:
    def test_no_id(self):
        df = pd.DataFrame({"foo": [1]})
        pd.testing.assert_frame_equal(df, normalize_identifiant(df, "idBeneficiaire"))

    def test_siren(self):
        df = pd.DataFrame({"idBeneficiaire": ["123456789", "123456789", "12345678"]})
        expected_df = pd.DataFrame(
            {"idBeneficiaire": ["12345678900000", "12345678900000", "01234567800000"]}
        )
        pd.testing.assert_frame_equal(expected_df, normalize_identifiant(df, "idBeneficiaire"))

    def test_siren_format(self):
        df = pd.DataFrame({"idBeneficiaire": ["123456789", "123456789", "12345678"]})
        expected_df = pd.DataFrame({"idBeneficiaire": ["123456789", "123456789", "012345678"]})
        result = normalize_identifiant(df, "idBeneficiaire", format=IdentifierFormat.SIREN)
        pd.testing.assert_frame_equal(expected_df, result)

    def test_siret(self):
        df = pd.DataFrame(
            {"idBeneficiaire": ["01234567890001", "01234567890001", "1234567890001"]}
        )
        expected_df = pd.DataFrame({"idBeneficiaire": ["01234567890001"] * 3})
        pd.testing.assert_frame_equal(expected_df, normalize_identifiant(df, "idBeneficiaire"))

    def test_no_siren_no_siret(self):
        df = pd.DataFrame({"idBeneficiaire": ["123456"]})
        with pytest.raises(RuntimeError, match="is neither siren not siret"):
            normalize_identifiant(df, "idBeneficiaire")

    def test_clean_dot0(self):
        df = pd.DataFrame(
            {"idBeneficiaire": ["01234567890001.0", "01234567890001.0", "1234567890001"]}
        )
        expected_df = pd.DataFrame({"idBeneficiaire": ["01234567890001"] * 3})
        pd.testing.assert_frame_equal(expected_df, normalize_identifiant(df, "idBeneficiaire"))

    def test_invalid_format(self):
        df = pd.DataFrame({"idBeneficiaire": ["123456789", "123456788"]})
        with pytest.raises(RuntimeError, match="Format must be an IdentifierFormat enum value"):
            normalize_identifiant(df, "idBeneficiaire", format="invalid")


class TestExpandJsonColumns:
    def test_expand_valid_json(self):
        """Test expand_json_columns with valid JSON data"""
        df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": [
                    '{"field1": "value1", "field2": 123}',
                    '{"field1": "value2", "field2": 456}',
                    '{"field1": "value3", "field2": 789}',
                ],
            }
        )

        result = expand_json_columns(df, "extra")
        expected_df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": [
                    '{"field1": "value1", "field2": 123}',
                    '{"field1": "value2", "field2": 456}',
                    '{"field1": "value3", "field2": 789}',
                ],
                "extra_field1": ["value1", "value2", "value3"],
                "extra_field2": [123, 456, 789],
            }
        )
        pd.testing.assert_frame_equal(result, expected_df)

    def test_expand_invalid_json(self):
        """Test expand_json_columns with invalid/missing JSON data"""
        df_missing = pd.DataFrame(
            {"id": [1, 2, 3], "extra": ['{"field1": "value1"}', None, "invalid json"]}
        )
        expected_df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": ['{"field1": "value1"}', None, "invalid json"],
                "extra_field1": ["value1", None, None],
            }
        )

        result_missing = expand_json_columns(df_missing, "extra")
        pd.testing.assert_frame_equal(result_missing, expected_df)

    def test_expand_empty_column_name(self):
        """Test expand_json_columns with empty column name parameter"""
        df = pd.DataFrame({"id": [1, 2, 3], "extra": ["value1", "value2", "value3"]})
        with pytest.raises(ValueError):
            expand_json_columns(df, "")

    def test_expand_existing_column(self):
        """Test expand_json_columns when expanded column already exists"""
        df = pd.DataFrame(
            {
                "id": [1, 2, 3],
                "extra": [
                    '{"field1": "value1"}',
                    '{"field1": "value2"}',
                    '{"field1": "value3"}',
                ],
                "extra_field1": ["existing1", "existing2", "existing3"],
            }
        )

        with pytest.raises(ValueError):
            expand_json_columns(df, "extra")


@pytest.mark.parametrize(
    "input_value,expected_output",
    [
        (datetime(2020, 2, 1), datetime(2020, 2, 1, tzinfo=timezone.utc)),
        (datetime(2020, 2, 1, tzinfo=timezone.utc), datetime(2020, 2, 1, tzinfo=timezone.utc)),
        ("06/07/2019", datetime(2019, 7, 6, tzinfo=timezone.utc)),
        (None, None),
        ("", None),
        (datetime(1900, 1, 1), None),
        (2020, datetime(2020, 1, 1, tzinfo=timezone.utc)),
        ("2020", datetime(2020, 1, 1, tzinfo=timezone.utc)),
        (1900, None),
        (
            datetime(2020, 2, 1, 2, tzinfo=timezone(timedelta(hours=2))),
            datetime(2020, 2, 1, tzinfo=timezone.utc),
        ),
        ("2020-02-01", datetime(2020, 2, 1, tzinfo=timezone.utc)),
        ("06/07/0983", None),
        (None, None),
        ("", None),
    ],
)
def test_normalize_date(input_value, expected_output):
    df = pd.DataFrame({"date": [input_value]})
    out = normalize_date(df, "date")
    if not pd.isna(expected_output):
        assert out["date"].iloc[0] == expected_output
    else:
        assert pd.isna(normalize_date(df, "date")["date"].iloc[0])
    assert str(out["date"].dtype) == "datetime64[ns, UTC]"


class TestIsDayFirst:
    def test_is_day_first(self):
        dts = pd.Series(["2022-02-01", "2022-01-02", "12-05-2022"])
        assert not is_dayfirst(dts)

    def test_not_is_day_first(self):
        dts = pd.Series(["05/12/2022", "07/03/2024", "2024-04-03"])
        assert is_dayfirst(dts)


class TestNormalizeMontant:
    def test_column_not_present(self):
        df = pd.DataFrame({"other_col": [1, 2, 3]})
        result = normalize_montant(df, "missing_col")
        pd.testing.assert_frame_equal(result, df)

    def test_already_float_column(self):
        df = pd.DataFrame({"amount": [1.0, 2.0, 3.0]})
        result = normalize_montant(df, "amount")
        pd.testing.assert_frame_equal(result, df)

    def test_int_column_is_cast_to_float(self):
        df = pd.DataFrame({"amount": [1, 2, 3]})
        expected = pd.DataFrame({"amount": [1.0, 2.0, 3.0]})
        result = normalize_montant(df, "amount")
        pd.testing.assert_frame_equal(result, expected)

    def test_string_with_special_characters(self):
        df = pd.DataFrame({"amount": ["1,500 €", "2 500 euros", "3,500.00", "125.3", "-1000"]})
        expected = pd.DataFrame({"amount": [1500.0, 2500.0, 3500.0, 125.3, 1000]})
        result = normalize_montant(df, "amount")
        pd.testing.assert_frame_equal(result, expected)

    def test_null_values(self):
        df = pd.DataFrame({"amount": ["1,500 €", None, ""]})
        expected = pd.DataFrame({"amount": [1500.0, None, None]})
        result = normalize_montant(df, "amount")
        pd.testing.assert_frame_equal(result, expected)

    def test_negative_numbers(self):
        df = pd.DataFrame({"amount": [-1000.0, -2000.50, -300]})
        expected = pd.DataFrame({"amount": [1000.0, 2000.50, 300.0]})
        result = normalize_montant(df, "amount")
        pd.testing.assert_frame_equal(result, expected)


class TestNormalizeCommuneCode:
    def test_column_not_present(self):
        df = pd.DataFrame({"other_col": [1, 2, 3]})
        result = normalize_commune_code(df, "missing_col")
        pd.testing.assert_frame_equal(result, df)

    def test_float_column_with_nan(self):
        df = pd.DataFrame({"commune_code": [1.0, 2.0, np.nan]})
        result = normalize_commune_code(df, "commune_code")
        expected = pd.DataFrame({"commune_code": ["00001", "00002", None]})
        pd.testing.assert_frame_equal(result, expected)

    def test_str_column_with_nan(self):
        df = pd.DataFrame({"commune_code": ["1000", "52430", None]})
        result = normalize_commune_code(df, "commune_code")
        expected = pd.DataFrame({"commune_code": ["01000", "52430", None]})
        pd.testing.assert_frame_equal(result, expected)


class TestCleanFileFormat:
    def test_clean_file_format_different_formats(self):
        data = {"format": ["application/json", "TEXT/CSV", "csv/utf8", "pdf", "unknown"]}
        df = pd.DataFrame(data)
        expected_data = {"format": ["json", "csv", "csv", "pdf", "unknown"]}
        expected_df = pd.DataFrame(expected_data)
        result = clean_file_format(df)
        pd.testing.assert_frame_equal(result, expected_df)

    def test_clean_file_format_missing_format_column(self):
        data = {"other_column": ["value1", "value2"]}
        df = pd.DataFrame(data)
        with pytest.raises(KeyError):
            clean_file_format(df)
