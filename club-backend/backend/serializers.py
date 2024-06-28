from rest_framework import serializers
from .models import User, Club, Category, Member, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'role']

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ('id', 'title', 'description', 'category', 'banner', 'color','creator')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['value'] = representation['id']
        representation['label'] = representation['title']
        return representation

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'club', 'title', 'date', 'start_time', 'end_time', 'location','description')

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('id', 'club', 'member', 'role')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = User.objects.get(id=representation['member'])
        representation['name'] = user.first_name + " " + user.last_name
        representation['image'] = user.image
        representation['role'] = representation['role'][0].upper() + representation['role'][1:]
        return representation

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        data = {}
        data['value'] = representation['id']
        data['label'] = representation['name']
        return data