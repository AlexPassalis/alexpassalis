from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


from api.views import api_user_register, api_blogs
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("user/register/", api_user_register, name="api_user_register"),
    path("token/", TokenObtainPairView.as_view(), name="api_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="api_token_refresh"),
    path("auth/", include("rest_framework.urls")),
    path("blogs/", api_blogs, name="api_blogs"),
    #     path("blogs/<slug:slug>/", ApiBlogsSlugView.as_view(), name="api_blogs_slug"),
    #     path("blogs/id/<uuid:id>/", blogs_id, name="blogs_id"),
    #     path(
    #         "blogs/<slug:slug>/comments/",
    #         blogs_slug_comments,
    #         name="api_blogs_slug_comments",
    #     ),
    #     path("blogs/comments/<uuid:id>/", blogs_comments_id, name="api_blogs_comments_id"),
    #     path("blogs/<slug:slug>/likes/", blogs_slug_likes, name="api_blogs_slug_likes"),
    #     path("blogs/likes/<uuid:id>/", blogs_likes_id, name="api_blogs_likes_id"),
]
