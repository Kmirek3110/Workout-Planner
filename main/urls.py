from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name="api-overview"),
    path('exercises', views.exerciseList, name="exercises"),
    path(
        'exercise-view/<str:pk>/',
        views.exerciseDetail,
        name="exercisedetail"),
    path('exercise-create', views.exerciseCreate, name="exercisecreate"),
    path(
        'exercise-delete/<str:pk>/',
        views.exerciseDelete,
        name="exercisedelete"),
    path('workout-list', views.workoutList, name="workoutlist"),
    path('workout-view/<str:pk>/', views.workoutDetail, name="workoutdetail"),
    path('workout-create', views.workoutCreate, name="workoutcreate"),
    path(
        'workout-update/<str:pk>/',
        views.workoutUpdate,
        name="workoutupdate"),
    path(
        'workout-delete/<str:pk>/',
        views.workoutDelete,
        name="workoutdelete"),
    path(
        'workout-add-exercise/<str:pk>',
        views.workoutAddExercise,
        name="workoutaddexercise"),
    path(
        'workout-delete-exercise/<str:pk>',
        views.workoutDelExercise,
        name="workoutdelexercise"),
    path(
        'workout-update-exercise/<str:pk>',
        views.workoutUpdExercise,
        name="workoutupdexercise"),
    path('active/<str:pk>', views.ActiveExerciseList, name='activelist'),
    path("users", views.userslist, name="userviewset"),
    path("plans-list", views.trainingPlanList, name="trainingPlan"),
    path("plan-create", views.planCreate, name="planCreate"),
    path("plan-delete/<str:pk>", views.planDelete, name="planDelete"),
    path(
        "plan-add-workout/<str:pk>",
        views.planAddWorkout,
        name="planaddworkout"),
    path(
        "plan-delete-workout/<str:pk>",
        views.planDelWorkout,
        name="plandeleteworkout"),
    path("plan-detail/<str:pk>", views.trainingPlanDetail, name="planDetail"),
    path("finished-list", views.finishedPlanList, name="finishedlist"),
    path("finished-plan/<str:pk>", views.planDone, name="finishedadd"),
    path("generate-plan", views.planGenerate, name="plangenerate")
    # path("undo-finished-workout/<str:pk>",views.WorkoutUndo, name="finisheddel"),
]