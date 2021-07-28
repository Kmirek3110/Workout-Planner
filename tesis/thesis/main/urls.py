from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name="api-overview"),
    path('exercise-list', views.exerciseList, name="exerciselist"),
    path('exercise-view/<str:pk>/',views.exerciseDetail, name="exercisedetail"),
    path('exercise-create', views.exerciseCreate, name="exercisecreate"),
    path('exercise-delete/<str:pk>/', views.exerciseDelete, name="exercisedelete"),
    path('workout-list', views.workoutList, name="workoutlist"),
    path('workout-view/<str:pk>/',views.workoutDetail, name="workoutdetail"),
    path('workout-create', views.workoutCreate, name="workoutcreate"),
    path('workout-update/<str:pk>/', views.workoutUpdate, name="workoutupdate"),
    path('workout-delete/<str:pk>/', views.workoutDelete, name="workoutdelete"),
    path('workout-add-exercise/<str:pk>',views.workoutAddExercise,name="workoutaddexercise"),
    path('workout-delete-exercise/<str:pk>',views.workoutDelExercise,name="workoutdelexercise"),
    path('workout-update-exercise/<str:pk>',views.workoutUpdExercise,name="workoutupdexercise"),
    path('active/<str:pk>',views.ActiveExerciseList, name='activelist'),
    path("users", views.userslist, name="userviewset")
    # path("home",views.home, name="homepage"),
    # path("view",views.view,name="view"),
    # path("create_workout", views.create, name="create"),
    # path("add_exercise", views.add_exercise,name="add_exercise"),
    # path("<str:w_name>",views.index, name="index"), 
]