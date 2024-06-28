from django.contrib import admin
from .models import User, Category, Club, Member, Event, Verification

# Register your models here.
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Club)
admin.site.register(Member)
admin.site.register(Event)
admin.site.register(Verification)