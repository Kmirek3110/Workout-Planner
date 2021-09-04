from .models import Exercise
import random
import math

muscle_split = {
    "L": 0,
    "B": 0,
    "C": 0,
    "S": 0,
    "T": 0,
    "Bi": 0,
}


class Workout:
    """
    Klasa odpowiadająca klasie modelowej django przydatna w generowaniu
    planów.
    """

    def __init__(self, time_per_workout, split=muscle_split) -> None:
        self.time = time_per_workout
        self.exercises = []
        self.muscle_split = split

    def __str__(self) -> str:
        return str(self.time) + "".join([str(exr) for exr in self.exercises])


def generate_plan(workouts, type, mandatory_exercises, time_per_workout=90):

    workout_rules = {
        "EN": (1.5, (4, 15)),
        "STR": (4, (3, 5)),
        "WL": (2, (5, 10))
    }

    plan_split = {
        1: "FullBodyWorkout",
        2: "DoubleFBW",
        3: "PowerliftingSplit",
        4: "Split_with_arms",
    }

    rest_time = workout_rules[type][0]
    sets, reps = workout_rules[type][1]
    split = plan_split[workouts]

    mandatory = [elem["exercise_name"] for elem in mandatory_exercises]

    if type in ["EN", "WL"] and time_per_workout > 60:
        sets += 2

    hard_exercises = Exercise.objects.filter(difficulty='hard')
    medium_exercises = Exercise.objects.filter(difficulty='medium')
    easy_exercises = Exercise.objects.filter(difficulty__in=['medium', "easy"])
    abs_exercises = Exercise.objects.filter(type="A")
    mandatory_exercises = Exercise.objects.filter(exercise_name__in=mandatory)

    plan = []
    plan_exercises = []

    if split != "PowerliftingSplit" and split != "Split_with_arms":

        for _ in range(workouts):
            workout = Workout(time_per_workout=time_per_workout)
            plan.append(workout)

        counter = 0

        for exercise in mandatory_exercises:
            plan[counter].exercises.append(exercise)
            plan[counter].muscle_split[exercise.type] += 1
            plan[counter].time -= (sets * rest_time) + 1
            counter += 1
            plan_exercises.append(exercise)
            counter %= workouts

    elif split == "PowerliftingSplit":
        groups = [{
            "C": 0,
            "T": 0,
            "S": 0,
        },
            {
            "B": 0,
            "Bi": 0,
            "S": 0,
        },
            {
            "L": 0,
            "A": 0,
        }]

        workout1 = Workout(time_per_workout=time_per_workout, split=groups[0])
        workout2 = Workout(time_per_workout=time_per_workout, split=groups[1])
        workout3 = Workout(time_per_workout=time_per_workout, split=groups[2])

        plan.append(workout1)
        plan.append(workout2)
        plan.append(workout3)

    else:

        groups = [{
            "C": 0,
            "T": 0,
        },
            {
            "B": 0,
            "Bi": 0,
        },
            {
            "L": 0,
            "A": 0,
        },
            {
            'S': 0,
            'Bi': 0,
            'T': 0,
        }]

        workout1 = Workout(time_per_workout=time_per_workout, split=groups[0])
        workout2 = Workout(time_per_workout=time_per_workout, split=groups[1])
        workout3 = Workout(time_per_workout=time_per_workout, split=groups[2])
        workout4 = Workout(time_per_workout=time_per_workout, split=groups[3])

        plan.append(workout1)
        plan.append(workout2)
        plan.append(workout3)
        plan.append(workout4)

    for i, workout in enumerate(plan):
        current_exercises = mandatory_exercises.filter(
            type__in=workout.muscle_split.keys())

        for exercise in current_exercises:
            workout.time -= reps * rest_time
            workout.muscle_split[exercise.type] += 1
            workout.exercises.append(exercise)
            plan_exercises.append(exercise)

    if split == "FullBodyWorkout":

        chosen_hard = random.sample(list(hard_exercises), k=3)
        counter = 0

        for exercise in chosen_hard:
            if plan[0].time < sets * rest_time:
                break
            plan[0].muscle_split[chosen_hard[counter].type] += 1
            plan[0].time -= (sets * rest_time) + 2
            plan[0].exercises.append(chosen_hard[counter])
            counter += 1

        for workout in plan:
            while workout.time >= sets * rest_time:

                minval = min(workout.muscle_split.values())
                types = [k for k, v in workout.muscle_split.items()
                         if v == minval]

                for type in types:
                    options = easy_exercises.filter(type=type)

                    if len(options) > 0:
                        exercise = random.choice(options)

                if exercise not in workout.exercises:
                    workout.exercises.append(exercise)
                    workout.time -= (sets * rest_time) + 2
                    workout.muscle_split[exercise.type] += 1

    elif split == "DoubleFBW":
        hard_exercises = random.sample(list(hard_exercises), k=4)

        w1_choices = hard_exercises[:2]
        w2_choices = hard_exercises[2:]

        for i, choices in enumerate([w1_choices, w2_choices]):
            for ex in choices:
                plan[i].muscle_split[ex.type] += 1
                plan[i].time -= (sets * rest_time) + 2
                plan[i].exercises.append(ex)
                plan_exercises.append(ex)

        for workout in plan:
            while workout.time >= sets * rest_time:

                minval = min(workout.muscle_split.values())
                types = [k for k, v in workout.muscle_split.items()
                         if v == minval]

                for type in types:
                    options = easy_exercises.filter(type=type)

                    if len(options) > 0:
                        exercise = random.choice(options)
                        break

                if exercise not in plan_exercises and exercise not in workout.exercises:
                    workout.exercises.append(exercise)
                    plan_exercises.append(exercise)
                    workout.time -= (sets * rest_time) + 2

                    workout.muscle_split[exercise.type] += 1

    elif split == "PowerliftingSplit":

        for i, workout in enumerate(plan):
            current_exercises = hard_exercises.filter(
                type__in=workout.muscle_split.keys())

            for exercise in current_exercises:
                if exercise in plan_exercises:
                    continue
                workout.time -= (sets * rest_time) + 2
                workout.muscle_split[exercise.type] += 1
                workout.exercises.append(exercise)
                plan_exercises.append(exercise)

        for workout in plan:
            counter = 0

            while workout.time >= reps * rest_time:

                minval = min(workout.muscle_split.values())
                types = [k for k, v in workout.muscle_split.items()
                         if v == minval]

                for type in types:

                    if counter < 2:
                        options = medium_exercises.filter(type=type)
                    else:
                        options = easy_exercises.filter(type=type)

                    if len(options) > 0:
                        exercise = random.choice(options)

                if exercise not in plan_exercises and exercise not in workout.exercises:
                    workout.exercises.append(exercise)
                    plan_exercises.append(exercise)
                    workout.time -= (reps * rest_time) + 2
                    workout.muscle_split[exercise.type] += 1
                    counter += 1

    else:

        for i, workout in enumerate(plan):
            current_exercises = hard_exercises.filter(
                type__in=workout.muscle_split.keys())

            for exercise in current_exercises:
                if exercise in plan_exercises:
                    continue
                workout.time -= reps * rest_time
                workout.muscle_split[exercise.type] += 1
                workout.exercises.append(exercise)
                plan_exercises.append(exercise)

        for workout in plan:
            while workout.time >= sets * rest_time:

                minval = min(workout.muscle_split.values())
                types = [k for k, v in workout.muscle_split.items()
                         if v == minval]

                for type in types:
                    options = easy_exercises.filter(type=type)

                    if len(options) > 0:
                        exercise = random.choice(options)
                        break

                if exercise not in workout.exercises:
                    workout.exercises.append(exercise)
                    plan_exercises.append(exercise)
                    workout.time -= (sets * rest_time) + 2

                    workout.muscle_split[exercise.type] += 1

    for i, workout in enumerate(plan):
        workout.exercises.append(abs_exercises[i])

    return (plan, reps, sets)


def listexercises():
    return [['Squat', 'L', ' The squat is a dynamic strength training exercise that requires several muscles in your upper and lower body to work together simultaneously. Many of these muscles help power you through daily tasks such as walking, climbing stairs, bending, or carrying heavy loads.', 'hard'],
            ['Goblet Squat', 'L', ' asd ', 'medium'],
            ['Glute bridge', 'L', ' asd ', 'easy'],
            ['Leg press', 'L', ' The leg press is a compound weight training exercise in which the individual pushes a weight or resistance away from them using their legs. The term leg press machine refers to the apparatus used to perform this exercise. ... It can be performed in variations, for example with one leg, or attaching bands to the leg press.', ' medium'],
            ['Lunge', 'L', ' A lunge is a single-leg bodyweight exercise that works your hips, glutes, quads, hamstrings, and core and the hard-to-reach muscles of your inner thighs. ... When done correctly, lunges can effectively target your lower-body muscles without placing added strain on your joints.', ' medium'],
            ['Deadlift', 'B', ' The deadlift is a weight training exercise in which a loaded barbell or bar is lifted off the ground to the level of the hips, torso perpendicular to the floor, before being placed back on the ground. It is one of the three powerlifting exercises, along with the squat and bench press.', 'hard'],
            ['Sumo Deadlift', 'B', '', 'medium'],
            ['Superman', 'B', '', 'easy'],
            ['Leg extension', 'L', 'The leg extension is a resistance weight training exercise that targets the quadriceps muscle in the legs. ... It should not be considered as a total leg workout, such as the squat or deadlift. The exercise consists of bending the leg at the knee and extending the legs, then lowering them back to the original position.', 'easy'],
            ['Leg curl', 'L', 'The leg curl, also known as the hamstring curl, is an isolation exercise that targets the hamstring muscles. The exercise involves flexing the lower leg against resistance towards the buttocks. ... Other exercises that can be used to strengthen the hamstrings include the glute-ham raise and the deadlift.', 'easy'],
            ['Standing calf raise', 'L', 'Standing calf raises are executed with one or both feet. They are frequently done on a raised surface with the heel lower than the toes to allow a greater stretch on the working muscles. The exercise is performed by raising the heel as far as possible.', 'medium'],
            ['Seated calf raise', 'L', 'Sitting up tall in your chair, with your feet hip width apart. Bring your feet back, so your heels are behind your knees. From this position, lifting your heels up off the floor, coming up on to your toes. Hold briefly and gently lower your heels back down.', 'easy'],
            ['Hip adductor', 'L', ',Hip adductors are the muscles in your inner thigh that support balance and alignment. These stabilizing muscles are used to adduct the hips and thighs or move them toward the midline of your body', 'medium'],
            ['Bench press', 'C', 'The bench press, or chest press, is an upper-body weight training exercise in which the trainee presses a weight upwards while lying on a weight training bench. The exercise uses the pectoralis major, the anterior deltoids, and the triceps, among other stabilizing muscles.', 'hard'],
            ['Reverse fly', 'S', '', 'medium'],
            ['Incline barbell bench press', 'C', 'bench pressing on incline', 'medium'],
            ['Close-grip barbell bench press', 'C', 'xdxd ', 'medium'],
            ['Chest fly', 'C', "The dumbbell chest fly is an upper body exercise that can help to strengthen the chest and shoulders. The traditional way to perform a dumbbell chest fly is to do the move while lying on your back on a flat or incline bench. There's also a standing variation.", 'easy'],
            ['Dumbell Bench Press', 'C', "Bench press with dumbells", 'medium'],
            ['Push-up', 'C', 'The definition of a push-up is an exercise done laying with face, palms and toes facing down, keeping legs and back straight, extending arms straight to push body up and back down again', 'easy'],
            ['Pull-down', 'B', 'The pull-down exercise is a strength training exercise designed to develop the latissimus dorsi muscle. It performs the functions of downward rotation and depression of the scapulae combined with adduction and extension of the shoulder joint.', 'medium'],
            ['Chest dips', 'C', '???/', 'easy'],
            ['Pull-up', 'B', 'A pullup is a challenging upper body exercise where you grip an overhead bar and lift your body until your chin is above that bar, ', 'hard'],
            ['Bent-over row', 'B', 'Lift the bar from the rack, bend forward at the hips, and keep the back straight with a slight bend in the knees. Lower the bar towards the floor until the elbows are completely straight, and keep the back flat as the bar is pulled towards the belly button. Then slowly lower the bar to the starting position and repeat.', 'medium'],
            ['Upright row', 'S', "An upright row is an effective exercise to build strength in the shoulders and upper back. It's a pull exercise, meaning you'll be pulling the weight toward you and targeting your posterior chain, or the muscles on the backside of your body.", 'medium'],
            ['Shoulder press', 'S', 'Sit on an upright bench holding a dumbbell in each hand at shoulder height with your palms facing away from you. Keep your chest up and your core braced, and look straight forward throughout the move', 'medium'],
            ['Dumbell Lateral raise', 'S', "The lateral raise is one of the best exercises for those looking to build shoulders like boulders. It's also a very simple movement: essentially you just raise weights to the sides and up to shoulder level, then lower them again", 'easy'],
            ['Dumbell Front raise', 'S', "asdsa", 'medium'],
            ['Reverse Fly', 'S', "asdasd", 'easy'],
            ['Shoulder shrug', 'S', 'Keep your chin up, facing straight ahead, and your neck straight. While you inhale, bring your shoulders as high up toward your ears as you can. Do the movement slowly so that you feel the resistance of your muscles. Lower your shoulders back down and breathe out before repeating the movement.', 'easy'],
            ['Pushdown', 'T', 'he triceps pushdown is one of the best exercises for triceps development. While the versatile upper-body workout is usually done on a cable machine (a fixture at most gyms), you can also perform a version of the move at home or on the go using a resistance band.', 'medium'],
            ['Isolated Triceps Extension', 'T', '', 'easy'],
            ['Skullcrushers (Lying Triceps Extensions)', 'T', '', 'medium'],
            ['The Diamond Press-up', 'T', '', 'medium'],
            ['Bench Dip', 'T', '', 'easy'],
            ['Triceps extension', 'T', 'As an isolation exercise, the tricep extension targets your tricep muscles by repetitively flexing the elbow joint against resistance. To give your triceps a workout try out the exercises below', 'medium'],
            ['Handstanp push up', 'T', '', 'medium'],
            ['Biceps curl', 'Bi', 'Hold the barbell with both hands facing up so the wrists, elbows, and shoulders are in a straight line about shoulder-width apart. Lift the barbell toward the shoulders while bending the elbows and keeping them next to the middle of the body. Slowly lower the weight to return to the starting position.', 'medium'],
            ['Bicycle Crunches ', 'A', '', 'easy'],
            ['Crunch', 'A', 'The crunch is a classic core exercise. It specifically trains your abdominal muscles, which are part of your core.', 'easy'],
            ['Plank', 'A', '', 'medium'],
            ['Seated Alternating Dumbbell Curl', 'Bi', '', 'easy'],
            ['Alternating Incline Dumbbell Curl', 'Bi', '', 'medium'],
            ['Standing Cable Curl', 'Bi', '', 'easy'],
            ['Russian twist', 'A', "Tightening your abs and keeping your butt pressed to the floor, lean back until you're at a 45-degree angle with the floor. Bring your hands together just above your abdomen. Slowly twist your body to one side, bringing your weight across one side of your body. Twist back over to the other side.", 'medium'],
            ['Leg raise', 'A', 'The leg raise is a strength training exercise which targets the iliopsoas (the anterior hip flexors). Because the abdominal muscles are used isometrically to stabilize the body during the motion, leg raises are also often used to strengthen the rectus abdominis muscle and the internal and external oblique muscles.', 'medium'],
            ['Back extension', 'B', 'A back extension is an exercise that works the lower back as well as the mid and upper back, specifically the erector spinae', 'medium']]
