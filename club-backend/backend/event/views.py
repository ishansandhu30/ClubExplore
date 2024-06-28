import pytz
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import Q
from ..serializers import EventSerializer
from ..models import Club, Member, Event
from datetime import datetime

def convert_timezone(timezone, date, start_time, end_time, new_timezone=pytz.utc):
    try:
        event_date = datetime.strptime(str(date), '%Y-%m-%d')
        start_time = datetime.strptime(str(start_time), '%H:%M:%S').time()
        end_time = datetime.strptime(str(end_time), '%H:%M:%S').time()
    except ValueError:
        raise Exception("Invalid date or time format")

    if timezone:
        try:
            try:
                local_tz = pytz.FixedOffset(int(timezone) * 60)
            except:
                local_tz = pytz.timezone(timezone)

            event_date = local_tz.localize(event_date)
            start_time = local_tz.localize(datetime.combine(event_date, start_time))
            end_time = local_tz.localize(datetime.combine(event_date, end_time))
        except pytz.UnknownTimeZoneError:
            raise Exception("Unknown timezone")
        except pytz.exceptions.NonExistentTimeError:
            raise Exception("Invalid time in the given timezone")
        except pytz.exceptions.AmbiguousTimeError:
            raise Exception("Ambiguous time in the given timezone")
        
        try:
            tim = pytz.FixedOffset(int(new_timezone) * 60)
        except:
            tim = pytz.utc
        return [start_time.astimezone(tim).date(), start_time.astimezone(tim).time(), end_time.astimezone(tim).time()]
    

class EventView(APIView):
    def post(self, request):
        timezone = request.query_params.get('timezone', '')
        data = request.data

        try:
            club = Club.objects.get(pk=data['club'])
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            member = Member.objects.get(member=request.user, club=club)
        except Member.DoesNotExist:
            return Response({"error": "You are not a member of the club"}, status=status.HTTP_403_FORBIDDEN)

        if member.role == "member":
            return Response({"error": "You are not allowed to create events"}, status=status.HTTP_403_FORBIDDEN)

        try:
            new_time = convert_timezone(timezone, data['date'], data['start_time'], data['end_time'])
        except Exception as e:
            return Response(e.__str__(), status=status.HTTP_400_BAD_REQUEST)
        
        data['date'] = new_time[0]
        data['start_time'] = new_time[1]
        data['end_time'] = new_time[2]

        serializer = EventSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        timezone = request.query_params.get('timezone', '')
        event_id = request.query_params.get('event_id', '')

        if not event_id:
            return Response({"error": "event_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data

        try:
            member = Member.objects.get(member=request.user, club=event.club)
        except Member.DoesNotExist:
            return Response({"error": "You are not a member of the club"}, status=status.HTTP_403_FORBIDDEN)

        if member.role == "member" :
            return Response({"error":"You don't have permission to modify the event"}, status=status.HTTP_400_BAD_REQUEST)

        if not timezone:
            return Response({"error": "timezone parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            offset_hours = int(timezone)
        except ValueError:
            return Response({"error": "Invalid timezone format"}, status=status.HTTP_400_BAD_REQUEST)

        timezone_obj = pytz.FixedOffset(offset_hours * 60)

        if 'date' in data:
            try:
                event_date = datetime.strptime(data['date'], '%Y-%m-%d')
                event_date = timezone_obj.localize(event_date)
            except ValueError:
                return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)
            data['date'] = event_date.astimezone(pytz.utc).date()

        if 'start_time' in data:
            try:
                start_time = datetime.strptime(data['start_time'], '%H:%M').time()
                start_time = timezone_obj.localize(start_time)
            except ValueError:
                return Response({"error": "Invalid start_time format"}, status=status.HTTP_400_BAD_REQUEST)
            data['start_time'] = start_time.astimezone(pytz.utc).time()

        if 'end_time' in data:
            try:
                end_time = datetime.strptime(data['end_time'], '%H:%M').time()
                end_time = timezone_obj.localize(end_time)
            except ValueError:
                return Response({"error": "Invalid end_time format"}, status=status.HTTP_400_BAD_REQUEST)
            data['end_time'] = end_time.astimezone(pytz.utc).time()
        
        serializer = EventSerializer(event, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        event_id = request.query_params.get('event_id', '')

        if not event_id:
            return Response({"error": "event_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            member = Member.objects.get(member=request.user, club=event.club)
        except Member.DoesNotExist:
            return Response({"error": "You are not a member of the club"}, status=status.HTTP_403_FORBIDDEN)

        if member.role == "member":
            return Response({"error": "You don't have permission to delete the event"}, status=status.HTTP_403_FORBIDDEN)

        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class ClubEventView(APIView):
    def get(self, request):
        club_id = request.query_params.get('club_id', '')
        timezone = request.query_params.get('timezone', '')

        if not club_id:
            return Response({"error": "club_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        events = Event.objects.filter(club_id=club_id)
        
        formatted_events = {}
        for event in events:
            new_date = convert_timezone("UTC", event.date, event.start_time, event.end_time, timezone)
            event_data = {
                "id": str(event.id),
                "title": event.title,
                "date": new_date[0].strftime("%A, %d %B %Y"),
                "time": f"{new_date[1].strftime('%I:%M %p')} - {new_date[2].strftime('%I:%M %p')}",
                "location": event.location,
                "eventDescription": event.description,
                "color": event.club.color,
            }
            try:
                formatted_events[new_date[0].strftime("%d%m%Y")].append(event_data)
            except KeyError:
                formatted_events[new_date[0].strftime("%d%m%Y")] = []
                formatted_events[new_date[0].strftime("%d%m%Y")].append(event_data)

        return Response(formatted_events)
    
class UserEventView(APIView):
    def get(self, request):
        user = request.user
        timezone = request.query_params.get('timezone', '')

        events = []
        member_clubs = Member.objects.filter(member=user)
        for member in member_clubs:
            club_events = Event.objects.filter(club=member.club)
            events.extend(club_events)
        
        formatted_events = {}
        for event in events:
            new_date = convert_timezone("UTC", event.date, event.start_time, event.end_time, timezone)
            event_data = {
                "id": str(event.id),
                "title": event.title,
                "date": new_date[0].strftime("%A, %d %B %Y"),
                "time": f"{new_date[1].strftime('%I:%M %p')} - {new_date[2].strftime('%I:%M %p')}",
                "location": event.location,
                "eventDescription": event.description,
                "color": event.club.color,
                "club_id": event.club.id,
                "category": event.club.category.name,
                "category_id": event.club.category.id,
            }
            try:
                formatted_events[new_date[0].strftime("%d%m%Y")].append(event_data)
            except KeyError:
                formatted_events[new_date[0].strftime("%d%m%Y")] = []
                formatted_events[new_date[0].strftime("%d%m%Y")].append(event_data)

        return Response(formatted_events)