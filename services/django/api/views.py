from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from .models import Blog, Comment, Like
from .serializers import UserSerializer, BlogSerializer, CommentSerializer
from uuid import UUID
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly


class ApiUserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ApiBlogsView(generics.ListCreateAPIView):
    queryset = Blog.objects.filter(is_public=True).order_by("-created_at")
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(auth=self.request.user)


# @extend_schema(
#     request=None,
#     responses=BlogSerializer(many=True),
# )
# @api_view(["GET", "POST"])
# def blogs(request: Request):
#     if request.method == "GET":  # Everyone
#         serializer = BlogSerializer(
#             Blog.objects.filter(is_public=True).order_by("-created_at"), many=True
#         )
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     if request.method == "POST":  # Must be a user that becomes the author
#         serializer = BlogSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiBlogsSlugView(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Blog.objects.filter(
        is_public=True,
    )
    serializer_class = BlogSerializer


# @api_view(
#     [
#         "GET",
#     ]
# )
# def blogs_slug(request: Request, slug: str):
#     blog = get_object_or_404(
#         Blog, slug=slug
#     )  # If user only if blog the is_public=True, if author always

#     serializer = BlogSerializer(blog)
#     return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PATCH", "DELETE"])
def blogs_id(request: Request, id: UUID):  # Must be the author
    blog = get_object_or_404(Blog, id=id)

    if request.method == "PATCH":
        serializer = BlogSerializer(blog, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            updatedSerializer = BlogSerializer(updated)
            return Response(updatedSerializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def blogs_slug_comments(request: Request, slug: str):  # Everyone
    blog = get_object_or_404(Blog, slug=slug)
    comments = Comment.objects.filter(blog=blog).order_by("created_at")

    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PATCH", "DELETE"])
def blogs_comments_id(request: Request, id: UUID):  # Must be the user
    comment = get_object_or_404(Comment, id=id)

    if request.method == "PATCH":
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            updatedSerializer = CommentSerializer(updated)
            return Response(updatedSerializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(
    [
        "GET",
    ]
)
def blogs_slug_likes(
    request: Request, slug: str
):  # Everyone + (need to know if the user making the request has liked, so that he cannot like again on the front-end.)
    blog = get_object_or_404(Blog, is_public=True, slug=slug)

    if request.method == "GET":
        likes = Like.objects.filter(blog=blog).count()
        return Response({"likes": likes}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
def blogs_likes_id(request: Request, id: UUID):  # Must be the user
    like = get_object_or_404(Like.objects.select_related("blog"), id=id)

    if not like.blog.is_public:
        return Response(status=status.HTTP_404_NOT_FOUND)

    like.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
