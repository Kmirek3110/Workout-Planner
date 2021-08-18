from django.contrib import admin
from .models import Exercise, Workout, ActiveExercise, Plan, FinishedPlanInstance

# Register your models here.
admin.site.register(Exercise)
admin.site.register(ActiveExercise)
admin.site.register(Workout)
admin.site.register(Plan)
admin.site.register(FinishedPlanInstance)
