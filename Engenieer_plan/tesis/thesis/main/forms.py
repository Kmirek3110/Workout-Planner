from django import forms

class CreateNewWorkout(forms.Form):
    name = forms.CharField(label="Workout Name", max_length=200)


class CreateNewExercise(forms.Form):

    HARD = "hard"
    MEDIUM = "medium"
    EASY = "easy"

    DIFFICULTY = [
       (HARD, ('Really difficult exercise to perform')),
       (MEDIUM, ('Exercise of medium difficulty')),
       (EASY, ('Basic exercise'))
    ]    

    name = forms.CharField(label = "Exercise name", max_length=200)
    description = forms.CharField(label="Description of exercise", max_length=200)
    difficulty = forms.ChoiceField(choices = DIFFICULTY)
