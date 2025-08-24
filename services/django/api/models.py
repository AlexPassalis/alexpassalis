from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower
from django.core.validators import MinLengthValidator
from api.validators import first_name_validator, last_name_validator
from django.conf import settings
from django.utils.text import slugify
import uuid


class User(AbstractUser):
    username = models.CharField(
        "username",
        max_length=16,
        validators=[UnicodeUsernameValidator(), MinLengthValidator(6)],
        help_text="Letters, digits and @/./+/-/_ only allowed.",
        unique=True,
        error_messages={"unique": "A user with that username already exists."},
        blank=False,
    )
    first_name = models.CharField(
        "first name", max_length=32, validators=[first_name_validator], blank=False
    )
    last_name = models.CharField(
        "last name", max_length=32, validators=[last_name_validator], blank=False
    )
    email = models.EmailField("email", blank=False)

    class Meta:
        constraints = [
            UniqueConstraint(Lower("email"), name="user_email_ci_unique"),
        ]

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.strip().lower()
        super().save(*args, **kwargs)


class Blog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_public = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blogs"
    )
    title = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug or (
            self.pk
            and Blog.objects.filter(pk=self.pk).values_list("title", flat=True).first()
            != self.title
        ):
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


# class Comment(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="comments")
#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments"
#     )
#     content = models.CharField(max_length=1000)
#     created_at = models.DateTimeField(auto_now_add=True)
#     last_updated_at = models.DateTimeField(auto_now=True)


# class Like(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name="likes")
#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="likes"
#     )

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["blog", "user"], name="unique_blog_user_like"
#             )
#         ]
