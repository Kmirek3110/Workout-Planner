from enum import unique
from rest_framework import serializers
from .models import Workout, Exercise, ActiveExercise, Plan, FinishedPlanInstance
from django.contrib.auth.models import User
from rest_framework.authtoken.views import Token
from rest_framework.fields import CurrentUserDefault


class ExerciseSerializers(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"


class ActiveExerciseSerializers(serializers.HyperlinkedModelSerializer):

    exercise_name = serializers.ReadOnlyField(source='exercise.exercise_name')
    description = serializers.ReadOnlyField(source='exercise.description')
    difficulty = serializers.ReadOnlyField(source="exercise.difficulty")
    type = serializers.ReadOnlyField(source="exercise.type")

    class Meta:
        model = ActiveExercise
        fields = [
            "exercise_name",
            "description",
            "difficulty",
            "reps",
            "sets",
            "type"]


class WorkoutSerializers(serializers.ModelSerializer):
    exercises = ActiveExerciseSerializers(
        source="activeexercise_set", many=True, required=False)

    class Meta:
        model = Workout
        fields = ["id", "title", "exercises"]

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.save()
        return instance


class PlanSerializer(serializers.ModelSerializer):
    workouts = WorkoutSerializers(many=True, required=False)

    class Meta:
        model = Plan
        fields = ["id", "plan_name", "target", "workouts"]


class FinishedSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(many=False, required=False)

    class Meta:
        model = FinishedPlanInstance
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

        extra_kwargs = {'password': {
            'write_only': True,
            'required': True
        }}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user