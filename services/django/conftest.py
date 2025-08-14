import pytest
from testcontainers.postgres import PostgresContainer
from django.conf import settings
from django.core.management import call_command


@pytest.fixture(scope="session")
def postgres_container():
    container = PostgresContainer("postgres:17-alpine").with_bind_ports(5432, None)
    container.start()
    yield container
    container.stop()


@pytest.fixture(scope="session")
def django_db_setup(postgres_container, django_db_blocker):
    with django_db_blocker.unblock():
        host = postgres_container.get_container_host_ip()
        port = postgres_container.get_exposed_port(5432)
        settings.DATABASES["default"].update(
            {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": postgres_container.dbname,
                "USER": postgres_container.username,
                "PASSWORD": postgres_container.password,
                "HOST": host,
                "PORT": port,
            }
        )
        call_command("migrate", verbosity=0)


# if test_can_connect_to_database exists, run it first.
def pytest_collection_modifyitems(items):
    for idx, item in enumerate(items):
        if item.name == "test_can_connect_to_database":
            db_test = items.pop(idx)
            items.insert(0, db_test)
            break
