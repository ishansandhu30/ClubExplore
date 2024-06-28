from rest_framework.request import Request as RestFrameworkRequest
from rest_framework.views import APIView
from django.http import HttpResponse 
from datetime import timedelta
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

class AuthExpireMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (str(request.path_info) == '/'):
            return HttpResponse("Working")
        
        if (str(request.path_info).startswith('/admin/')) or str(request.path_info).startswith('/media/') or (str(request.path_info).startswith('/api/auth/')):
            return self.get_response(request)
        
        try:
            drf_request: RestFrameworkRequest = APIView().initialize_request(request)
            user = drf_request.user
        except AuthenticationFailed:
            return HttpResponse('Unauthorized', status=401)

        try:
            if hasattr(user, 'auth_token'):
                token = user.auth_token
                if token.created < timezone.now() - timedelta(weeks=1):
                    token.delete()
                    return HttpResponse('Unauthorized', status=401)
            else:
                return HttpResponse('Unauthorized', status=401)
        except AuthenticationFailed:
            return HttpResponse('Unauthorized', status=401)


        response = self.get_response(request)
        return response
