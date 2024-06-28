from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Q

from ..serializers import ClubSerializer, CategorySerializer
from ..models import Club, Category, Verification, Member

def string_to_color(string):
    hash_code = hash(string)
    hex_color = '#' + format(hash_code & 0xFFFFFF, '06x')
    
    return hex_color

class ClubView(APIView):
    def post(self, request):
        verification_code = request.query_params.get('verification_code', '')
        data = request.data
        data['creator'] = request.user.id
        data['color'] = string_to_color(data['title'])
        
        verify = Verification.objects.filter(code=verification_code, user=request.user, used=False).first()

        if not(verify):
            return Response("Incorrect Verification Code", status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ClubSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            verify.used = True
            verify.save()
            Member.objects.create(club=Club.objects.get(id=serializer.data['id']), member=request.user, role="president")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        id = request.query_params.get('club_id', '')

        if id:
            club = Club.objects.filter(id=id).first()
            if not(club):
                return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
            res = ClubSerializer(club, many=False).data
            res['members'] = Member.objects.filter(club=club).count()
            res['category_name'] = Category.objects.get(id=res['category']).name
            return Response(res)
        
        clubs = Club.objects.all()
        res = ClubSerializer(clubs, many=True).data
        return Response(res)
    
    def patch(self, request):
        club_id = request.query_params.get('club_id', '')

        if not club_id:
            return Response({"error": "club_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            club = Club.objects.get(pk=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data

        my_membership = Member.objects.filter(member=request.user, club=club).first()
        if my_membership.role == "member":
            return Response({"error":"You don't have permission to modify club"}, status=status.HTTP_400_BAD_REQUEST)

        
        serializer = ClubSerializer(club, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        club_id = request.query_params.get('club_id', '')

        if not club_id:
            return Response({"error": "club_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            club = Club.objects.get(pk=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
        
        my_membership = Member.objects.filter(member=request.user, club=club).first()
        if my_membership.role == "member":
            return Response({"error":"You don't have permission to delete club"}, status=status.HTTP_400_BAD_REQUEST)
        
        club.delete()
        return Response({"message": "Club deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
class UserClubView(APIView):
    def get(self, request):
        user = request.user
        clubs = list(Club.objects.filter(Q(member__member=user)))
        serialized_clubs = ClubSerializer(clubs, many=True).data
        
        return Response(serialized_clubs, status=status.HTTP_200_OK)
    
class JoinClubView(APIView):
    def get(self, request):
        club_id = request.query_params.get('club_id', '')

        if not club_id:
            return Response({"error": "club_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

        if club.creator == request.user:
            return Response({"error": "You are the creator of this club"}, status=status.HTTP_403_FORBIDDEN)
        
        if Member.objects.filter(club=club, member=request.user).exists():
            return Response({"error": "You are already a member of this club"}, status=status.HTTP_400_BAD_REQUEST)

        Member.objects.create(club=club, member=request.user, role="member")

        return Response("Club Joined Successfully", status=status.HTTP_201_CREATED)
    
class LeaveClubView(APIView):
    def get(self, request):
        club_id = request.query_params.get('club_id', '')

        if not club_id:
            return Response({"error": "club_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

        if club.creator == request.user:
            return Response({"error": "You are the creator of this club"}, status=status.HTTP_403_FORBIDDEN)
        
        if not(Member.objects.filter(club=club, member=request.user).exists()):
            return Response({"error": "You are not a member of this club"}, status=status.HTTP_400_BAD_REQUEST)

        Member.objects.get(club=club, member=request.user).delete()

        return Response("Club Left Successfully", status=status.HTTP_201_CREATED)

class CategoryView(APIView):
    def get(self, request):
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)

        return Response(serializer.data)
        
        