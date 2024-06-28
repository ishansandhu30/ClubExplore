from django.contrib.auth.models import AbstractUser
from django.db import models
import os

class User(AbstractUser):
    email = models.CharField(max_length=250, unique=True, null=False, blank=False)
    first_name = models.CharField(max_length=250)
    last_name = models.CharField(max_length=250)
    image = models.CharField(max_length=500)
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=250, choices=ROLE_CHOICES, default='user')
    REGISTRATION_CHOICES = [
        ('email', 'Email'),
        ('google', 'Google'),
    ]
    registration_method = models.CharField(
        max_length=10,
        choices=REGISTRATION_CHOICES,
        default='email'
    )
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name'] 

    def __str__(self):
       return self.email

class Category(models.Model):
    name = models.CharField(max_length=250)

    def __str__(self) -> str:
        return self.name

class Club(models.Model):
    title = models.CharField(max_length=250)
    description = models.CharField(max_length=800)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    banner = models.ImageField(upload_to='images/')
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    color = models.CharField(max_length=800)

    def __str__(self) -> str:
        return self.title
    
    def save(self, *args, **kwargs):
        if self.pk:
            try:
                existing_club = Club.objects.get(pk=self.pk)
            except Club.DoesNotExist:
                existing_club = None

            if existing_club and existing_club.banner != self.banner:
                if existing_club.banner:
                    if os.path.isfile(existing_club.banner.path):
                        os.remove(existing_club.banner.path)

        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        if self.banner:
            if os.path.isfile(self.banner.path):
                os.remove(self.banner.path)
        super().delete(*args, **kwargs)

class Member(models.Model):
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    ROLE_CHOICES = [
        ('president', 'President'),
        ('vice president', 'Vice President'),
        ('secretary', 'Secretary'),
        ('treasurer', 'Treasurer'),
        ('member', 'Member'),
    ]
    role = models.CharField(max_length=250, choices=ROLE_CHOICES, default="member")

    def __str__(self) -> str:
        return f"Member: {self.member.email} in {self.club.title}"

class Event(models.Model):
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=250)
    description = models.CharField(max_length=800)

    def __str__(self) -> str:
        return f"Event: {self.title} in {self.club.title}"

class Verification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=250)
    used = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.user} : {self.code} (USED: {self.used})"




    