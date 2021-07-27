from django.contrib import admin
from .models import Exercise, Workout, ActiveExercise

# Register your models here.
admin.site.register(Exercise)
admin.site.register(ActiveExercise)
admin.site.register(Workout)
