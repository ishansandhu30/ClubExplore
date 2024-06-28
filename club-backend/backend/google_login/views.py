from urllib.parse import urlencode
from rest_framework import serializers
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.response import Response
from .mixins import PublicApiMixin, ApiErrorsMixin
from .services import google_get_access_token, google_get_user_info, generate_or_get_token
from ..models import User
from ..serializers import UserSerializer


class GoogleLoginApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def post(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.data['data'])
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{settings.BASE_FRONTEND_URL}/signin'
    
        if error or not code:
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        redirect_uri = f'{settings.BASE_FRONTEND_URL}/signin'
        access_token = google_get_access_token(code=code, 
                                               redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)
        profile_image = user_data['picture']

        try:
            user = User.objects.get(email=user_data['email'])
            user.image = profile_image
            user.save()
            token = generate_or_get_token(user)
            data = UserSerializer(user).data
            data['profile'] = profile_image
            response_data = {
                'user': data,
                'token': str(token),
            }
            return Response(response_data)
        except User.DoesNotExist:
            username = user_data['email'].split('@')[0]
            first_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')

            user = User.objects.create(
                username=username,
                email=user_data['email'],
                first_name=first_name,
                last_name=last_name,
                image=profile_image,
                registration_method='google',
            )
         
            token = generate_or_get_token(user)
            data = UserSerializer(user).data
            data['profile'] = profile_image
            response_data = {
                'user': data,
                'token': str(token),
            }
            return Response(response_data)