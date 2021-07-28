from django.db.models import fields
from django.shortcuts import render
from .models import ActiveExercise, Exercise, Workout
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .serializers import WorkoutSerializers, ExerciseSerializers, ActiveExerciseSerializers, UserSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
# Create your views here.


@api_view(['GET', 'POST'])
def apiOverview(request):
    api_urls = {
        "Home": '/home',
        "Exercises": "/exercise-list/",
        "Exercise View": "/exercise-view/<str:pk>/",
        "Add Exercise": "/exercise-create/",
        "Delete Exercise": '/exercise-delete/<str:pk>/',
        "Workouts":'workout-list',
        "Workout View": "/workout-view/<str:pk>/",
        "Add Workout": "/workout-create/",
        "Update Workout": '/workout-update/<str:pk>/',
        "Delete Workout": '/workout-delete/<str:pk>/',
        "Workout add Exercise":'workout-add-exercise/<str:pk>',
    }

    return Response(api_urls)


@api_view(["GET"])
def exerciseList(request):
    exercises = Exercise.objects.all()
    serializer = ExerciseSerializers(exercises, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def exerciseDetail(request, pk):
    exercises = Exercise.objects.get(id=pk)
    serializer = ExerciseSerializers(exercises, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def exerciseCreate(request):
    serializer = ExerciseSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
def exerciseDelete(request, pk):
    exercise = Exercise.objects.get(id=pk)
    exercise.delete()

    return Response('Item succsesfully delete!')


@api_view(["GET"])
@authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
def workoutList(request):
    default_workouts = Workout.objects.filter(user__isnull=True)
  
    if str(request.headers["Authorization"]) != "Token undefined":
        token = str(request.headers["Authorization"]).split()[1]
        token = Token.objects.get(key=token)
        user_workouts = Workout.objects.filter(user__in=[token.user_id])
        return_workouts = user_workouts.union(default_workouts)
        serializer = WorkoutSerializers(return_workouts, many=True)
    else:
        serializer = WorkoutSerializers(default_workouts, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def workoutDetail(request, pk):
    workout = Workout.objects.get(id=pk)
    serializer = WorkoutSerializers(workout, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
def workoutCreate(request):
    # print(request.user)
    token = str(request.headers["Authorization"]).split()[1]
    token = Token.objects.get(key=token)
    user = User.objects.get(id=token.user_id)  
    
    serializer = WorkoutSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user.workout.add(serializer.instance)

    return Response(serializer.data)


@api_view(['POST', 'PUT'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
def workoutUpdate(request, pk):
    workout = Workout.objects.get(id=pk)
    serializer = WorkoutSerializers(instance=workout, data=request.data)

    if serializer.is_valid():
        serializer.save()
        request.user.workout.add(workout)
    else:
        print("INVALID")
        print(serializer.errors)

    return Response(serializer.data)


@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
def workoutDelete(request, pk):
    workout = Workout.objects.get(id=pk)
    workout.delete()

    return Response('Item succsesfully delete!')

@api_view(['POST'])
def workoutAddExercise(request, pk):
    print(request)
    workout = Workout.objects.get(id=pk)
    exercise = Exercise.objects.get(exercise_name=request.data['exercise_name'])
    serializer = ActiveExerciseSerializers(data = request.data)

    if serializer.is_valid():
        serializer.save(workout=workout, exercise=exercise)
    return Response("what")

@api_view(['DELETE'])
def workoutDelExercise(request, pk):

    workout = Workout.objects.get(id=pk)
    exercise = Exercise.objects.get(exercise_name=request.data["exercise_name"])
    ActiveExercise.objects.filter(workout=workout,exercise=exercise).first().delete()

    return Response('Item succsesfully delete!')

@api_view(['PUT'])
def workoutUpdExercise(request, pk):
    print(request.data)
    workout = Workout.objects.get(id=pk)
    exercise = Exercise.objects.get(exercise_name=request.data['exercise_name'])
    selected_exercise = ActiveExercise.objects.filter(workout=workout,exercise=exercise).first()
    serializer = ActiveExerciseSerializers(instance=selected_exercise, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response("what")
        

    # exercise = Exercise.objects.get(exercise_name=request.data['exercise_name'])
    # serializer = ActiveExerciseSerializers(data = request.data)

    # if serializer.is_valid():
    #     serializer.save(workout=workout, exercise=exercise)
    # return Response("what")


@api_view(['GET'])
def ActiveExerciseList(request, pk):
    workout = Workout.objects.get(id=pk)
    exercise_list = ActiveExercise.objects.filter(workout=workout)
    serializer = ActiveExerciseSerializers(exercise_list, many=True)
    print(serializer.data)
    return Response(serializer.data)
   


@api_view(['GET', 'POST'])
def userslist(request):
    if request.method == "POST":
        print("WESZŁO HERE")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
    
    queryset = User.objects.all()
    print(queryset)
    serializer_class = UserSerializer(queryset, many=True)
    return Response(serializer_class.data)



# def add_exercise(response):
#     if response.method == "POST":
#         form = CreateNewExercise(response.POST)
#         if form.is_valid():
#             fields = form.cleaned_data
#             new_exercise = Exercise(**fields)
#             new_exercise.save()

#     else:
#         form = CreateNewExercise()


#     return render(response, "main/exercise.html", {"form":form})


# def home(response):
#     return render(response, "main/home.html", {})

# def create(response):
#     if response.method == "POST":

#         form = CreateNewWorkout(response.POST)

#         if form.is_valid():
#             n = form.cleaned_data["name"]
#             t = Workout(name=n)
#             t.save()
#             response.user.workout.add(t)

#         return HttpResponseRedirect("/%s" %t.name)

#     else:
#         form = CreateNewWorkout()

#     return render(response, "main/create.html", {"form":form})

# def view(response):
#     return render(response,"main/view.html")
