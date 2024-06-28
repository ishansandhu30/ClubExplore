from pathlib import Path
from django.http import HttpResponse
from django.conf import settings
import os


from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

# from .serializers import 
# from .models import 

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.db.models import Avg, Q

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class TestView(APIView):
    def get(self, request):
        
        return Response("Working")
    
def serve_image(request, image_name):
    image_path = os.path.join(settings.MEDIA_ROOT, f'images/{image_name}')
    image_path = os.path.join(BASE_DIR, image_path)
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/png")
    except IOError:
        return HttpResponse("Image not found", status=404)