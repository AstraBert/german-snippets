import os
import json
import polars as pl

from pathlib import Path
from argparse import ArgumentParser


def main() -> None:
    parser = ArgumentParser()
    parser.add_argument(
        "-p",
        "--path",
        help="Destination path (defaults to current directory if not provided)",
        required=False,
        default="./",
    )
    args = parser.parse_args()

    if not os.path.exists(args.path):
        if not Path(args.path).suffix:
            os.makedirs(args.path, exist_ok=True)
            actual_path = os.path.join(args.path, "german-snippets.json")
        else:
            os.makedirs(os.path.dirname(args.path))
            actual_path = args.path
    else:
        if Path(args.path).is_dir():
            actual_path = os.path.join(args.path, "german-snippets.json")
        else:
            actual_path = args.path

    splits = {
        "train": "data/train-00000-of-00001-e7ac9b62c502958f.parquet",
        "test": "data/test-00000-of-00001-505bc6e05140fc15.parquet",
    }
    df = pl.read_parquet(
        "hf://datasets/jmelsbach/easy-german-definitions/" + splits["train"]
    )

    json_content = df.to_dicts()
    code_snippets = {"snippets": json_content}
    with open(actual_path, "w") as jsonf:
        json.dump(code_snippets, jsonf, indent=4)
