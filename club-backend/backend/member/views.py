from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Q

from ..serializers import MemberSerializer
from ..models import Club, Member, User

class MemberView(APIView):
    def get(self, request):
        club_id = request.query_params.get('club_id', '')

        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
        
        member = Member.objects.filter(club=club)
        res = MemberSerializer(member, many=True).data

        return Response(res, status=status.HTTP_200_OK)

class AddMemberView(APIView):
    def post(self, request):
        club_id = request.query_params.get('club_id', '')
        email = request.data.get('email', '')
         
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
         
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        member = Member.objects.filter(member=user, club=club).first()

        if member:
            return Response({"error": "User already a member"}, status=status.HTTP_400_BAD_REQUEST)
        
        my_membership = Member.objects.filter(member=request.user, club=club).first()
        if my_membership.role == "member":
            return Response({"error": "You don't have permission to add members in this club"}, status=status.HTTP_403_FORBIDDEN)
        

        Member.objects.create(club=club, member=user, role="member")

        return Response("Member Added!", status=status.HTTP_200_OK)

class RemoveMemberView(APIView):
    def delete(self, request):
        club_id = request.query_params.get('club_id', '')
        member_id = request.query_params.get('member_id', '')
         
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
         
        member = Member.objects.filter(id=member_id, club=club).first()

        if not(member):
            return Response({"error": "Member not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        my_membership = Member.objects.filter(member=request.user, club=club).first()
        if my_membership.role == "member":
            return Response({"error": "You don't have permission to remove members in this club"}, status=status.HTTP_403_FORBIDDEN)
        
        if member.member == member.club.creator:
            return Response({"error": "Creator of the club can not be removed"}, status=status.HTTP_403_FORBIDDEN)

        member.delete()
        return Response("Member Deleted!", status=status.HTTP_200_OK)
    
class PromoteMemberView(APIView):
    def post(self, request):
        member_id = request.query_params.get('member_id', '')
        club_id = request.query_params.get('club_id', '')
        role = request.data.get('role', '')

        if not member_id or not club_id:
            return Response({"error": "member_id and club_id parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            member = Member.objects.get(id=member_id, club_id=club_id)
        except Member.DoesNotExist:
            return Response({"error": "Member not found for this club"}, status=status.HTTP_404_NOT_FOUND)

        if request.user == member.club.creator:
            member.role = role.lower()
            member.save()

            return Response("Successfully Promoted!", status=status.HTTP_200_OK)

        user_membership = Member.objects.filter(club_id=club_id, member=request.user).first()
        if not user_membership or user_membership.role != "president" or user_membership.role != "vice president":
            return Response({"error": "You don't have permission to promote members in this club"}, status=status.HTTP_403_FORBIDDEN)
        
        if role.lower() == "president":
            if not(user_membership.role == "president"):
                return Response({"error": f"You don't have permission to promote to president in this club"}, status=status.HTTP_403_FORBIDDEN)

        member.role = role.lower()
        member.save()

        return Response("Successfully Promoted", status=status.HTTP_200_OK)
    

class DemoteMemberView(APIView):
    def get(self, request):
        member_id = request.query_params.get('member_id', '')
        club_id = request.query_params.get('club_id', '')

        if not member_id or not club_id:
            return Response({"error": "member_id and club_id parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            member = Member.objects.get(id=member_id, club_id=club_id)
        except Member.DoesNotExist:
            return Response({"error": "Member not found for this club"}, status=status.HTTP_404_NOT_FOUND)
        
        if member.member == member.club.creator:
            return Response({"error": "Creator can not be demoted"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user == member.club.creator:
            member.role = "member"
            member.save()

            return Response("Successfully Demoted!", status=status.HTTP_200_OK)

        user_membership = Member.objects.filter(club_id=club_id, member=request.user).first()
        if not user_membership or user_membership.role != "president" or user_membership.role != "vice president":
            return Response({"error": "You don't have permission to demote members in this club"}, status=status.HTTP_403_FORBIDDEN)
        
        if member.role.lower() == "president":
            if not(user_membership.role == "president"):
                return Response({"error": f"You don't have permission to demote president to member in this club"}, status=status.HTTP_403_FORBIDDEN)

        member.role = "member"
        member.save()

        return Response("Successfully Demoted", status=status.HTTP_200_OK)