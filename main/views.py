from re import T
import re
import csv
from typing import OrderedDict
from django.db.models import fields
from django.db.models.query import QuerySet
from django.shortcuts import render
from rest_framework import serializers
from .models import ActiveExercise, Exercise, FinishedPlanInstance, FinishedPlanInstance, Plan, Workout
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .serializers import PlanSerializer, WorkoutSerializers, ExerciseSerializers,ActiveExerciseSerializers, UserSerializer, FinishedSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .utils import generate_plan, listexercises
# from utility import listexercises
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
        "Workout add Exercise":'/workout-add-exercise/<str:pk>',
        "Training Plans list":"/plans-list",
        "Training Plan Detail":"/plan-view/<str:pk>",
        "Finished Plan instance list":"/finished-list",
        "Mark Plan as done":"/finished-plan/<str:pk>",
        "Undo Plan":"/undo-finished-plan/<str:pk>",
    }

    return Response(api_urls)


def token_autorization(data):
    # print(data)
    if "Authorization" in data and str(data["Authorization"]) != "Token undefined":
        token = str(data["Authorization"]).split()[1]
        token = Token.objects.get(key=token)
        return token
    return None



@api_view(["GET"])
def exerciseList(request):
    # list = listexercises()
    # for row in list:
    #         _, created = Exercise.objects.get_or_create(
    #             exercise_name=row[0],
    #             description=row[2],
    #             type=row[1],
    #             difficulty=row[3],
    #             )
    exercises = Exercise.objects.all()
    serializer = ExerciseSerializers(exercises, many=True)
    # print(serializer.data)
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
    
    token = token_autorization(request.headers)
    user_plans = Plan.objects.filter(user = token.user_id)
    workouts = Workout.objects.none()
    for plan in user_plans:
        workouts = workouts | plan.workouts.all()

    serializer = WorkoutSerializers(workouts.distinct(), many=True)
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
        # print("INVALID")
        return(serializer.errors)

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
        
@api_view(['GET'])
def ActiveExerciseList(request, pk):
    workout = Workout.objects.get(id=pk)
    exercise_list = ActiveExercise.objects.filter(workout=workout)
    serializer = ActiveExerciseSerializers(exercise_list, many=True)
    # print(serializer.data)
    return Response(serializer.data)
   


@api_view(['GET', 'POST'])
def userslist(request):
    if request.method == "POST":
        # print("WESZŁO HERE")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
    
    queryset = User.objects.all()
    # print(queryset)
    serializer_class = UserSerializer(queryset, many=True)
    return Response(serializer_class.data)

@api_view(['GET'])
def trainingPlanList(request):
    default_plans = Plan.objects.filter(user__isnull=True)
    if  "Authorization" in request.headers and str(request.headers["Authorization"]) != "Token undefined":
        token = str(request.headers["Authorization"]).split()[1]
        token = Token.objects.get(key=token)
        user_plans = Plan.objects.filter(user=token.user_id)
        return_plans = user_plans.union(default_plans)
        serializer = PlanSerializer(return_plans, many=True)
    else:
        serializer = PlanSerializer(default_plans, many = True)
        
    return Response(serializer.data)


@api_view(["POST"])
def planCreate(request):
 
    token = token_autorization(request.headers)
    # print(token)
    if token is not None:
        user = User.objects.get(id=token.user_id)
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user.plan.add(serializer.instance) 
            print("gitara")
            return Response(serializer.data)
        else:
            print("??///")
            return Response(serializer.errors)
            print(serializer.error_messages)
    
    return Response("Failed")

@api_view(["DELETE"])
def planDelete(request, pk):
    token = token_autorization(request.headers)
    if token is not None:
        user = User.objects.get(id=token.user_id)
        plan = Plan.objects.get(id=pk)
        if plan.user_id == user.id:
            plan.delete()
            return Response("Deleted")            
    return Response("Failed")

@api_view(['POST'])
def planAddWorkout(request, pk):
    plan = Plan.objects.get(id=pk)
   
    serializer = WorkoutSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()
        plan.workouts.add(serializer.instance)

    return Response("what")


@api_view(['DELETE'])
def planDelWorkout(request, pk):
    plan = Plan.objects.get(id=pk)
    workout = Workout.objects.get(exercise_name=request.data["title"])
    ActiveExercise.objects.filter(plan=plan,workout=workout).first().delete()

    return Response('Item succsesfully delete!')


@api_view(['GET'])
def trainingPlanDetail(request, pk):
    # print(request.headers)
    if "Authorization" in request.headers and str(request.headers["Authorization"]) != "Token undefined":
        token = str(request.headers["Authorization"]).split()[1]
        token = Token.objects.get(key=token)
        selected_plan = Plan.objects.filter(id=pk)
        serializer = PlanSerializer(selected_plan, many=True)
    else:
        return Response("Failed")

    return Response(serializer.data)

@api_view(['GET'])
def finishedPlanList(request):
    token = token_autorization(request.headers)
    if token is not None:
        plans = Plan.objects.filter(user = token.user_id)
        finishedplans = FinishedPlanInstance.objects.filter(plan__in = plans)
        serializer = FinishedSerializer(finishedplans, many=True)
        # print(serializer.data)
        return Response(serializer.data)
    return Response("failed")

@api_view(['POST'])
def planDone(request, pk):
    token = token_autorization(request.headers)
    print(request.data)
    if token is not None:
        plan = Plan.objects.get(id=pk)
        serializer = FinishedSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(plan=plan)
        else:
            print(serializer.errors)

    return Response("Gitara")

@api_view(['POST',"GET"])
def planGenerate(request):
    token = token_autorization(request.headers)
    # print(request.data)
    if token is not None:
        
        time = request.data["time"]
        target = request.data["target"]
        num = request.data["number"]
        exercises = request.data["exercises"]

        plan_name = "Generated-"+target
        plan, reps, sets = generate_plan(num, target, mandatory_exercises = exercises, time_per_workout = int(time))
        print(reps,sets)

        user = User.objects.get(id=token.user_id)
        p = Plan(plan_name=plan_name, target=target)
        p.save()
        for i, wrk in enumerate(plan):
            workout = Workout.objects.create(title = "Workout "+str(i+1))
            for exr in set(wrk.exercises):
                exr = Exercise.objects.get(exercise_name=exr)
                ActiveExercise.objects.create(reps=reps,
                 sets=sets, exercise = exr, workout=workout)
            p.workouts.add(workout)
        p.plan_name = p.plan_name + str(p.pk)
        p.save()
        
        user.plan.add(p) 

    serializer = PlanSerializer(p,many=False)
    print(serializer.data)
    return Response(serializer.data)



