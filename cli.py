import argparse
import uuid

from dotenv import load_dotenv

load_dotenv()

from dependencies.db import add_key, delete_key, get_all_keys


def generate_key() -> str:
    return str(uuid.uuid4())


def main():
    parser = argparse.ArgumentParser(description="API Key Management Tool")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    add_parser = subparsers.add_parser("add", help="Add a new key")
    add_parser.add_argument(
        "--key", help="Specify a key, auto-generated if not provided"
    )

    subparsers.add_parser("list", help="List all keys")

    delete_parser = subparsers.add_parser("delete", help="Delete a key")
    delete_parser.add_argument("key", help="Key to delete")

    args = parser.parse_args()

    if args.command == "add":
        key = args.key or generate_key()
        if add_key(key):
            print(f"Successfully added key: {key}")
        else:
            print(f"Key {key} already exists")

    elif args.command == "list":
        keys = get_all_keys()
        if keys:
            print("Stored keys:")
            for key in keys:
                print(f"- {key}")
        else:
            print("No keys stored")

    elif args.command == "delete":
        if delete_key(args.key):
            print(f"Deleted key: {args.key}")
        else:
            print(f"Key {args.key} does not exist")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
