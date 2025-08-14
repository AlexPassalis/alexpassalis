from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
import os
import sys

load_dotenv()


class Env(BaseModel):
    DJANGO_SECRET_KEY: str
    DJANGO_DEBUG: bool
    DJANGO_ALLOWED_HOSTS: list[str]
    POSTGRES_URL: str


try:
    env = Env(
        DJANGO_SECRET_KEY=os.environ.get("DJANGO_SECRET_KEY"),
        DJANGO_DEBUG=False if os.environ.get("PYTHON_ENV") == "production" else True,
        DJANGO_ALLOWED_HOSTS=["localhost", "host.docker.internal"],
        POSTGRES_URL=os.environ.get("TRACKER_POSTGRES_URL"),
    )
except ValidationError as e:
    print("Environment variable missing.", e, file=sys.stderr)
    sys.exit(1)
