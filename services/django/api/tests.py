import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.response import Response
from typing import cast


@pytest.mark.django_db
def test_get_api_blogs():
    client = APIClient()
    url = reverse("api_blogs")
    response = cast(Response, client.get(url))

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []
