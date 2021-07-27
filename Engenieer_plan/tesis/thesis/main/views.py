from django.db.models import fields
from django.shortcuts import render
from rest_framework.serializers import Serializer
from .models import ActiveExercise, Exercise, Workout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import WorkoutSerializers, ExerciseSerializers, ActiveExerciseSerializers, UserSerializer
from django.contrib.auth.models import User
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
def workoutList(request):
    workouts = Workout.objects.all()
    serializer = WorkoutSerializers(workouts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def workoutDetail(request, pk):
    workout = Workout.objects.get(id=pk)
    serializer = WorkoutSerializers(workout, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def workoutCreate(request):
    serializer = WorkoutSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST', 'PUT'])
def workoutUpdate(request, pk):
    workout = Workout.objects.get(id=pk)
    print(workout)
    print(request.data)
    serializer = WorkoutSerializers(instance=workout, data=request.data)
    print(serializer)

    if serializer.is_valid():
        serializer.save()
        request.user.workout.add(workout)
    else:
        print("INVALID")
        print(serializer.errors)

    return Response(serializer.data)


@api_view(['DELETE'])
def workoutDelete(request, pk):
    workout = Workout.objects.get(id=pk)
    workout.delete()

    return Response('Item succsesfully delete!')

@api_view(['POST'])
def workoutAddExercise(request, pk):
    
    workout = Workout.objects.get(id=pk)
    exercise = Exercise.objects.get(exercise_name=request.data['exercise_name'])
    serializer = ActiveExerciseSerializers(data = request.data)

    if serializer.is_valid():
        serializer.save(workout=workout, exercise=exercise)
    return Response("what")


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
