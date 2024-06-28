from django.urls import path
from . import views
from .google_login.views import GoogleLoginApi
from .club.views import ClubView, UserClubView, CategoryView, JoinClubView, LeaveClubView
from .member.views import PromoteMemberView, DemoteMemberView, MemberView, AddMemberView, RemoveMemberView
from .event.views import EventView, ClubEventView, UserEventView

urlpatterns = [
    path('club/', ClubView.as_view()),
    path('club/user/', UserClubView.as_view()),
    path('club/join/', JoinClubView.as_view()),
    path('club/leave/', LeaveClubView.as_view()),
    
    path('member/', MemberView.as_view()),
    path('member/promote/', PromoteMemberView.as_view()),
    path('member/demote/', DemoteMemberView.as_view()),
    path('member/add/', AddMemberView.as_view()),
    path('member/remove/', RemoveMemberView.as_view()),

    path('event/', EventView.as_view()),
    path('event/club/', ClubEventView.as_view()),
    path('event/user/', UserEventView.as_view()),

    path('category/', CategoryView.as_view()),
    path("auth/login/google/", GoogleLoginApi.as_view(), 
         name="login-with-google"),

]