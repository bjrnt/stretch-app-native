import RoutineBuilder from "./RoutineBuilder";

export default {
  Extended: new RoutineBuilder("Extended", "")
    .withDefaultLength(120)
    .withStretches(
      { eachSide: true, name: "Hip Flexor Stretch" },
      { name: "Elephant Walk" },
      { duration: 60, name: "Hamstring Stretch", pauseAfter: true },
      { name: "Pancake Stretch", pauseAfter: true },
      { eachSide: true, name: "Figure Four Stretch", pauseAfter: true },
      { name: "Lat Stretch", pauseAfter: true },
      { eachSide: true, name: "Side Stretch" },
      { eachSide: true, name: "Seated Twist Stretch", pauseAfter: true },
      { eachSide: true, name: "Pigeon Pose" },
      { eachSide: true, name: "Goal Post Arms", pauseAfter: true },
      { eachSide: true, name: "Neck Stretch", pauseAfter: true },
      { eachSide: true, name: "Calf Stretch" },
    )
    .build(),
  General: new RoutineBuilder("General", "")
    .withDefaultLength(60)
    .withStretches(
      { eachSide: true, name: "Hip Flexor Stretch" },
      { name: "Elephant Walk" },
      { duration: 30, name: "Hamstring Stretch", pauseAfter: true },
      { name: "Pancake Stretch", pauseAfter: true },
      { eachSide: true, name: "Figure Four Stretch", pauseAfter: true },
      { name: "Lat Stretch", pauseAfter: true },
      { eachSide: true, name: "Side Stretch" },
      { eachSide: true, name: "Seated Twist Stretch", pauseAfter: true },
      { eachSide: true, name: "Pigeon Pose" },
      { eachSide: true, name: "Goal Post Arms", pauseAfter: true },
      { eachSide: true, name: "Neck Stretch", pauseAfter: true },
      { eachSide: true, name: "Calf Stretch" },
    )
    .build(),
  HipFlexors: new RoutineBuilder("Hip Flexors", "https://www.youtube.com/shorts/q_3OLvzkBZg")
    .withDefaultLength(30)
    .withStretches(
      {
        description: "Sit on heels, thrust up",
        duration: 90,
        name: "Hip Flexor Thrusts",
      },
      {
        description: "With knees and quads not touching floor",
        name: "Cobra stretch",
      },
      {
        description: "Hand on same side as raised foot",
        eachSide: true,
        name: "Hip Flexor Stretch (Scorpion)",
      },
    )
    .build(),
  HipHealth: new RoutineBuilder(
    "Hip Health",
    `- [Reference 1](https://www.instagram.com/p/CyBNC89gauT/)
- [Reference 2](https://www.instagram.com/p/CzM8wQIgHSe/)
- [Reference 3](https://www.instagram.com/p/CzKCM0fAtUS/)`,
  )
    .withStretches(
      {
        duration: 120,
        name: "Banded External Hip Rotation (Pigeon)",
        pauseAfter: true,
      },
      {
        duration: 120,
        name: "Banded Internal Hip Rotation (Kneeling)",
      },
    )
    .withExercises(
      {
        description: `- Opposite hand to raised foot, resting on back of chair
- Hold each rep for 5 seconds
- Open up hips to the side`,
        name: "Assisted Hip Airplane",
        repetitions: 5,
      },
      {
        description: `1. Lie on the side
2. Bottom leg straight, top leg bent
3. Place big toe of top leg behind bottom leg at the Achilles
4. Roll the pelvis forward at least 45 degrees
5. From this position, lift the top knee off the ground whilst keeping toe behind the Achilles
6. Perform 15–25 reps, then change sides

_1–2 sets_`,
        name: "Lock Clams",
        repetitions: 20,
      },
      {
        description: `- Hold each for 5 seconds
- Band optional`,
        eachSide: true,
        name: "Side Plank Clam",
        repetitions: 8,
      },
      {
        description: `1-2 sets

**Setup**
- Lie on your side. Stack your knees and hips so you're not tilted forward or backward.
- Rest on your shoulder and keep your body aligned.

**Step 1 — Hip lift + diagonal reach**
1. Lift your hips off the ground.
2. Pick a point diagonally in front of you and reach toward it with your top arm.
3. Keep hips and knees stacked.

**Step 2 — Add top-leg lift**
1. While keeping hips lifted and stacked, raise your top leg.
2. Maintain the leg lift as you continue the diagonal reaches.

**Step 3 — Long-body stretch back**
1. From the hip lift with the leg raised, bring the top leg slightly back and reach the top arm overhead/back to lengthen your whole side body.
2. Return to the start position and repeat with control.`,
        name: "DNS Star",
        repetitions: 10,
      },
      {
        description: `~5 reps at different depths`,
        name: "Banded Squat Hip Opener",
        repetitions: 5,
      },
    )
    .build(),
  Morning: new RoutineBuilder("Morning", "")
    .withDefaultLength(60)
    .withStretches(
      { eachSide: true, name: "Single-legged Hip Rotations" },
      {
        description: "With both knees touching the floor",
        name: "Hip Rotations",
      },
      { name: "Standing Downward Dog" },
      {
        description: "Hollow body, squeeze glute",
        eachSide: true,
        name: "Free-standing Hip Flexor Stretch",
      },
      { name: "Lounge Chair/Reverse Plank" },
      { name: "Straight-legged Good Mornings" },
      { name: "Deep Squat Sit" },
      {
        description: "Bent knees for 5, then straighter legs. Tap knees on floor for reps.",
        name: "Downward Dog Press with Bent Knees",
      },
      { name: "Bear Crawl" },
    )
    .build(),
  Physio: new RoutineBuilder("Physio", "")
    .withDefaultLength(120)
    .withStretches({ name: "Child's Pose" }, { name: "Happy Baby" })
    .build(),
  Shoulders: new RoutineBuilder("Shoulder Health", "")
    .withDescription(
      `- Based on [How I fixed Shoulder Pain & Imbalances](https://www.youtube.com/watch?v=i4ve0nuXz0M)`,
    )
    .withSets(3)
    .withExercises(
      {
        description: `- Round upper spine at end of rep
- Extend arms all the way back
- Hands face roof at the start of the rep`,
        name: "Banded Protraction",
        repetitions: 10,
      },
      {
        description: `- "Break the bar apart"
- Pull until it hits your chest
- Crank out more external rotation at the end`,
        name: "Band Pull-Apart",
        repetitions: 10,
      },
      {
        description: `- Pull shoulder-blade down and back`,
        eachSide: true,
        name: "Banded External Rotation",
        repetitions: 10,
      },
    )
    .withStretches({
      duration: 20,
      name: "Dead Hang",
    })
    .build(),
  Test: new RoutineBuilder("Test", "")
    .withDescription(
      `This is a test routine, for my own testing.
  
- Test 1
- Test 2
- Test 3`,
    )
    .withDefaultLength(5)
    .withSets(10)
    .withStretches(
      {
        description: "Hello!\nWhat is up?\n- [Lol](http://google.com)\n",
        name: "Test1",
        pauseAfter: true,
      },
      { name: "Test2" },
    )
    .withExercises({ name: "Hello", repetitions: 3 })
    .build(),
  Wrists: new RoutineBuilder("Wrist Stretches", "")
    .withDefaultLength(120)
    .withStretches({ name: "Flexors" }, { name: "Extensors" })
    .build(),
};
