from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Blog, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            "id",
            "slug",
            "author",
            "title",
            "content",
            "tags",
            "created_at",
            "last_updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "last_updated_at"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at", "last_updated_at"]
        read_only_fields = ["id", "user", "created_at", "last_updated_at"]
