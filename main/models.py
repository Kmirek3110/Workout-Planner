from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import random

from django.db.models.fields.related import ForeignKey, OneToOneField
# Create your models here.

class Exercise(models.Model):
    """
    Klasa reprezentująca ćwiczenia posiadająca pola takie jak
    description(opis), type czyli główny sprecyzowany główny mięsień
    działający oraz difficulty który w skali 1-3 opisuję poziom skomplikowania.
    """
    # workout = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True)
    exercise_name = models.CharField(max_length=200)
    description = models.CharField(max_length=600)
    
    TYPES = [
        ("L","Legs"),
        ("B","Back"),
        ("C","Chest"),
        ("A","ABS"),
        ("S","Shoulders"),
        ("T","Triceps"),
        ("Bi","Biceps"),
        ("Ca","Cardio")
    ]

    type = models.CharField(max_length=40, choices=TYPES, default="Ca")

    HARD = "hard"
    MEDIUM = "medium"
    EASY = "easy"

    DIFFICULTY = [
       (HARD, ('Really difficult exercise to perform')),
       (MEDIUM, ('Exercise of medium difficulty')),
       (EASY, ('Basic exercise'))
    ]    
    
    difficulty = models.CharField(
        max_length=32,
        choices=DIFFICULTY,
        default=MEDIUM,
    )

    def __str__(self):
        return self.exercise_name

    def __unicode__(self):
        return '%s: %s %s' % (self.exercise_name, self.description, self.difficulty)


class Workout(models.Model):
    """
    Klasa odpowiadająca za zbiór ćwiczeń które mamy wykonać
    na jednym treningu.
    """
    title = models.CharField(max_length=200)
    exercises = models.ManyToManyField(Exercise,through="ActiveExercise")

    def __str__(self):
        return self.title


class ActiveExercise(models.Model):
    """
    Klasa typu through dodaje ćwiczenia do jednostki treningowej wraz z dodatkowymi
    atrybutami takimi jak ilość powtórzeń oraz serii.
    """
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, null=True)
    reps = models.IntegerField()
    sets = models.IntegerField()
   
    class Meta:
        unique_together =[['workout','exercise']]


class Plan(models.Model):
    """
    Plan nasza główna klasa która składa się z kilku workoutów spinając je w jeden
    plan treningowy.
    """
    plan_name =  models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="plan", null=True, blank=True)
    workouts = models.ManyToManyField(Workout, blank=True)
    
    class Target(models.TextChoices):
        Weight_loss = 'WL'
        Strength = "STR"
        Endurance = "EN"
    
    target = models.TextField(choices = Target.choices, default=Target.Strength)

    def __str__(self):
        return self.plan_name   


class FinishedPlanInstance(models.Model):
    """
    Po zrealizowaniu tygodniowego planu treningowego uzupełniami informację o naszym 
    progresie.
    """
    plan = ForeignKey(Plan, on_delete=models.CASCADE, null=True, blank=True)
    progress = models.TextField()
    creation_date = models.TimeField(auto_now=False, auto_now_add=True)
 
    

# class Profile(models.Model):

#     class Target(models.TextChoices):
#         Weight_loss = 'WL'
#         Strength = "STR"
#         Endurance = "EN"

#     user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
#     weight = models.IntegerField(null=True)
#     height = models.IntegerField(null=True)
#     workout_per_week = models.SmallIntegerField(null=True)
#     target = models.TextField(choices = Target.choices, default=Target.Strength)

#     def __str__(self):
#         return self.user + "/n" + self.weight + "/n" + self.height

